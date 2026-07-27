'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Calendar, User, Layers } from 'lucide-react';
import Image from 'next/image';
import { Badge, Button, Card, Section, SectionHeading } from '@/components/ui/primitives';
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

const fallbackProjects = [
  {
    _id: 'p1',
    title: 'Aura: AI-Driven CRM Engine',
    description: 'A fully interactive, premium dashboard utilizing Deep Learning NLP models to scan consumer emails, predict churn, and suggest auto-responses via Express APIs. The frontend features data widgets, charts, and real-time sockets.',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'],
    technology: ['Next.js', 'React', 'MongoDB', 'Python/Flask', 'Tailwind CSS', 'Recharts'],
    category: 'AI Projects',
    client: 'Aura Analytics Corp',
    duration: '3 Months',
    github: 'https://github.com',
    liveDemo: 'https://example.com',
  },
  {
    _id: 'p2',
    title: 'Veridian: Carbon Offset Ledger',
    description: 'Futuristic blockchain-enabled business tool representing Carbon Offsets across dynamic SVG maps. Built using Node.js backend with JWT authentication and strict admin verification channels.',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'],
    technology: ['Next.js', 'Express.js', 'MongoDB', 'Web3.js', 'Framer Motion'],
    category: 'Web Apps',
    client: 'Veridian Ecology Inc',
    duration: '2 Months',
    github: 'https://github.com',
    liveDemo: 'https://example.com',
  },
  {
    _id: 'p3',
    title: 'E-Pulse: Next-Gen Shopify Engine',
    description: 'E-commerce interface with custom floating checkout modules, Stripe integrations, dynamic invoice generators, and a luxury admin metrics dashboard loaded with framer animations.',
    images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800'],
    technology: ['Next.js', 'Express', 'Mongoose', 'Stripe API', 'GSAP ScrollTrigger'],
    category: 'Business Websites',
    client: 'Pulse Brand Group',
    duration: '2.5 Months',
    github: 'https://github.com',
    liveDemo: 'https://example.com',
  },
  {
    _id: 'p4',
    title: 'Optima: Supply Chain Forecaster',
    description: 'Advanced machine learning interface training multivariate regressions and LSTM models in Python, served via secured Express REST endpoints displaying predictive graphs.',
    images: ['https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800'],
    technology: ['Next.js', 'Python/Tensorflow', 'Express.js', 'Tailwind', 'MongoDB'],
    category: 'ML Projects',
    client: 'Optima Logistics',
    duration: '4 Months',
    github: 'https://github.com',
    liveDemo: 'https://example.com',
  },
  {
    _id: 'p5',
    title: 'Nova: Crypto Wallet & Portfolio',
    description: 'Mobile cryptocurrency web application supporting transaction exports, live currency graphs, localized JWT auth, and a fully responsive component system.',
    images: ['https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800'],
    technology: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'CoinGecko API'],
    category: 'Mobile Apps',
    client: 'Nova Labs',
    duration: '1.5 Months',
    github: 'https://github.com',
    liveDemo: 'https://example.com',
  },
  {
    _id: 'p6',
    title: 'Specter: Security Command Board',
    description: 'Highly secure, custom admin command panel featuring real-time firewall block rates, active sessions monitor, role-based controls, and quick leads pipelines.',
    images: ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800'],
    technology: ['Next.js', 'Express.js', 'JWT', 'MongoDB', 'ChartJS', 'Lenis Scroll'],
    category: 'Admin Panels',
    client: 'Specter Cyber Security',
    duration: '3 Months',
    github: 'https://github.com',
    liveDemo: 'https://example.com',
  },
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
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71';

