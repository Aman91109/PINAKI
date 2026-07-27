import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Badge from '@/components/ui/primitives/Badge';
import Button from '@/components/ui/primitives/Button';
import { SampleTag } from '@/components/ui/primitives';
import { sampleBlogs } from '@/content/sampleBlogs';
import { API_BASE_URL } from '@/config';

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
  return sampleBlogs.find((b) => b.slug === slug) || null;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogPost(slug);

  if (!blog) {
    return (
      <div className="flex min-h-screen flex-col justify-between bg-canvas">
        <Navbar />
        <div className="mx-auto my-auto max-w-md p-6 text-center">
          <h1 className="mb-4 font-display text-3xl font-bold text-ink">Post not found</h1>
          <p className="mb-6 text-sm text-ink-muted">
            That article doesn&apos;t exist, or it has been moved.
          </p>
          <Button href="/#blog">Back to writing</Button>
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
          Back to writing
        </Link>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {(blog.tags || []).map((tag: string) => (
            <Badge key={tag} tone="accent" size="sm">
              {tag}
            </Badge>
          ))}
          {sampleBlogs.some((b) => b.slug === slug) && <SampleTag />}
        </div>

        <h1 className="mb-6 font-display text-3xl font-bold leading-tight text-ink md:text-5xl">
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
        <div className="flex flex-col gap-5 text-sm leading-relaxed text-ink-muted md:text-base">
          {blog.content.split('\n\n').map((para: string, idx: number) => {
            if (para.startsWith('# ')) {
              return (
                <h2
                  key={idx}
                  className="mb-1 mt-6 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl"
                >
                  {para.replace('# ', '')}
                </h2>
              );
            }
            if (para.startsWith('## ')) {
              return (
                <h3
                  key={idx}
                  className="mb-1 mt-4 font-display text-xl font-semibold tracking-tight text-ink md:text-2xl"
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
