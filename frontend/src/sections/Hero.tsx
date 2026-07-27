'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Clock, FileCheck2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/primitives';
import MagneticButton from '@/components/ui/MagneticButton';
import { AVAILABILITY, STACK, STATS } from '@/content/site';

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 1400;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out so the number settles rather than stopping dead.
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

const assurances = [
  { icon: Clock, label: 'Replies within 4 hours' },
  { icon: FileCheck2, label: 'Fixed-scope quotes' },
  { icon: ShieldCheck, label: 'NDA on request' },
];

export default function Hero() {
  const scrollTo = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative overflow-hidden bg-canvas px-6 pb-20 pt-36 md:pt-44">
      <div className="mx-auto max-w-6xl">
        {/* Availability — the single strongest trust signal on a freelance site. */}
        <motion.a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('#contact');
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-2 pr-4 transition-colors hover:border-line-strong"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
          </span>
          <span className="text-xs text-ink-muted">
            {AVAILABILITY.status}
            <span className="ml-1.5 hidden text-ink-subtle transition-colors group-hover:text-accent sm:inline">
              Get in touch →
            </span>
          </span>
        </motion.a>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mt-8 max-w-4xl text-balance font-display text-[2.75rem] font-bold leading-[1.02] tracking-tighter text-ink sm:text-6xl md:text-[5.25rem]"
        >
          We build the software your business actually{' '}
          <span className="text-accent">runs on</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16 }}
          className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-ink-muted md:text-lg"
        >
          A three-person freelance engineering studio shipping production web applications, AI
          systems and automation — with fixed scope, honest timelines, and direct access to the
          people writing your code.
        </motion.p>

        {/* Stack line */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-ink-subtle"
        >
          {STACK.map((tech, i) => (
            <li key={tech} className="flex items-center gap-2.5">
              {i > 0 && <span aria-hidden className="text-line-strong">/</span>}
              {tech}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
        >
          <MagneticButton>
            <Button size="lg" onClick={() => scrollTo('#contact')}>
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Button>
          </MagneticButton>

          <Button variant="secondary" size="lg" onClick={() => scrollTo('#work')}>
            See our work
          </Button>
        </motion.div>

        {/* Assurances */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-7 sm:gap-y-3"
        >
          {assurances.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-xs text-ink-subtle">
              <Icon className="h-3.5 w-3.5 shrink-0 text-accent" />
              {label}
            </li>
          ))}
        </motion.ul>

        {/* Stats */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-surface px-5 py-7">
              <dd className="font-display text-3xl font-bold text-ink md:text-4xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
                {stat.label}
              </dt>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
