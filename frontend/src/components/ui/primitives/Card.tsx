'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const PADDING: Record<CardPadding, string> = {
  none: '',
  sm: 'p-5',
  md: 'p-6',
  lg: 'p-8',
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds hover feedback — use only when the whole card is clickable or focusable. */
  interactive?: boolean;
  padding?: CardPadding;
  children: React.ReactNode;
}

/**
 * The single card surface for the whole site.
 *
 * Replaces the old TiltCard: the 3D rotation and the cursor-following glow are
 * gone in favour of a flat, opaque panel that lifts on hover. Solid backgrounds
 * mean nested cards and badges keep their intended contrast instead of
 * compounding translucency.
 */
export default function Card({
  interactive = false,
  padding = 'md',
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={cn(
        'relative rounded-xl border border-line bg-surface',
        'transition-[background-color,border-color,transform] duration-200',
        interactive &&
          'hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-hover',
        PADDING[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
