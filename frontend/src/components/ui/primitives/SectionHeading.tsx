import React from 'react';
import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  /** Two-digit section index, e.g. "02". Rendered as an editorial marker. */
  index?: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  children?: React.ReactNode;
}

/**
 * The single section header used site-wide. Numbered so the page reads as a
 * deliberate sequence rather than a stack of unrelated blocks.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  children,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div className={cn('mb-14 flex flex-col', centered && 'items-center text-center', className)}>
      <span
        className={cn(
          'mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-accent',
          centered && 'justify-center'
        )}
      >
        {index && <span className="tabular-nums opacity-60">{index}</span>}
        <span aria-hidden className="h-px w-8 bg-accent-line" />
        {eyebrow}
      </span>

      <h2 className="max-w-3xl text-balance font-display text-3xl font-bold leading-[1.08] tracking-tight text-ink md:text-[3.25rem]">
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            'mt-5 max-w-2xl text-pretty text-base leading-relaxed text-ink-muted',
            centered && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}

      {children && <div className={cn('mt-7', centered && 'flex justify-center')}>{children}</div>}
    </div>
  );
}
