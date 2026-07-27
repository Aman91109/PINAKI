import React from 'react';
import { cn } from '@/lib/cn';

/**
 * Typographic wordmark.
 *
 * The supplied logo (public/pinaki-logo.jpg) is a 1024px square with the mark
 * floating in the middle of a large black field, so at navbar height the
 * lettering renders around 6px tall and is unreadable. Until a cropped,
 * transparent SVG/PNG of the mark exists, type is the legible option — the
 * gold rule underneath echoes the one in the logo.
 */
export default function Wordmark({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const text = {
    sm: 'text-base tracking-[0.34em]',
    md: 'text-lg tracking-[0.34em]',
    lg: 'text-2xl tracking-[0.3em]',
  }[size];

  return (
    <span className={cn('inline-flex flex-col items-start gap-1', className)}>
      <span className={cn('font-display font-bold leading-none text-ink', text)}>
        PINAKI
      </span>
      <span aria-hidden className="h-px w-full bg-accent" />
    </span>
  );
}
