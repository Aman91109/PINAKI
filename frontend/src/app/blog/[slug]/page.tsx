import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Badge from '@/components/ui/primitives/Badge';
import Button from '@/components/ui/primitives/Button';
import { API_BASE_URL } from '@/config';

const fallbackBlogs = [
  {
    _id: 'b1',
    title: 'Mastering Framer Motion in Next.js App Router',
    slug: 'mastering-framer-motion-in-next-js-app-router',
    excerpt: 'Learn how to construct buttery-smooth scroll-triggered entrance clips and responsive glass overlays.',
    content: `
# Core Scroll Physics with Framer Motion

Framer motion has revolutionized visual development in React. By using standard \`motion.div\` wrappers and attaching them to scroll states, we can build Awwwards-level components.

## Getting Started

First, install the motion package:
\`\`\`bash
npm i framer-motion
\`\`\`

Next, wrap your container in an \`AnimatePresence\` component to smoothly fade exit triggers:
\`\`\`javascript
import { motion, AnimatePresence } from 'framer-motion';

export default function SmoothPanel() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="rounded-xl border border-line bg-surface p-6"
    >
      <h3>Futuristic Card</h3>
    </motion.div>
  );
}
\`\`\`

## Tips for High Performance
- Avoid animating layout triggers like width, height, top, or left.
- Stick to transform matrices (\`x\`, \`y\`, \`scale\`, \`rotate\`) and \`opacity\`.
- Keep Three.js backgrounds in separate threads or canvas nodes to prevent layout recalculations.
    `,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    author: 'Zephyr Croft',
    readTime: '4 Min Read',
    tags: ['Next.js', 'Framer Motion', 'Web Design'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'b2',
    title: 'Serving Machine Learning Models via Node.js Rest APIs',
    slug: 'serving-machine-learning-models-via-node-js-rest-apis',
    excerpt: 'An in-depth guide on deploying Python NLP scripts and using Express child process streams.',
    content: `
# Interfacing Express and Python

Machine learning engineers often run into bottlenecks when attempting to host predictive neural nets on JavaScript environments. Here are two ways to connect Node.js and Python.

## Approach A: The Microservice Architecture (Recommended)

Keep the environments separated. Deploy your Python code using a Flask or FastAPI microservice, and have Express query the prediction endpoint.

\`\`\`javascript
// Node Express Client calling FastAPI
app.post('/api/predict', async (req, res) => {
  const response = await fetch('https://python-ai-api/predict', {
    method: 'POST',
    body: JSON.stringify(req.body),
    headers: { 'Content-Type': 'application/json' }
  });
  const prediction = await response.json();
  res.status(200).json({ success: true, data: prediction });
});
\`\`\`

## Approach B: Child Process Spawning

If you want single-server execution, spawn a Python subprocess inside the Express router.

\`\`\`javascript
const { spawn } = require('child_process');

app.post('/api/classify', (req, res) => {
  const pythonProcess = spawn('python', ['scripts/classifier.py', JSON.stringify(req.body.text)]);
  
  pythonProcess.stdout.on('data', (data) => {
    res.json({ success: true, classification: data.toString() });
  });
});
\`\`\`
    `,
    image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=800',
    author: 'Aiden Vance',
    readTime: '6 Min Read',
    tags: ['Express', 'Python', 'Machine Learning'],
    createdAt: new Date().toISOString(),
  },
];

async function getBlogPost(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/blogs/${slug}`, {
      next: { revalidate: 60 } // Cache and revalidate
    });
    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
  } catch (err) {
    console.warn(`Could not connect to blog details API for ${slug}. Loading fallback.`);
  }

  // Fallback match
  return fallbackBlogs.find(b => b.slug === slug) || null;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogPost(slug);

  if (!blog) {
    return (
      <div className="flex min-h-screen flex-col justify-between bg-canvas">
        <Navbar />
        <div className="mx-auto my-auto max-w-md p-6 text-center">
          <h1 className="mb-4 font-space text-3xl font-bold text-ink">Post Not Found</h1>
          <p className="mb-6 font-poppins text-sm text-ink-muted">
            The requested insights entry does not exist on our servers.
          </p>
          <Button href="/#blog">Back to Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-canvas">
      <Navbar />

      <article className="mx-auto w-full max-w-3xl px-6 pb-24 pt-32">
        <Link
          href="/#blog"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Intel Stream
        </Link>

        <div className="mb-4 flex flex-wrap gap-2">
          {(blog.tags || []).map((tag: string) => (
            <Badge key={tag} tone="accent" size="sm">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="mb-6 font-space text-3xl font-bold leading-tight text-ink md:text-5xl">
          {blog.title}
        </h1>

        <div className="mb-10 flex flex-wrap items-center gap-6 border-b border-line pb-8 font-mono text-xs uppercase text-ink-subtle">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-accent" />
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-accent" />
            {blog.readTime}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-accent" />
            By {blog.author}
          </span>
        </div>

        <div className="relative mb-12 h-[250px] w-full overflow-hidden rounded-xl border border-line md:h-[420px]">
          <Image
            src={blog.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        {/* Minimal markdown renderer for headings, code fences and paragraphs. */}
        <div className="flex flex-col gap-5 font-poppins text-sm leading-relaxed text-ink-muted md:text-base">
          {blog.content.split('\n\n').map((para: string, idx: number) => {
            if (para.startsWith('# ')) {
              return (
                <h2
                  key={idx}
                  className="mb-1 mt-6 font-space text-2xl font-bold tracking-tight text-ink md:text-3xl"
                >
                  {para.replace('# ', '')}
                </h2>
              );
            }
            if (para.startsWith('## ')) {
              return (
                <h3
                  key={idx}
                  className="mb-1 mt-4 font-space text-xl font-semibold tracking-tight text-ink md:text-2xl"
                >
                  {para.replace('## ', '')}
                </h3>
              );
            }
            if (para.startsWith('```')) {
              const code = para.split('\n').slice(1, -1).join('\n');
              return (
                <pre
                  key={idx}
                  className="overflow-x-auto rounded-xl border border-line bg-surface p-5 font-mono text-xs leading-relaxed text-accent"
                >
                  <code>{code}</code>
                </pre>
              );
            }
            return <p key={idx}>{para}</p>;
          })}
        </div>
      </article>

      <Footer />
    </div>
  );
}
