'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge, Card, Section, SectionHeading } from '@/components/ui/primitives';
import { API_BASE_URL } from '@/config';

const fallbackBlogs = [
  {
    _id: 'b1',
    title: 'Mastering Framer Motion in Next.js App Router',
    slug: 'mastering-framer-motion-in-next-js-app-router',
    excerpt:
      'Learn how to construct buttery-smooth scroll-triggered entrance clips and responsive overlays.',
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
    excerpt:
      'An in-depth guide on deploying Python NLP scripts and using Express child process streams.',
    image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=800',
    author: 'Aiden Vance',
    readTime: '6 Min Read',
    tags: ['Express', 'Python', 'Machine Learning'],
    createdAt: new Date().toISOString(),
  },
];

interface BlogType {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  author: string;
  readTime: string;
  tags: string[];
  createdAt: string;
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<BlogType[]>(fallbackBlogs);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/blogs`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setBlogs(data.data);
        }
      } catch {
        console.warn('Could not connect to blogs API. Using local fallbacks.');
      }
    };
    fetchBlogs();
  }, []);

  return (
    <Section id="blog" tone="canvas">
      <SectionHeading eyebrow="Intel Stream" title="Latest Agency Insights" />

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {blogs.slice(0, 2).map((blog, idx) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            className="group h-full"
          >
            <Link href={`/blog/${blog.slug}`} className="block h-full">
              <Card interactive className="flex h-full flex-col justify-between">
                <div>
                  <div className="relative mb-6 h-[220px] w-full overflow-hidden rounded-lg border border-line">
                    <Image
                      src={blog.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="mb-3 flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase text-ink-subtle">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {blog.readTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      {blog.author}
                    </span>
                  </div>

                  <h3 className="mb-3 font-space text-lg font-bold leading-snug text-ink transition-colors group-hover:text-accent md:text-xl">
                    {blog.title}
                  </h3>

                  <p className="mb-6 font-poppins text-xs leading-relaxed text-ink-muted">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
                  <div className="flex gap-1.5">
                    {(blog.tags || []).slice(0, 2).map((tag) => (
                      <Badge key={tag} tone="accent">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <span className="flex items-center gap-1.5 font-space text-[11px] font-medium uppercase tracking-widest text-ink transition-colors group-hover:text-accent">
                    Read Article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
