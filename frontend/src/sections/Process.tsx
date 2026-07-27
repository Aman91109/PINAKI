'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Cpu, Palette, Code2, ShieldAlert, Cloud, HelpCircle } from 'lucide-react';
import { Card, Section, SectionHeading } from '@/components/ui/primitives';

const processSteps = [
  {
    step: '01',
    name: 'Requirement Discussion',
    icon: MessageSquare,
    description:
      'We hold exhaustive consultation sessions to examine your goals, establish scopes, define project deadlines, and formulate the budget tier.',
    lead: 'Elena Rostova (Creative Director)',
  },
  {
    step: '02',
    name: 'Planning & Architecture',
    icon: Cpu,
    description:
      'Aiden structures database tables (Mongoose collections), outlines REST controllers, and plans AI/ML models to guarantee clean layouts.',
    lead: 'Aiden Vance (Systems Architect)',
  },
  {
    step: '03',
    name: 'UI/UX Visual Design',
    icon: Palette,
    description:
      'Elena builds interactive prototypes in Figma, mapping user flows and creating dark-theme layouts that command premium authority.',
    lead: 'Elena Rostova (Creative Director)',
  },
  {
    step: '04',
    name: 'Code Development',
    icon: Code2,
    description:
      'Zephyr compiles the responsive Next.js 15 frontend with Framer Motion, and Aiden builds the Node/Express backend endpoints with JWT.',
    lead: 'Zephyr Croft (Lead Developer)',
  },
  {
    step: '05',
    name: 'Rigorous Testing',
    icon: ShieldAlert,
    description:
      'We run security checks on auth middlewares, debug files upload pipelines, audit API query speeds, and compile TS build checks.',
    lead: 'Zephyr & Aiden (Engineering)',
  },
  {
    step: '06',
    name: 'Deployment & Launch',
    icon: Cloud,
    description:
      'Your frontend is deployed to Vercel, the Express server is hosted on Render, and MongoDB databases are mapped on Atlas CDN configurations.',
    lead: 'Aiden Vance (Systems Architect)',
  },
  {
    step: '07',
    name: 'Dedicated Support',
    icon: HelpCircle,
    description:
      'Pinaki provides round-the-clock maintenance agreements, dependency updates, weekly database backups, and feature enhancements.',
    lead: 'Pinaki Support Engineers',
  },
];

export default function Process() {
  return (
    <Section id="process" tone="raised" width="lg">
      <SectionHeading
        eyebrow="Methodology"
        title="How We Translate Ideas To Production"
        align="center"
      />

      {/* Timeline rail */}
      <ol className="relative ml-3 flex flex-col gap-8 border-l border-line pl-8 md:ml-6 md:pl-12">
        {processSteps.map((proc, idx) => {
          const IconComp = proc.icon;
          return (
            <motion.li
              key={proc.step}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="relative"
            >
              {/* Node on the rail */}
              <span
                aria-hidden
                className="absolute -left-[41px] top-6 flex h-[26px] w-[26px] items-center justify-center rounded-full border-4 border-canvas-raised bg-accent font-mono text-[9px] font-bold text-accent-ink md:-left-[61px] md:h-8 md:w-8 md:text-[10px]"
              >
                {proc.step}
              </span>

              <Card padding="lg">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
                      Step {proc.step}
                    </span>
                    <h3 className="mt-1 font-space text-lg font-bold text-ink md:text-xl">
                      {proc.name}
                    </h3>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent-line bg-accent-soft text-accent">
                    <IconComp className="h-4 w-4" />
                  </span>
                </div>

                <p className="mb-5 max-w-2xl font-poppins text-xs leading-relaxed text-ink-muted md:text-sm">
                  {proc.description}
                </p>

                <p className="flex w-max max-w-full flex-wrap items-center gap-2 rounded-lg border border-line bg-surface-inset px-3 py-2 font-mono text-[10px] md:text-xs">
                  <span className="text-ink-subtle">Phase lead:</span>
                  <span className="text-accent">{proc.lead}</span>
                </p>
              </Card>
            </motion.li>
          );
        })}
      </ol>
    </Section>
  );
}
