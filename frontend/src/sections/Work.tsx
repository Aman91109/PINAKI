'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Calendar, User, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import {
  Badge,
  Button,
  SampleNotice,
  SampleTag,
  Section,
  SectionHeading,
} from '@/components/ui/primitives';
import { cn } from '@/lib/cn';
import { API_BASE_URL } from '@/config';

const categories = [
  'All',
  'Web Apps',
  'AI Projects',
  'ML Projects',
  'Business Websites',
  'Mobile Apps',
  'Dashboards',
  'Admin Panels',
];

interface ProjectType {
  _id: string;
  title: string;
  description: string;
  images: string[];
  technology: string[];
  category: string;
  client: string;
  duration: string;
  github: string;
  liveDemo: string;
  outcome?: string;
}

const fallbackProjects: ProjectType[] = [
  {
    _id: 'p1',
    title: 'AI-driven CRM engine',
    description:
      'A sales dashboard that reads inbound email with an NLP model, scores churn risk and drafts replies. Built as a Next.js front end over a Python inference service with real-time sockets.',
    outcome: 'Cut manual triage time by roughly 60%',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'],
    technology: ['Next.js', 'MongoDB', 'Python', 'Recharts'],
    category: 'AI Projects',
    client: 'Analytics SaaS',
    duration: '3 months',
    github: 'https://github.com',
    liveDemo: 'https://example.com',
  },
  {
    _id: 'p2',
    title: 'Carbon offset ledger',
    description:
      'A verification tool that tracks carbon offsets across an interactive map, with a Node API, JWT auth and a strict admin approval chain.',
    outcome: 'Replaced a spreadsheet workflow for 40 staff',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'],
    technology: ['Next.js', 'Express', 'MongoDB', 'Web3.js'],
    category: 'Web Apps',
    client: 'Ecology consultancy',
    duration: '2 months',
    github: 'https://github.com',
    liveDemo: 'https://example.com',
  },
  {
    _id: 'p3',
    title: 'Headless commerce storefront',
    description:
      'A custom checkout, subscription billing and invoice generation layer on top of Stripe, plus an operations dashboard for the fulfilment team.',
    outcome: 'Checkout completion up 18%',
    images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800'],
    technology: ['Next.js', 'Express', 'Stripe', 'Mongoose'],
    category: 'Business Websites',
    client: 'Retail brand group',
    duration: '2.5 months',
    github: 'https://github.com',
    liveDemo: 'https://example.com',
  },
  {
    _id: 'p4',
    title: 'Supply chain forecaster',
    description:
      'Multivariate regression and LSTM models trained in Python, served through a secured REST API and surfaced as predictive stock-level graphs.',
    outcome: 'Forecast error reduced to under 8%',
    images: ['https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800'],
    technology: ['Next.js', 'TensorFlow', 'Express', 'MongoDB'],
    category: 'ML Projects',
    client: 'Logistics operator',
    duration: '4 months',
    github: 'https://github.com',
    liveDemo: 'https://example.com',
  },
  {
    _id: 'p5',
    title: 'Crypto portfolio tracker',
    description:
      'A mobile-first portfolio app with live price feeds, CSV transaction export and token-based auth, built to stay responsive on low-end devices.',
    outcome: 'Sub-second first paint on 3G',
    images: ['https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800'],
    technology: ['Next.js', 'TypeScript', 'CoinGecko API'],
    category: 'Mobile Apps',
    client: 'Fintech startup',
    duration: '1.5 months',
    github: 'https://github.com',
    liveDemo: 'https://example.com',
  },
  {
    _id: 'p6',
    title: 'Security operations console',
    description:
      'An internal admin panel showing live firewall events, active sessions and role-based access control, with an audit trail on every action.',
    outcome: 'Incident response time halved',
    images: ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800'],
    technology: ['Next.js', 'Express', 'JWT', 'Chart.js'],
    category: 'Admin Panels',
    client: 'Cyber security firm',
    duration: '3 months',
    github: 'https://github.com',
    liveDemo: 'https://example.com',
  },
];

const PLACEHOLDER = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71';

