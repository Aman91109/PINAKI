'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Terminal } from 'lucide-react';
import { Badge, Button } from '@/components/ui/primitives';
import MagneticButton from '@/components/ui/MagneticButton';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  suffix?: string;
}

function AnimatedCounter({ value, duration = 2, suffix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const end = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (start === end) return;

    const incrementTime = Math.max(Math.floor((duration * 1000) / end), 20);

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

const stats = [
  { value: '120', suffix: '+', label: 'Projects Completed' },
  { value: '50', suffix: '+', label: 'Happy Clients' },
  { value: '5', suffix: '+', label: 'Years Experience' },
  { value: '99', suffix: '%', label: 'Success Rate' },
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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas px-6 pt-32 pb-20"
    >
      <div className="z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Badge tone="accent" size="sm">
            <Terminal className="h-3.5 w-3.5" />
            Awwwards-Level Digital Engineering
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-4xl font-space text-4xl font-bold leading-[0.95] tracking-tighter text-ink sm:text-6xl md:text-8xl"
        >
          We Build Digital
          <span className="block text-accent">Experiences</span>
          That Grow Businesses.
        </motion.h1>

        <div className="mt-8 flex h-10 items-center justify-center font-space text-lg font-medium tracking-wide md:text-2xl">
          <span className="mr-2.5 text-ink-subtle">Expertise</span>
          <motion.span
            key={currentTag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b-2 border-accent-line font-bold text-accent"
          >
            {subtitleTags[currentTag]}
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MagneticButton>
            <Button size="lg" onClick={() => handleSmoothScroll('#contact')}>
              Hire Us
              <ArrowRight className="h-4 w-4" />
            </Button>
          </MagneticButton>

          <MagneticButton>
            <Button variant="secondary" size="lg" onClick={() => handleSmoothScroll('#portfolio')}>
              View Portfolio
            </Button>
          </MagneticButton>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mt-24 grid w-full max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center bg-surface px-4 py-8">
              <dt className="order-2 mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-subtle md:text-xs">
                {stat.label}
              </dt>
              <dd className="order-1 font-space text-3xl font-bold text-ink md:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <motion.button
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 cursor-pointer flex-col items-center gap-1.5 text-ink-subtle transition-colors hover:text-ink md:flex"
        onClick={() => handleSmoothScroll('#about')}
        aria-label="Scroll to About section"
      >
        <span className="font-mono text-[9px] uppercase tracking-widest">Scroll</span>
        <span className="flex h-8 w-5 justify-center rounded-full border-2 border-current p-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
      </motion.button>
    </section>
  );
}
