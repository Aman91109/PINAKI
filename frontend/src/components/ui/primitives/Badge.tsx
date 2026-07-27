import React from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone = 'accent' | 'neutral' | 'positive' | 'iris';
export type BadgeSize = 'xs' | 'sm';

const TONES: Record<BadgeTone, string> = {
  accent: 'bg-accent-soft text-accent border-accent-line',
  neutral: 'bg-surface-hover text-ink-subtle border-line',
  positive: 'bg-positive-soft text-positive border-positive-line',
  iris: 'bg-iris-soft text-iris border-iris-line',
};

const SIZES: Record<BadgeSize, string> = {
  xs: 'px-2 py-0.5 text-[9px]',
  sm: 'px-2.5 py-1 text-[10px]',
};

interface BadgeProps {
  tone?: BadgeTone;
  size?: BadgeSize;
  className?: string;
  children: React.ReactNode;
}

export default function Badge({
  tone = 'neutral',
  size = 'xs',
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border font-mono uppercase tracking-wider whitespace-nowrap',
        TONES[tone],
        SIZES[size],
        className
      )}
    >
      {children}
    </span>
  );
}
