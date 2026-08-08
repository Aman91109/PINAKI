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

const MODEL = 'gpt-4o';
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

async function requestPost(topic) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(topic) }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'blog_post',
          strict: true,
          schema: POST_SCHEMA,
        }
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || response.statusText || 'Unknown OpenAI API Error';
    throw new Error(`OpenAI API failed with status ${response.status}: ${message}`);
  }

  return response.json();
}

function extractJson(response) {
  const choice = response.choices?.[0];
  if (!choice) throw new Error('OpenAI response returned no choices');
  if (choice.finish_reason === 'length') {
    throw new Error('response hit token limit — JSON is truncated');
  }
  if (choice.finish_reason === 'content_filter') {
    throw new Error('OpenAI response was blocked by content filters');
  }

  const contentText = choice.message?.content;
  if (!contentText) throw new Error('OpenAI response contained no content text');

  return JSON.parse(contentText);
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
  if (!process.env.OPENAI_API_KEY) {
    return { status: 'skipped', reason: 'OPENAI_API_KEY is not set' };
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
