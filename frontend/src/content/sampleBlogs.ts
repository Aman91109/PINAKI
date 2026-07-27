/**
 * Placeholder blog posts.
 *
 * These live here rather than inside the components because the list section
 * and the detail page each used to keep their own copy — they had drifted to
 * different titles and different authors, including one ("Zephyr Croft") who
 * does not exist. Anything rendered from this file is badged as a sample.
 */

export interface SampleBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  readTime: string;
  tags: string[];
  createdAt: string;
}

export const sampleBlogs: SampleBlog[] = [
  {
    _id: 'b1',
    title: 'Scroll-linked animation in the Next.js App Router',
    slug: 'mastering-framer-motion-in-next-js-app-router',
    excerpt:
      'Where to put motion so it survives streaming and server components, and which properties to animate if you care about frame budget.',
    content: `# Motion that survives the App Router

Server components cannot hold animation state, so every motion primitive has to
sit behind a client boundary. The trick is putting that boundary as low in the
tree as possible — wrap the animated element, not the page.

## Keep the boundary small

\`\`\`javascript
'use client';

import { motion } from 'framer-motion';

export function FadeIn({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
\`\`\`

The page stays a server component; only the wrapper ships JavaScript.

## Animate the cheap properties

Stick to \`transform\` and \`opacity\`. Both are handled on the compositor, so
they never trigger layout or paint. Animating \`width\`, \`height\`, \`top\` or
\`left\` forces a reflow on every frame and will drop frames on mid-range phones.

## Respect reduced motion

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
\`\`\`

One rule in your global stylesheet covers every animation on the site.`,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    author: 'Somesh Kumar Mishra',
    readTime: '4 min read',
    tags: ['Next.js', 'Performance'],
    createdAt: new Date('2026-06-18').toISOString(),
  },
  {
    _id: 'b2',
    title: 'Serving Python ML models behind a Node API',
    slug: 'serving-machine-learning-models-via-node-js-rest-apis',
    excerpt:
      'Two patterns for putting a trained model in production — a separate inference service versus a spawned subprocess — and when each one is the right call.',
    content: `# Getting a model into production

A trained model is not a product until something can call it. There are two
patterns worth knowing, and the wrong one will cost you uptime.

## Pattern A: a separate inference service

Keep Python and Node in separate processes. Serve the model from FastAPI and
have your Node API call it over HTTP.

\`\`\`javascript
app.post('/api/predict', async (req, res) => {
  const response = await fetch(process.env.INFERENCE_URL + '/predict', {
    method: 'POST',
    body: JSON.stringify(req.body),
    headers: { 'Content-Type': 'application/json' },
  });
  const prediction = await response.json();
  res.status(200).json({ success: true, data: prediction });
});
\`\`\`

This is the default choice. The two services scale independently, a model
reload never restarts your API, and a Python crash does not take Node with it.

## Pattern B: spawning a subprocess

\`\`\`javascript
const { spawn } = require('child_process');

app.post('/api/classify', (req, res) => {
  const proc = spawn('python', ['scripts/classifier.py', req.body.text]);
  let out = '';
  proc.stdout.on('data', (d) => { out += d; });
  proc.on('close', () => res.json({ success: true, classification: out }));
});
\`\`\`

Only reach for this on a single box with low traffic. Every request pays full
interpreter startup and reloads the model weights, which is usually far slower
than the inference itself.

## Which to pick

If the model is larger than a few hundred megabytes, or you expect more than a
handful of requests per second, use Pattern A. We have never regretted the
extra service; we have regretted the subprocess.`,
    image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=800',
    author: 'Nishant Kumar',
    readTime: '6 min read',
    tags: ['Python', 'Architecture'],
    createdAt: new Date('2026-05-02').toISOString(),
  },
];
