/**
 * Curated topic pool for the daily post generator.
 *
 * The generator picks from this list rather than inventing its own subject.
 * That is deliberate: an open-ended "write a blog post" prompt drifts into
 * generic listicles within a week, and there is no review step to catch it.
 * Every topic here maps to something the studio actually works on, so the
 * output stays on-brand even though nobody reads it before it goes live.
 *
 * `image` is a real, hand-picked Unsplash URL — never model-generated, because
 * a hallucinated image URL renders as a broken image on a live site.
 *
 * To retire a topic, delete it. To add one, append an entry with a unique
 * `key`; the rotation picks it up on the next run.
 */

const TOPICS = [
  {
    key: 'nextjs-server-components-data',
    title: 'Data fetching patterns in React Server Components',
    angle:
      'Where to fetch data in the App Router, why fetching in a layout is usually wrong, and how request deduplication changes the calculus.',
    tags: ['Next.js', 'Architecture'],
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'nextjs-caching-mental-model',
    title: 'A working mental model for the Next.js cache layers',
    angle:
      'The request cache, the data cache, and the full route cache are three different things. Which one bit you, and how to tell them apart.',
    tags: ['Next.js', 'Performance'],
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'core-web-vitals-real-fixes',
    title: 'The Core Web Vitals fixes that actually moved the number',
    angle:
      'LCP, CLS and INP on a real marketing site: which interventions produced measurable change and which were cargo cult.',
    tags: ['Performance', 'Frontend'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'postgres-index-decisions',
    title: 'Choosing indexes without guessing',
    angle:
      'Reading EXPLAIN ANALYZE output, when a composite index beats two single-column ones, and the cost of an index nobody queries.',
    tags: ['PostgreSQL', 'Performance'],
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'mongo-schema-design',
    title: 'Embed or reference: schema decisions in MongoDB',
    angle:
      'The document-size ceiling, unbounded arrays, and the read patterns that should drive the choice rather than instinct.',
    tags: ['MongoDB', 'Architecture'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'jwt-session-tradeoffs',
    title: 'JWTs versus sessions, decided on the actual tradeoffs',
    angle:
      'Revocation, token size, refresh rotation, and why "stateless" is doing a lot of unexamined work in most arguments.',
    tags: ['Security', 'Node'],
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'rate-limiting-patterns',
    title: 'Rate limiting an API without a Redis cluster',
    angle:
      'Fixed window, sliding window and token bucket compared, plus what changes once you run more than one process.',
    tags: ['Node', 'Architecture'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'background-jobs-node',
    title: 'Running background jobs in Node without losing work',
    angle:
      'In-process schedulers versus a real queue, what happens on deploy, and why at-least-once delivery forces idempotency.',
    tags: ['Node', 'Architecture'],
    image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'serving-ml-models',
    title: 'Putting a trained model behind an API',
    angle:
      'Separate inference service versus in-process loading, cold start cost, and where batching starts to pay off.',
    tags: ['Python', 'Machine Learning'],
    image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'rag-retrieval-quality',
    title: 'Why your RAG answers are wrong (it is usually retrieval)',
    angle:
      'Chunking strategy, embedding mismatch and reranking — debugging the retrieval step before blaming the model.',
    tags: ['AI', 'Python'],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'llm-cost-control',
    title: 'Keeping LLM costs predictable in production',
    angle:
      'Prompt caching, picking a model per route instead of globally, and instrumenting token spend before it surprises you.',
    tags: ['AI', 'Architecture'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'web-scraping-that-lasts',
    title: 'Writing scrapers that survive the site changing',
    angle:
      'Selector strategy, failure detection, polite rate limits, and knowing when an API exists that you missed.',
    tags: ['Python', 'Automation'],
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'ci-cd-small-team',
    title: 'A CI/CD setup proportionate to a small team',
    angle:
      'What is worth automating at three engineers, what is premature, and the checks that catch the most per minute spent.',
    tags: ['DevOps', 'Tooling'],
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'docker-image-size',
    title: 'Cutting a Node image from 1.2GB to under 200MB',
    angle:
      'Multi-stage builds, what actually belongs in the runtime layer, and why layer order decides your rebuild time.',
    tags: ['Docker', 'DevOps'],
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'accessible-components',
    title: 'Accessible interactive components without a library',
    angle:
      'Focus management, ARIA that helps rather than hurts, and keyboard paths through modals, menus and accordions.',
    tags: ['Accessibility', 'Frontend'],
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'design-tokens-tailwind',
    title: 'Design tokens that survive contact with a real codebase',
    angle:
      'Semantic naming over literal colour names, contrast budgeting, and keeping a palette coherent as a project grows.',
    tags: ['Design Systems', 'Frontend'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'form-validation-layers',
    title: 'Validating the same form in three places without duplication',
    angle:
      'Sharing a schema across client, server and database, and deciding which layer owns which class of error.',
    tags: ['TypeScript', 'Architecture'],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'file-uploads-at-scale',
    title: 'File uploads: the parts that break in production',
    angle:
      'Direct-to-storage uploads, size and type validation you can trust, and cleaning up orphaned objects.',
    tags: ['Node', 'AWS'],
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'error-monitoring-signal',
    title: 'Error monitoring that produces signal instead of noise',
    angle:
      'Grouping, sampling, and deciding what deserves a page at 3am versus a line in a weekly digest.',
    tags: ['DevOps', 'Observability'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'database-migrations-safely',
    title: 'Shipping schema migrations without downtime',
    angle:
      'Expand-and-contract, backfilling large tables, and why the rollback plan matters more than the migration.',
    tags: ['PostgreSQL', 'DevOps'],
    image: 'https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'typescript-types-that-help',
    title: 'TypeScript types that catch bugs instead of describing them',
    angle:
      'Discriminated unions, making illegal states unrepresentable, and knowing when to stop type-golfing.',
    tags: ['TypeScript', 'Architecture'],
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'seo-for-spa-teams',
    title: 'SEO for teams who default to client-side rendering',
    angle:
      'What crawlers actually execute, why client-fetched content underperforms, and where server rendering earns its cost.',
    tags: ['SEO', 'Next.js'],
    image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'webhooks-you-can-trust',
    title: 'Receiving webhooks you can actually trust',
    angle:
      'Signature verification, replay protection, idempotency keys, and responding fast enough to avoid retries.',
    tags: ['Node', 'Security'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'image-pipeline-web',
    title: 'An image pipeline that does not wreck your LCP',
    angle:
      'Format selection, responsive sizes, priority hints, and the difference between lazy and deferred.',
    tags: ['Performance', 'Frontend'],
    image: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'opencv-preprocessing',
    title: 'Preprocessing that decides whether your vision model works',
    angle:
      'Normalisation, augmentation that reflects real inputs, and diagnosing a model that fails only on production images.',
    tags: ['Computer Vision', 'Python'],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'timeseries-forecasting-baseline',
    title: 'Start every forecasting project with a boring baseline',
    angle:
      'Why last-value and seasonal-naive baselines matter, and how often the deep model fails to beat them.',
    tags: ['Machine Learning', 'Python'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'api-versioning-strategy',
    title: 'Versioning an API you will have to keep supporting',
    angle:
      'URL versus header versioning, additive change discipline, and communicating deprecation before it hurts.',
    tags: ['API Design', 'Architecture'],
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'env-config-secrets',
    title: 'Configuration and secrets without a leak waiting to happen',
    angle:
      'Validating environment variables at boot, keeping secrets out of the bundle, and rotating without a redeploy.',
    tags: ['Security', 'DevOps'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'realtime-without-websockets',
    title: 'Real-time features before you reach for WebSockets',
    angle:
      'Polling, SSE and WebSockets compared on operational cost, and the point where each stops being adequate.',
    tags: ['Node', 'Architecture'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
  },
  {
    key: 'estimating-software-work',
    title: 'Estimating client work when you have been wrong before',
    angle:
      'Breaking scope until estimates stop being fiction, pricing the unknowns, and re-quoting without damaging trust.',
    tags: ['Practice', 'Process'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
  },
];

/**
 * Picks the topic that has gone longest without being used.
 *
 * `recentKeys` should be the topicKeys of the most recent posts, newest first.
 * Anything absent from that list has never run (or has rotated out) and wins;
 * otherwise the least-recently-used topic is chosen. Deterministic, so a
 * duplicate cron firing on the same day cannot pick a different topic and
 * publish twice.
 */
function pickTopic(recentKeys = []) {
  const unused = TOPICS.filter((t) => !recentKeys.includes(t.key));
  if (unused.length > 0) return unused[0];

  let oldest = TOPICS[0];
  let oldestIndex = -1;
  for (const topic of TOPICS) {
    const index = recentKeys.indexOf(topic.key);
    if (index > oldestIndex) {
      oldestIndex = index;
      oldest = topic;
    }
  }
  return oldest;
}

module.exports = { TOPICS, pickTopic };