export default function Portfolio() {
  const [projects, setProjects] = useState<ProjectType[]>(fallbackProjects);
  const [selectedCat, setSelectedCat] = useState('All');
  const [activeProject, setActiveProject] = useState<ProjectType | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const url = `${API_BASE_URL}/api/public/portfolio${
          selectedCat !== 'All' ? `?category=${encodeURIComponent(selectedCat)}` : ''
        }`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && data.data) {
          setProjects(data.data);
        }
      } catch {
        console.warn('Could not connect to portfolio API. Using local fallbacks.');
      }
    };
    fetchPortfolio();
  }, [selectedCat]);

  // Close the detail modal on Escape.
  useEffect(() => {
    if (!activeProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveProject(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeProject]);

  return (
    <Section id="portfolio" tone="canvas">
      <SectionHeading eyebrow="Our Work" title="Proof of Concept Showcases" />

      {/* Category filters */}
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
                'cursor-pointer whitespace-nowrap rounded-lg border px-4 py-2 font-space text-[11px] uppercase tracking-widest transition-colors duration-200',
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

      <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {projects.map((proj) => (
            <motion.div
              key={proj._id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="group h-full"
            >
              <Card
                interactive
                role="button"
                tabIndex={0}
                aria-label={`View details for ${proj.title}`}
                onClick={() => setActiveProject(proj)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveProject(proj);
                  }
                }}
                className="flex h-full cursor-pointer flex-col justify-between"
              >
                <div>
                  <div className="relative mb-6 h-[220px] w-full overflow-hidden rounded-lg border border-line">
                    <Image
                      src={proj.images?.[0] || PLACEHOLDER}
                      alt={proj.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    {proj.category}
                  </span>
                  <h3 className="mb-3 mt-1.5 font-space text-lg font-bold text-ink transition-colors group-hover:text-accent">
                    {proj.title}
                  </h3>
                  <p className="line-clamp-3 font-poppins text-xs leading-relaxed text-ink-muted">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-4">
                  {(proj.technology || []).slice(0, 4).map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Project detail modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={activeProject.title}
            onClick={() => setActiveProject(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-canvas/90 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="scrollbar-hide relative max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-line-strong bg-surface p-6 md:p-10"
            >
              <button
                onClick={() => setActiveProject(null)}
                aria-label="Close project details"
                className="absolute right-4 top-4 cursor-pointer rounded-lg border border-line bg-surface-inset p-2 text-ink-subtle transition-colors hover:border-line-strong hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-6 pr-12">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  {activeProject.category}
                </span>
                <h2 className="mt-1.5 font-space text-2xl font-bold text-ink md:text-4xl">
                  {activeProject.title}
                </h2>
              </div>

              <div className="relative mb-8 h-[280px] w-full overflow-hidden rounded-lg border border-line md:h-[400px]">
                <Image
                  src={activeProject.images?.[0] || PLACEHOLDER}
                  alt={activeProject.title}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-cover"
                />
              </div>

              <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-12">
                <div className="md:col-span-8">
                  <h3 className="mb-3 font-space text-sm font-semibold uppercase tracking-wider text-ink">
                    Project Overview
                  </h3>
                  <p className="font-poppins text-sm leading-relaxed text-ink-muted">
                    {activeProject.description}
                  </p>
                </div>

                <dl className="flex flex-col gap-5 rounded-lg border border-line bg-surface-inset p-5 md:col-span-4">
                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <div className="flex flex-col">
                      <dt className="font-mono text-[9px] uppercase tracking-wider text-ink-subtle">
                        Client
                      </dt>
                      <dd className="font-space text-xs font-medium text-ink">
                        {activeProject.client}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <div className="flex flex-col">
                      <dt className="font-mono text-[9px] uppercase tracking-wider text-ink-subtle">
                        Duration
                      </dt>
                      <dd className="font-space text-xs font-medium text-ink">
                        {activeProject.duration}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Layers className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <div className="flex flex-col">
                      <dt className="font-mono text-[9px] uppercase tracking-wider text-ink-subtle">
                        Tech Stack
                      </dt>
                      <dd className="mt-1.5 flex flex-wrap gap-1">
                        {activeProject.technology.map((tech) => (
                          <Badge key={tech}>{tech}</Badge>
                        ))}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-line pt-6">
                {activeProject.github && (
                  <Button variant="secondary" href={activeProject.github} target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                    GitHub Repository
                  </Button>
                )}
                {activeProject.liveDemo && (
                  <Button href={activeProject.liveDemo} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Launch Live Demo
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
