'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent-soft';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  // Dark ink on a bright accent fill — 9.2:1, versus 2.6:1 for white-on-cyan.
  primary:
    'bg-accent text-accent-ink border border-accent hover:bg-accent-hover hover:border-accent-hover',
  secondary:
    'bg-surface text-ink border border-line hover:bg-surface-hover hover:border-line-strong',
  ghost:
    'bg-transparent text-ink-muted border border-transparent hover:text-ink hover:bg-surface',
  'accent-soft':
    'bg-accent-soft text-accent border border-accent-line hover:bg-accent hover:text-accent-ink',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-[10px] gap-1.5',
  md: 'px-5 py-2.5 text-[11px] gap-2',
  lg: 'px-7 py-3.5 text-xs gap-2.5',
};

const BASE =
  'inline-flex items-center justify-center rounded-lg font-space font-medium uppercase tracking-widest ' +
  'transition-colors duration-200 cursor-pointer select-none ' +
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none';

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsAnchor = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className);

  if (typeof rest.href === 'string') {
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a {...anchorProps} className={classes}>
        {children}
      </a>
    );
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...buttonProps} type={buttonProps.type ?? 'button'} className={classes}>
      {children}
    </button>
  );
}