export default function Work() {
  const [projects, setProjects] = useState<ProjectType[]>(fallbackProjects);
  const [isSample, setIsSample] = useState(true);
  const [selectedCat, setSelectedCat] = useState('All');
  const [active, setActive] = useState<ProjectType | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const url = `${API_BASE_URL}/api/public/portfolio${
          selectedCat !== 'All' ? `?category=${encodeURIComponent(selectedCat)}` : ''
        }`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && data.data?.length) {
          setProjects(data.data);
          setIsSample(false);
        }
      } catch {
        console.warn('Portfolio API unreachable. Showing sample projects.');
      }
    };
    fetchPortfolio();
  }, [selectedCat]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  // Sample data is not filtered server-side, so filter it here too.
  const visible = isSample && selectedCat !== 'All'
    ? projects.filter((p) => p.category === selectedCat)
    : projects;

  return (
    <Section id="work" tone="raised">
      <SectionHeading
        index="01"
        eyebrow="Selected work"
        title="Things we built that are still running."
        description="Every project below shipped to production and stayed there. Pick one to see the stack, the timeline and what it changed for the client."
      />

      {isSample && (
        <SampleNotice label="These six projects, their clients and their results are invented examples." />
      )}

      <div
        role="tablist"
        aria-label="Filter projects by category"
        className="scrollbar-hide mb-10 flex select-none gap-2 overflow-x-auto pb-2"
      >
        {categories.map((cat) => {
          const isActive = selectedCat === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedCat(cat)}
              className={cn(
                'cursor-pointer whitespace-nowrap rounded-lg border px-4 py-2 font-display text-xs tracking-wide transition-colors duration-200',
                isActive
                  ? 'border-accent bg-accent text-accent-ink'
                  : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink'
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((proj) => (
            <motion.article
              key={proj._id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <button
                onClick={() => setActive(proj)}
                className="flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-line bg-surface text-left transition-colors duration-200 hover:border-line-strong"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line">
                  <Image
                    src={proj.images?.[0] || PLACEHOLDER}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  {isSample && (
                    <span className="absolute left-3 top-3">
                      <SampleTag />
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                      {proj.category}
                    </span>
                    <span className="font-mono text-[10px] text-ink-subtle">{proj.duration}</span>
                  </div>

                  <h3 className="font-display text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-accent">
                    {proj.title}
                  </h3>

                  <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                    {proj.description}
                  </p>

                  {proj.outcome && (
                    <p className="mt-4 border-l-2 border-accent-line pl-3 text-sm font-medium text-ink">
                      {proj.outcome}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                    <div className="flex flex-wrap gap-1.5">
                      {(proj.technology || []).slice(0, 3).map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                    <span className="flex items-center gap-1 font-display text-xs text-ink-subtle transition-colors group-hover:text-accent">
                      Details
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Detail modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-canvas/90 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.97, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="scrollbar-hide relative max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-line-strong bg-surface"
            >
              <div className="relative aspect-[16/9] w-full border-b border-line">
                <Image
                  src={active.images?.[0] || PLACEHOLDER}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
                <button
                  onClick={() => setActive(null)}
                  aria-label="Close project details"
                  className="absolute right-3 top-3 cursor-pointer rounded-lg border border-line bg-canvas/85 p-2 text-ink-muted backdrop-blur transition-colors hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 md:p-9">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    {active.category}
                  </span>
                  {isSample && <SampleTag />}
                </div>

                <h2 className="font-display text-2xl font-bold tracking-tight text-ink md:text-4xl">
                  {active.title}
                </h2>

                {active.outcome && (
                  <p className="mt-5 rounded-lg border border-accent-line bg-accent-soft px-4 py-3 text-sm font-medium text-accent">
                    {active.outcome}
                  </p>
                )}

                <p className="mt-6 text-sm leading-relaxed text-ink-muted md:text-base">
                  {active.description}
                </p>

                <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
                  <div className="bg-surface-inset p-4">
                    <dt className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-ink-subtle">
                      <User className="h-3 w-3" /> Client
                    </dt>
                    <dd className="mt-1 font-display text-sm text-ink">{active.client}</dd>
                  </div>
                  <div className="bg-surface-inset p-4">
                    <dt className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-ink-subtle">
                      <Calendar className="h-3 w-3" /> Timeline
                    </dt>
                    <dd className="mt-1 font-display text-sm text-ink">{active.duration}</dd>
                  </div>
                  <div className="col-span-2 bg-surface-inset p-4 sm:col-span-1">
                    <dt className="font-mono text-[9px] uppercase tracking-wider text-ink-subtle">
                      Stack
                    </dt>
                    <dd className="mt-1.5 flex flex-wrap gap-1">
                      {active.technology.map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
                  {active.liveDemo && (
                    <Button href={active.liveDemo} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      View live site
                    </Button>
                  )}
                  {active.github && (
                    <Button
                      variant="secondary"
                      href={active.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source code
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
