import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export interface LegalClause {
  heading: string;
  body: string;
}

interface LegalPageProps {
  icon: LucideIcon;
  title: string;
  meta: string;
  clauses: LegalClause[];
}

/**
 * Shared shell for /privacy and /terms — the two pages were byte-for-byte
 * identical apart from their copy.
 */
export default function LegalPage({ icon: Icon, title, meta, clauses }: LegalPageProps) {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-canvas">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-32">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent-line bg-accent-soft text-accent">
            <Icon className="h-5 w-5" />
          </span>
          <h1 className="font-space text-3xl font-bold tracking-tight text-ink md:text-5xl">
            {title}
          </h1>
        </div>

        <p className="mb-10 border-b border-line pb-6 font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
          {meta}
        </p>

        <div className="flex flex-col gap-8">
          {clauses.map((clause) => (
            <section key={clause.heading}>
              <h2 className="mb-3 font-space text-base font-bold uppercase tracking-wider text-ink">
                {clause.heading}
              </h2>
              <p className="font-poppins text-sm leading-relaxed text-ink-muted">{clause.body}</p>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
