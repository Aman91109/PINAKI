'use client';

import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Input } from './primitives/Field';
import { API_BASE_URL } from '@/config';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Core Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
];

const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com',
    path: (
      <>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </>
    ),
    filled: false,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    path: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
    filled: false,
  },
  {
    name: 'X',
    href: 'https://twitter.com',
    path: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
    filled: true,
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const saveLocalSubscription = (subEmail: string) => {
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
      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Subscribed to newsletter successfully!');
        setEmail('');
        return;
      }
      saveLocalSubscription(email);
      setStatus('success');
      setMessage('Subscribed to newsletter successfully!');
      setEmail('');
    } catch (err) {
      console.warn('Newsletter API offline, saving locally:', err);
      saveLocalSubscription(email);
      setStatus('success');
      setMessage('Subscribed to newsletter successfully!');
      setEmail('');
    }
  };

  return (
    <footer className="relative z-10 border-t border-line bg-canvas pb-10 pt-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <Image
              src="/pinaki-logo.jpg"
              alt=""
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
            />
            <span className="font-space text-xl font-bold tracking-[0.2em] text-ink">PINAKI</span>
          </div>
          <p className="font-poppins text-xs leading-relaxed text-ink-muted">
            We engineer premium, futuristic digital platforms and advanced artificial intelligence
            infrastructures that convert clicks into paying relationships.
          </p>
          <div className="flex gap-3">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Pinaki Labs on ${social.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink-subtle transition-colors hover:border-accent-line hover:text-accent"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={social.filled ? 'currentColor' : 'none'}
                  stroke={social.filled ? undefined : 'currentColor'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  {social.path}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4">
          <h2 className="font-space text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
            Navigation
          </h2>
          <nav className="flex flex-col gap-3 font-poppins text-xs text-ink-muted">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="transition-colors hover:text-accent">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h2 className="font-space text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
            Inquiries
          </h2>
          <address className="flex flex-col gap-3 font-poppins text-xs not-italic text-ink-muted">
            <a href="mailto:pinaki.sna@gmail.com" className="transition-colors hover:text-accent">
              pinaki.sna@gmail.com
            </a>
            <a href="tel:+919508725672" className="transition-colors hover:text-accent">
              +91 9508725672
            </a>
            <span>Sector 62, Noida</span>
            <span>New Delhi NCR, India</span>
          </address>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-4">
          <h2 className="flex items-center gap-1.5 font-space text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Newsletter
          </h2>
          <p className="font-poppins text-xs leading-relaxed text-ink-muted">
            Receive monthly tech logs, ML insights, and digital design guides.
          </p>

          <form onSubmit={handleSubscribe} className="relative flex items-center">
            <Input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address for newsletter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="pr-11"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              aria-label="Subscribe to newsletter"
              className="absolute right-1.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-accent transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div aria-live="polite">
            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-poppins text-[11px] text-positive"
              >
                {message}
              </motion.p>
            )}
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-poppins text-[11px] text-negative"
              >
                {message}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-line px-6 pt-8 font-mono text-[10px] text-ink-subtle md:flex-row md:text-xs">
        <span>© {new Date().getFullYear()} Pinaki Labs. All systems operational.</span>
        <div className="flex gap-4">
          <a href="/privacy" className="transition-colors hover:text-ink">
            Privacy
          </a>
          <a href="/terms" className="transition-colors hover:text-ink">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
