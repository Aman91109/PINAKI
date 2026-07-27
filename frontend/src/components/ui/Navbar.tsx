'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Button from './primitives/Button';
import { cn } from '@/lib/cn';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Process', href: '#process' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Blog', href: '#blog' },
  { name: 'Map', href: '#map' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll progress */}
      <motion.div
        aria-hidden
        className="fixed left-0 right-0 top-0 z-[999] h-0.5 origin-[0%] bg-accent"
        style={{ scaleX: scrollYProgress }}
      />

      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-[99] transition-all duration-300',
          scrolled
            ? 'border-b border-line bg-canvas/90 py-3 backdrop-blur-md'
            : 'border-b border-transparent py-5'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <a
            href="#home"
            onClick={(e) => handleSmoothScroll(e, '#home')}
            className="flex items-center gap-2.5"
          >
            <Image
              src="/pinaki-logo.jpg"
              alt=""
              width={180}
              height={60}
              className={cn(
                'w-auto object-contain transition-all duration-300',
                scrolled ? 'h-10' : 'h-12'
              )}
            />
            <span className="font-space text-xl font-bold tracking-[0.2em] text-ink">PINAKI</span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="group relative py-2 font-space text-[11px] font-medium uppercase tracking-widest text-ink-muted transition-colors hover:text-ink"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')}>
              Hire Us
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="cursor-pointer rounded-lg border border-line bg-surface p-2 text-ink transition-colors hover:border-line-strong lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[68px] z-[98] flex h-[calc(100vh-68px)] w-screen flex-col justify-between bg-canvas p-6 lg:hidden"
          >
            <nav className="mt-4 flex flex-col">
              {navItems.map((item, idx) => (
                <motion.a
                  key={item.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="border-b border-line py-4 font-space text-xl font-semibold tracking-wide text-ink transition-colors hover:text-accent"
                >
                  {item.name}
                </motion.a>
              ))}
            </nav>

            <Button
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, '#contact')}
              size="lg"
              fullWidth
              className="mb-8"
            >
              Hire Us
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
