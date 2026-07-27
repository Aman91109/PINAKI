/**
 * Joins class names, dropping anything falsy.
 * Deliberately tiny — we don't need Tailwind conflict resolution here because
 * the primitives own their base classes and callers only append.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
