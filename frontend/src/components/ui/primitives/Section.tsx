import React from 'react';
import { cn } from '@/lib/cn';

export type SectionTone = 'canvas' | 'raised';
export type SectionWidth = 'md' | 'lg' | 'xl';

const TONES: Record<SectionTone, string> = {
  canvas: 'bg-canvas',
  raised: 'bg-canvas-raised',
};

const WIDTHS: Record<SectionWidth, string> = {
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
};

interface SectionProps {
  id?: string;
  tone?: SectionTone;
  width?: SectionWidth;
  className?: string;
  children: React.ReactNode;
}

/**
 * Standard page section: consistent rhythm, an opaque background, and a
 * hairline that separates it from the section above. Alternating `tone`
 * replaces the blurred colour blobs that used to sit behind every section.
 */
export default function Section({
  id,
  tone = 'canvas',
  width = 'xl',
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn('relative border-t border-line px-6 py-24', TONES[tone], className)}
    >
      <div className={cn('mx-auto', WIDTHS[width])}>{children}</div>
    </section>
  );
}
