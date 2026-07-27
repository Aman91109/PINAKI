'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import MagneticButton from './MagneticButton';

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
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 origin-[0%] z-[999]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* 2. Floating Navbar Frame */}
      <header
        className={`fixed top-0 left-0 right-0 z-[99] transition-all duration-500 ${
          scrolled 
            ? 'py-4 glass-nav shadow-lg' 
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Column 1: Logo and text */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/pinaki-logo.jpg"
                alt="PINAKI"
                width={180}
                height={60}
                className="h-14 w-auto object-contain"
              />
              <span className="font-space text-2xl font-bold tracking-[0.2em] text-white">PINAKI</span>
            </div>
          </div>

          {/* Desktop Navigation Link Nodes */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="text-xs uppercase font-space font-medium tracking-widest text-[#EDEDED]/70 hover:text-white transition-colors relative group py-2"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#06B6D4] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* CTA hire Button */}
          <div className="hidden lg:block">
            <MagneticButton>
              <a
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, '#contact')}
                className="neon-button inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-purple-500 bg-[#8B5CF6]/10 text-white font-space text-xs uppercase tracking-widest hover:bg-[#8B5CF6] transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
              >
                Hire Us
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </MagneticButton>
          </div>

          {/* Mobile Hamburg Trigger Node */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-1 hover:text-[#06B6D4] transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* 3. Mobile Navigation Slider Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[60px] z-[98] lg:hidden w-screen h-[calc(100vh-60px)] bg-[#050816]/95 backdrop-blur-xl flex flex-col justify-between p-8"
          >
            <div className="flex flex-col gap-6 mt-8">
              {navItems.map((item, idx) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="text-2xl font-space font-semibold tracking-wider text-[#EDEDED] hover:text-[#06B6D4] transition-colors py-2 border-b border-[#1E293B]"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <a
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, '#contact')}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-cyan-500 bg-[#06B6D4]/10 text-white font-space text-sm uppercase tracking-widest hover:bg-[#06B6D4] transition-colors"
              >
                Hire Us
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
