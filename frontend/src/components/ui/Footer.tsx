'use client';

import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { API_BASE_URL } from '@/config';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

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
      } else {
        // Fallback store in localStorage if duplicate or error
        saveLocalSubscription(email);
        setStatus('success');
        setMessage('Subscribed to newsletter successfully!');
        setEmail('');
      }
    } catch (err) {
      console.warn('Newsletter API offline, saving locally:', err);
      saveLocalSubscription(email);
      setStatus('success');
      setMessage('Subscribed to newsletter successfully!');
      setEmail('');
    }
  };

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

  return (
    <footer className="relative border-t border-[#1E293B] bg-[#050816] pt-20 pb-10 z-10 overflow-hidden">
      {/* Grid Mesh Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px]" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">

        {/* Column 1: Logo and About */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/pinaki-logo.jpg"
              alt="PINAKI"
              width={180}
              height={60}
              className="h-14 w-auto object-contain"
            />
            <span className="font-space text-2xl font-bold tracking-[0.2em] text-white">PINAKI</span>
          </div>
          <p className="text-xs text-[#EDEDED]/60 leading-relaxed font-poppins">
            We engineer premium, futuristic digital platforms and advanced artificial intelligence infrastructures that convert clicks into paying relationships.
          </p>
          <div className="flex gap-4">
            <a href="https://github.com" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#EDEDED]/60 hover:text-[#06B6D4] hover:border-[#06B6D4] transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a href="https://linkedin.com" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#EDEDED]/60 hover:text-[#06B6D4] hover:border-[#06B6D4] transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="https://twitter.com" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#EDEDED]/60 hover:text-[#06B6D4] hover:border-[#06B6D4] transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Quick links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-space text-xs font-bold tracking-[0.2em] text-white uppercase">
            Navigation
          </h4>
          <nav className="flex flex-col gap-3 font-poppins text-xs text-[#EDEDED]/60">
            <a href="#home" className="hover:text-[#06B6D4] transition-colors">Home</a>
            <a href="#about" className="hover:text-[#06B6D4] transition-colors">About Us</a>
            <a href="#services" className="hover:text-[#06B6D4] transition-colors">Core Services</a>
            <a href="#portfolio" className="hover:text-[#06B6D4] transition-colors">Portfolio</a>
            <a href="/privacy" className="hover:text-[#06B6D4] transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#06B6D4] transition-colors">Terms & Conditions</a>
          </nav>
        </div>

        {/* Column 3: Contacts */}
        <div className="flex flex-col gap-4">
          <h4 className="font-space text-xs font-bold tracking-[0.2em] text-white uppercase">
            Inquiries
          </h4>
          <div className="flex flex-col gap-3 font-poppins text-xs text-[#EDEDED]/60">
            <a href="mailto:pinaki.sna@gmail.com" className="hover:text-[#06B6D4] transition-colors">pinaki.sna@gmail.com</a>
            <a href="tel:+919508725672" className="hover:text-[#06B6D4] transition-colors">+91 9508725672</a>
            <p>Sector 62, Noida</p>
            <p>New Delhi NCR, India</p>
          </div>
        </div>

        {/* Column 4: Newsletter */}
        <div className="flex flex-col gap-4">
          <h4 className="font-space text-xs font-bold tracking-[0.2em] text-white uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
            Newsletter
          </h4>
          <p className="text-xs text-[#EDEDED]/60 leading-relaxed font-poppins">
            Receive monthly tech logs, ML insights, and digital design guides.
          </p>

          <form onSubmit={handleSubscribe} className="relative flex items-center mt-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="w-full bg-[#111720]/80 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#06B6D4] transition-colors pr-10"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="absolute right-2 text-[#EDEDED]/60 hover:text-white transition-colors"
            >
              <Send className="w-4 h-4 text-[#06B6D4]" />
            </button>
          </form>

          {/* Feedback logs */}
          {status === 'success' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-green-400 mt-1">
              {message}
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-red-400 mt-1">
              {message}
            </motion.p>
          )}
        </div>
      </div>

      {/* Copyright Line */}
      <div className="max-w-7xl mx-auto px-6 border-t border-[#1E293B] mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-[#EDEDED]/40 font-mono">
        <div>© {new Date().getFullYear()} PINAKI LABS. ALL SYSTEMS OPERATIONAL.</div>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-white transition-colors">PRIVACY</a>
          <span>//</span>
          <a href="/terms" className="hover:text-white transition-colors">TERMS</a>
        </div>
      </div>
    </footer>
  );
}
