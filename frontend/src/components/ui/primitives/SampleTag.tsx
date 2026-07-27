import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Marks content that is placeholder, not real.
 *
 * The portfolio projects, testimonials and blog posts shipped with this site
 * are invented — fictional clients and stock-photo reviewers. Presenting them
 * to prospects as genuine would be a real liability, so anything drawn from
 * the local fallbacks is badged until the CMS returns live records, at which
 * point these disappear on their own.
 */

export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded border border-dashed border-accent-line',
        'bg-accent-soft px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent',
        className
      )}
    >
      Sample
    </span>
  );
}

export function SampleNotice({ label, className }: { label: string; className?: string }) {
  return (
    <p
      className={cn(
        'mb-8 flex items-start gap-2.5 rounded-lg border border-dashed border-accent-line',
        'bg-accent-soft px-4 py-3 text-xs leading-relaxed text-ink-muted',
        className
      )}
    >
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
      <span>
        <span className="font-semibold text-accent">Placeholder content.</span> {label} Replace it
        from the admin dashboard before launch — these notices vanish automatically once real
        records exist.
      </span>
    </p>
  );
}
