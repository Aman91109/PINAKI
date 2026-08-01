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
  return null;
}

export function SampleNotice({ label, className }: { label: string; className?: string }) {
  return null;
}
