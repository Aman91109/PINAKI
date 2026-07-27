'use client';

import React, { useState } from 'react';
import { Send, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from './primitives/Field';
import Wordmark from './Wordmark';
import { CONTACT, NAV_ITEMS, SOCIALS } from '@/content/site';
import { API_BASE_URL } from '@/config';

const SOCIAL_PATHS: Record<string, { node: React.ReactNode; filled: boolean }> = {
  GitHub: {
    filled: false,
    node: (
      <>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </>
    ),
  },
  LinkedIn: {
    filled: false,
    node: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  X: {
    filled: true,
    node: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
  },
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [message, setMessage] = useState('');

  const saveLocally = (subEmail: string) => {
    try {
      const existing = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (!existing.includes(subEmail)) {
        existing.push(subEmail);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(existing));
      }
    } catch (e) {
      console.error('Error saving local subscription', e);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) saveLocally(email);
    } catch (err) {
      console.warn('Newsletter API offline, saving locally:', err);
      saveLocally(email);
    }

    setStatus('success');
    setMessage("You're on the list.");
    setEmail('');
  };

  return (
    <footer className="border-t border-line bg-canvas">
      {/* Closing CTA — the last thing a scroller sees should be an invitation. */}
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-line pb-16 md:flex-row md:items-end">
          <div>
            <h2 className="max-w-xl text-balance font-display text-3xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
              Have something you need built?
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted">
              Tell us about it and we will reply {CONTACT.responseTime} with an honest read on scope,
              cost and whether we are the right people for it.
            </p>
          </div>
          <a
            href={`mailto:${CONTACT.email}`}
            className="group flex shrink-0 items-center gap-3 font-display text-lg font-semibold tracking-tight text-accent transition-colors hover:text-accent-hover md:text-2xl"
          >
            {CONTACT.email}
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-5">
            <Wordmark size="lg" className="self-start" />
            <p className="max-w-xs text-[13px] leading-relaxed text-ink-muted">
              A three-person freelance engineering studio building web applications, AI systems and
              automation.
            </p>
            <div className="flex gap-2.5">
              {SOCIALS.map((social) => {
                const icon = SOCIAL_PATHS[social.name];
                if (!icon) return null;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Pinaki on ${social.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink-subtle transition-colors hover:border-accent-line hover:text-accent"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill={icon.filled ? 'currentColor' : 'none'}
                      stroke={icon.filled ? undefined : 'currentColor'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      {icon.node}
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-subtle">
              Sections
            </h3>
            <nav className="flex flex-col gap-2.5 text-[13px] text-ink-muted">
              {NAV_ITEMS.map((item) => (
                <a key={item.name} href={item.href} className="transition-colors hover:text-accent">
                  {item.name}
                </a>
              ))}
              <a href="#contact" className="transition-colors hover:text-accent">
                Contact
              </a>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-subtle">
              Studio
            </h3>
            <address className="flex flex-col gap-2.5 text-[13px] not-italic text-ink-muted">
              <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-accent">
                {CONTACT.email}
              </a>
              <a href={CONTACT.phoneHref} className="transition-colors hover:text-accent">
                {CONTACT.phone}
              </a>
              <span>{CONTACT.city}</span>
              <span>{CONTACT.region}</span>
              <span className="text-ink-subtle">{CONTACT.timezone}</span>
            </address>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-subtle">
              Occasional notes
            </h3>
            <p className="text-[13px] leading-relaxed text-ink-muted">
              Write-ups on things we ran into building real projects. No sales email.
            </p>

            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <Input
                type="email"
                placeholder="you@company.com"
                aria-label="Email address for updates"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="pr-11"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                aria-label="Subscribe"
                className="absolute right-1.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-accent transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            <div aria-live="polite">
              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[12px] text-positive"
                >
                  {message}
                </motion.p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line pt-8 font-mono text-[11px] text-ink-subtle md:flex-row">
          <span>© {new Date().getFullYear()} Pinaki. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="/privacy" className="transition-colors hover:text-ink">
              Privacy
            </a>
            <a href="/terms" className="transition-colors hover:text-ink">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
