'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge, SampleNotice, SampleTag, Section, SectionHeading } from '@/components/ui/primitives';
import { sampleBlogs, type SampleBlog } from '@/content/sampleBlogs';
import { API_BASE_URL } from '@/config';

type BlogType = Omit<SampleBlog, 'content'> & { content?: string };

export default function BlogSection() {
  const [blogs, setBlogs] = useState<BlogType[]>(sampleBlogs);
  const [isSample, setIsSample] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/blogs`);
        const data = await res.json();
        if (data.success && data.data?.length) {
          setBlogs(data.data);
          setIsSample(false);
        }
      } catch {
        console.warn('Blog API unreachable. Showing sample posts.');
      }
    };
    fetchBlogs();
  }, []);

  if (!blogs.length) return null;

  return (
    <Section id="blog" tone="canvas" width="lg">
      <SectionHeading
        index="08"
        eyebrow="Writing"
        title="Notes from the build."
        description="Occasional write-ups on decisions we had to make on real projects."
      />

      {isSample && <SampleNotice label="These two posts are placeholder drafts." />}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {blogs.slice(0, 2).map((blog, idx) => (
          <motion.article
            key={blog._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group"
          >
            <Link
              href={`/blog/${blog.slug}`}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors duration-200 hover:border-line-strong"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-line">
                <Image
                  src={blog.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                {isSample && (
                  <span className="absolute left-3 top-3">
                    <SampleTag />
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                  <time dateTime={blog.createdAt}>
                    {new Date(blog.createdAt).toLocaleDateString('en-GB', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                  <span aria-hidden className="text-line-strong">/</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {blog.readTime}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-accent md:text-xl">
                  {blog.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{blog.excerpt}</p>

                <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                  <div className="flex gap-1.5">
                    {(blog.tags || []).slice(0, 2).map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                  <span className="flex items-center gap-1 font-display text-xs text-ink-subtle transition-colors group-hover:text-accent">
                    Read
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
