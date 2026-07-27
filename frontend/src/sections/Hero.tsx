'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Terminal } from 'lucide-react';
import MagneticButton from '../components/ui/MagneticButton';

// Counter component for incremental animations
function AnimatedCounter({ value, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const end = parseInt(value.toString().replace(/[^0-9]/g, ''));
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="font-space font-bold">
      {count}
      {suffix}
    </span>
  );
}

const subtitleTags = [
  'Web Development',
  'AI Solutions',
  'UI/UX Design',
  'Automation',
  'Mobile Apps',
  'Machine Learning',
];

export default function Hero() {
  const [currentTag, setCurrentTag] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTag((prev) => (prev + 1) % subtitleTags.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleSmoothScroll = (selector: string) => {
    const target = document.querySelector(selector);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-32 pb-20 select-none overflow-hidden"
    >
      {/* Background Neon Blob Blurs */}
      <div className="absolute top-[10%] left-[5%] w-[350px] h-[350px] rounded-full bg-[#8B5CF6]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#06B6D4]/10 blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto text-center z-10 flex flex-col items-center">
        {/* Top Badging */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#06B6D4]/20 bg-[#06B6D4]/5 text-xs text-[#06B6D4] font-mono tracking-widest uppercase mb-8"
        >
          <Terminal className="w-3.5 h-3.5" />
          Awwwards-Level Digital Engineering
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-8xl font-bold font-space text-white tracking-tighter leading-[0.95] max-w-4xl"
        >
          We Build Digital
          <span className="block text-[#06B6D4]">Experiences</span>
          That Grow Businesses.
        </motion.h1>

        {/* Dynamic Tag Sequence */}
        <div className="h-10 mt-8 flex items-center justify-center font-space text-lg md:text-2xl text-[#EDEDED]/60 font-medium tracking-wide">
          <span className="text-white/30 mr-2.5">// EXPERTISE:</span>
          <motion.span
            key={currentTag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-[#06B6D4] font-bold border-b-2 border-[#06B6D4]/40"
          >
            {subtitleTags[currentTag]}
          </motion.span>
        </div>

        {/* CTA Button Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-5 items-center justify-center mt-12"
        >
          {/* Hire Us Magnetic CTA */}
          <MagneticButton>
            <button
              onClick={() => handleSmoothScroll('#contact')}
              className="neon-button inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#8B5CF6] text-white font-space text-xs uppercase tracking-widest hover:bg-[#7C3AED] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300"
            >
              Hire Us
              <ArrowRight className="w-4 h-4" />
            </button>
          </MagneticButton>

          {/* View Portfolio CTA */}
          <MagneticButton>
            <button
              onClick={() => handleSmoothScroll('#portfolio')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 bg-white/5 text-white font-space text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              View Portfolio
            </button>
          </MagneticButton>
        </motion.div>

        {/* Statistics Dashboard counts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/5 mt-24 pt-12 w-full max-w-5xl"
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-bold font-space text-[#06B6D4]">
              <AnimatedCounter value="120" suffix="+" />
            </span>
            <span className="text-[10px] md:text-xs text-[#EDEDED]/50 uppercase tracking-widest font-mono mt-2">
              Projects Completed
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-bold font-space text-[#8B5CF6]">
              <AnimatedCounter value="50" suffix="+" />
            </span>
            <span className="text-[10px] md:text-xs text-[#EDEDED]/50 uppercase tracking-widest font-mono mt-2">
              Happy Clients
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-bold font-space text-white">
              <AnimatedCounter value="5" suffix="+" />
            </span>
            <span className="text-[10px] md:text-xs text-[#EDEDED]/50 uppercase tracking-widest font-mono mt-2">
              Years Experience
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-bold font-space text-green-400">
              <AnimatedCounter value="99" suffix="%" />
            </span>
            <span className="text-[10px] md:text-xs text-[#EDEDED]/50 uppercase tracking-widest font-mono mt-2">
              Success Rate
            </span>
          </div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator Icon */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer hidden md:flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity"
        onClick={() => handleSmoothScroll('#about')}
      >
        <span className="text-[9px] uppercase tracking-widest font-mono text-white">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-white flex justify-center p-1.5">
          <div className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
