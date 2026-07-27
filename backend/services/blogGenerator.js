const Anthropic = require('@anthropic-ai/sdk');
const Blog = require('../models/Blog');
const mockDb = require('../utils/mockDb');
const { pickTopic } = require('./blogTopics');

/**
 * Daily blog post generator.
 *
 * Writes one post per day from a curated topic (see blogTopics.js) and
 * publishes it immediately — there is no human review step, which is a
 * deliberate choice by the site owner. Because nothing catches a bad post
 * before readers do, everything below is built around not publishing garbage:
 *
 *   - the topic comes from a fixed list, so content cannot drift off-brand
 *   - the model must return a fixed JSON shape (structured outputs)
 *   - the result is validated in code before it is written anywhere
 *   - a partial, truncated or refused generation is discarded, never saved
 *   - one post per day maximum, enforced by a date check, not by the caller
 *   - BLOG_AUTOGEN_ENABLED=false is a hard kill switch
 *
 * Posts are stored with aiGenerated: true so they can be audited or bulk
 * removed later.
 */

const MODEL = 'claude-opus-5';
const AUTHOR = 'Pinaki';

// Structured-output schema. Note: JSON Schema length/count constraints
// (minLength, minItems, …) are NOT supported by the API, so size limits are
// enforced by validatePost() below rather than declared here.
const POST_SCHEMA = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'Post title. Sentence case, no trailing period, under 80 characters.',
    },
    excerpt: {
      type: 'string',
      description: 'One or two sentences summarising the post. 100-220 characters.',
    },
    content: {
      type: 'string',
      description:
        'The full post body in Markdown. Starts with a single "# " H1, uses "## " subheadings, and includes at least one fenced code block.',
    },
    readTime: {
      type: 'string',
      description: 'Estimated reading time, formatted exactly like "6 min read".',
    },
    tags: {
      type: 'array',
      description: 'Two or three short topic tags.',
      items: { type: 'string' },
    },
  },
  required: ['title', 'excerpt', 'content', 'readTime', 'tags'],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `You write engineering posts for Pinaki, a three-person freelance studio that builds web applications, AI systems and automation with Next.js, Node, Python, PostgreSQL and AWS.

Voice and standards:
- Write for a working engineer who has hit this problem, not for a search engine.
- Be concrete and opinionated. State a position and defend it with reasoning.
- Include real, runnable code. Short, focused examples that illustrate one idea.
- Prefer specifics over adjectives. "Cut p95 from 800ms to 120ms" beats "dramatically faster".
- Cover the tradeoff honestly, including when the advice does not apply.

Hard rules:
- Never invent client names, project names, metrics, benchmarks or quotes. If you
  need a number to make a point, frame it as illustrative ("suppose the table has
  ten million rows"), never as something Pinaki measured.
- No marketing copy, no calls to action, no "in today's fast-paced world" openers.
- Do not claim the studio built or shipped anything specific.
- Do not mention that this post was generated automatically.
- Plain prose. No emoji. No exclamation marks.`;

function buildUserPrompt(topic) {
  return `Write today's post on this topic.

Title direction: ${topic.title}
Angle: ${topic.angle}

Requirements:
- 900 to 1400 words of body content.
- Open with the problem, not with background. The first paragraph should make a
  reader who has this problem recognise it.
- Use "## " subheadings to break up the argument. Three to five of them.
- Include at least one fenced code block with a language tag, showing real code.
- Close with the tradeoff or the case where this approach is wrong — not a summary.
- The title you return may refine the direction above, but must stay on the topic.`;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 90);
}

/**
 * Rejects anything that would embarrass the site if it went live. Returns an
 * array of problems; empty means the post is publishable.
 */
