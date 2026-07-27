'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/cn';

/** Shared control surface so inputs, selects and textareas stay identical. */
const CONTROL =
  'w-full rounded-lg border border-line bg-surface-inset px-3.5 py-3 ' +
  'font-poppins text-xs text-ink placeholder:text-ink-subtle ' +
  'transition-colors duration-200 hover:border-line-strong focus:border-accent ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

export function Label({
  htmlFor,
  children,
  className,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-subtle',
        className
      )}
    >
      {children}
    </label>
  );
}

type FieldShellProps = {
  label: React.ReactNode;
  hint?: string;
  className?: string;
  children: (id: string) => React.ReactNode;
};

/** Pairs a label with its control and wires up the htmlFor/id relationship. */
export function Field({ label, hint, className, children }: FieldShellProps) {
  const id = useId();
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      {children(id)}
      {hint && <p className="font-poppins text-[11px] text-ink-subtle">{hint}</p>}
    </div>
  );
}

export function Input({
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...rest} className={cn(CONTROL, className)} />;
}

export function Textarea({
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...rest} className={cn(CONTROL, 'resize-none', className)} />;
}

export function Select({
  className,
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...rest} className={cn(CONTROL, 'cursor-pointer', className)}>
      {children}
    </select>
  );
}
