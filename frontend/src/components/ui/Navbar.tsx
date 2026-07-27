'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import Button from './primitives/Button';
import Wordmark from './Wordmark';
import { cn } from '@/lib/cn';
import { NAV_ITEMS } from '@/content/site';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Highlight the section currently in view so the nav reflects position.
  useEffect(() => {
    const ids = NAV_ITEMS.map((item) => item.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

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
      <motion.div
        aria-hidden
        className="fixed left-0 right-0 top-0 z-[999] h-0.5 origin-[0%] bg-accent"
        style={{ scaleX: scrollYProgress }}
      />

      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-[99] transition-all duration-300',
          scrolled ? 'border-b border-line bg-canvas/85 py-3 backdrop-blur-xl' : 'py-5'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6">
          <a
            href="#home"
            onClick={(e) => handleSmoothScroll(e, '#home')}
            aria-label="Pinaki — home"
            className="shrink-0"
          >
            <Wordmark size={scrolled ? 'sm' : 'md'} />
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'rounded-lg px-3.5 py-2 font-display text-[13px] tracking-wide transition-colors',
                    isActive ? 'text-accent' : 'text-ink-muted hover:text-ink'
                  )}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          <div className="hidden shrink-0 lg:block">
            <Button href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')}>
              Start a project
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="cursor-pointer rounded-lg border border-line bg-surface p-2.5 text-ink transition-colors hover:border-line-strong lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[72px] z-[98] flex h-[calc(100dvh-72px)] w-screen flex-col justify-between bg-canvas px-6 pb-8 pt-2 lg:hidden"
          >
            <nav className="flex flex-col">
              {NAV_ITEMS.map((item, idx) => (
                <motion.a
                  key={item.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="flex items-center justify-between border-b border-line py-5 font-display text-2xl font-semibold tracking-tight text-ink transition-colors hover:text-accent"
                >
                  {item.name}
                  <ArrowRight className="h-4 w-4 text-ink-subtle" />
                </motion.a>
              ))}
            </nav>

            <Button
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, '#contact')}
              size="lg"
              fullWidth
            >
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