function validatePost(post) {
  const problems = [];
  const { title, excerpt, content, readTime, tags } = post;

  if (typeof title !== 'string' || title.trim().length < 15 || title.length > 110) {
    problems.push(`title length out of range (${title?.length})`);
  }
  if (typeof excerpt !== 'string' || excerpt.trim().length < 60 || excerpt.length > 300) {
    problems.push(`excerpt length out of range (${excerpt?.length})`);
  }
  if (typeof content !== 'string' || content.trim().length < 900) {
    problems.push(`content too short (${content?.length})`);
  }
  if (typeof content === 'string') {
    if (!/^#\s+\S/m.test(content)) problems.push('content has no H1 heading');
    if (!/^##\s+\S/m.test(content)) problems.push('content has no H2 subheading');
    if (!content.includes('```')) problems.push('content has no code block');
    // Catches a model that emitted its own scaffolding instead of prose.
    if (/\b(lorem ipsum|TODO|TBD|\[insert|placeholder)\b/i.test(content)) {
      problems.push('content contains placeholder text');
    }
  }
  if (!Array.isArray(tags) || tags.length < 1 || tags.length > 4) {
    problems.push(`tags count out of range (${tags?.length})`);
  }
  if (typeof readTime !== 'string' || !/\d/.test(readTime)) {
    problems.push('readTime missing a number');
  }

  return problems;
}

// ── Storage helpers (Mongo or the JSON fallback) ────────────────────────────

async function recentPosts(limit = 40) {
  if (global.useMockDB) {
    return mockDb
      .find('Blog')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }
  return Blog.find().sort({ createdAt: -1 }).limit(limit).lean();
}

async function slugExists(slug) {
  if (global.useMockDB) return Boolean(mockDb.findOne('Blog', { slug }));
  return Boolean(await Blog.findOne({ slug }).lean());
}

async function savePost(doc) {
  if (global.useMockDB) return mockDb.create('Blog', doc);
  return Blog.create(doc);
}

function isSameUtcDay(a, b) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

// ── Model call ──────────────────────────────────────────────────────────────

let client;
function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

async function requestPost(topic) {
  const params = {
    model: MODEL,
    max_tokens: 16000,
    // Adaptive is the default on Opus 5; stated explicitly so the intent is
    // obvious to anyone reading this later.
    thinking: { type: 'adaptive' },
    output_config: {
      effort: process.env.BLOG_AUTOGEN_EFFORT || 'medium',
      format: { type: 'json_schema', schema: POST_SCHEMA },
    },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(topic) }],
  };

  // Server-side fallback: if the safety classifiers decline, the API re-runs
  // the request on a fallback model in the same call instead of returning a
  // refusal. Harmless for this workload, but an unattended job should not stop
  // producing because of one edge-case decline.
  try {
    return await getClient().beta.messages.create({
      ...params,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
    });
  } catch (err) {
    const message = String(err?.message || '');
    const isFallbackRejection =
      err?.status === 400 && /fallback|beta/i.test(message);
    if (!isFallbackRejection) throw err;
    console.warn(
      '[blog-autogen] server-side fallback unavailable, retrying without it:',
      message
    );
    return getClient().messages.create(params);
  }
}

function extractJson(response) {
  if (response.stop_reason === 'refusal') {
    throw new Error(
      `model refused the request (${response.stop_details?.category || 'no category'})`
    );
  }
  if (response.stop_reason === 'max_tokens') {
    throw new Error('response hit max_tokens — JSON would be truncated');
  }

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock) throw new Error('response contained no text block');

  return JSON.parse(textBlock.text);
}

// ── Entry point ─────────────────────────────────────────────────────────────

/**
 * Generates and publishes today's post.
 *
 * @param {object}  options
 * @param {boolean} options.force  Bypass the one-per-day check (manual runs).
 * @returns {Promise<{status: string, slug?: string, title?: string, reason?: string}>}
 *          Never throws for expected conditions — callers get a status instead.
 */
async function generateDailyPost({ force = false } = {}) {
  if (process.env.BLOG_AUTOGEN_ENABLED === 'false') {
    return { status: 'disabled', reason: 'BLOG_AUTOGEN_ENABLED is false' };
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return { status: 'skipped', reason: 'ANTHROPIC_API_KEY is not set' };
  }

  const recent = await recentPosts();

  if (!force && recent.length > 0) {
    const newest = new Date(recent[0].createdAt);
    if (isSameUtcDay(newest, new Date())) {
      return { status: 'skipped', reason: 'a post already exists for today' };
    }
  }

  const topic = pickTopic(recent.map((p) => p.topicKey).filter(Boolean));

  let post;
  try {
    post = extractJson(await requestPost(topic));
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      console.error('[blog-autogen] rate limited; skipping today.');
      return { status: 'failed', reason: 'rate limited' };
    }
    if (err instanceof Anthropic.APIConnectionError) {
      console.error('[blog-autogen] could not reach the API; skipping today.');
      return { status: 'failed', reason: 'connection error' };
    }
    console.error('[blog-autogen] generation failed:', err.message);
    return { status: 'failed', reason: err.message };
  }

  const problems = validatePost(post);
  if (problems.length > 0) {
    // Nothing is written. A rejected post simply means no post today, which is
    // strictly better than publishing a broken one.
    console.error('[blog-autogen] rejected generated post:', problems.join('; '));
    return { status: 'rejected', reason: problems.join('; ') };
  }

  let slug = slugify(post.title);
  if (!slug) {
    return { status: 'rejected', reason: 'title produced an empty slug' };
  }
  if (await slugExists(slug)) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const saved = await savePost({
    title: post.title.trim(),
    slug,
    excerpt: post.excerpt.trim(),
    content: post.content.trim(),
    image: topic.image,
    author: AUTHOR,
    readTime: post.readTime.trim(),
    tags: post.tags.slice(0, 3).concat(topic.tags).filter(
      (tag, i, all) => all.indexOf(tag) === i
    ).slice(0, 3),
    topicKey: topic.key,
    aiGenerated: true,
  });

  console.log(`[blog-autogen] published "${saved.title}" (${saved.slug})`);
  return { status: 'published', slug: saved.slug, title: saved.title };
}

module.exports = { generateDailyPost, validatePost, slugify };
