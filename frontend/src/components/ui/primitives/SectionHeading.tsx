import React from 'react';
import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

/**
 * The one section header used across every section. Previously each section
 * hand-rolled this with slightly different sizes, colours and margins.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col mb-14',
        centered && 'items-center text-center',
        className
      )}
    >
      <span
        className={cn(
          'flex items-center gap-2.5 mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-accent',
          centered && 'justify-center'
        )}
      >
        <span aria-hidden className="h-px w-6 bg-accent" />
        {eyebrow}
      </span>

      <h2 className="font-space text-3xl md:text-5xl font-bold tracking-tight text-ink text-balance">
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            'mt-4 max-w-xl font-poppins text-sm leading-relaxed text-ink-muted',
            centered && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
