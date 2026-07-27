'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Target, Eye, Users } from 'lucide-react';
import { Card, Section, SectionHeading } from '@/components/ui/primitives';

const coreValues = [
  {
    icon: Target,
    title: 'Mission Oriented',
    description:
      'We translate complex backend workflows and frontend interactive frameworks into straightforward growth vectors for your business operations.',
  },
  {
    icon: Eye,
    title: 'Clear Vision',
    description:
      'Aiming to establish the high standard for client-first full stack engineering, providing scalable solutions with zero tech debt.',
  },
  {
    icon: ShieldCheck,
    title: 'Strict Security',
    description:
      'Every project goes through rigorous JWT authentication mapping, secure role checks, and database validation processes.',
  },
  {
    icon: Users,
    title: 'Transparent Culture',
    description:
      'We believe in maintaining documentation integrity, active communication pipelines, and post-delivery maintenance setups.',
  },
];

export default function About() {
  return (
    <Section id="about" tone="canvas">
      <SectionHeading eyebrow="Who We Are" title="An Elite Collective of Digital Engineers" />

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <h3 className="font-space text-xl font-semibold tracking-wide text-ink">
            We design and code digital structures that solve business bottlenecks.
          </h3>

          <p className="font-poppins text-sm leading-relaxed text-ink-muted">
            Pinaki Labs was founded by three creative engineers who got tired of cookie-cutter
            software solutions. We realized that elite agencies were gatekeeping high-end visual
            designs (Awwwards-tier) from growing enterprises, while traditional software houses
            delivered boring, slow platforms.
          </p>

          <p className="font-poppins text-sm leading-relaxed text-ink-muted">
            We bridged that gap. By combining next-generation frontend frameworks (Next.js 15,
            React, Three.js) with robust backend rest endpoints, we build products that look like
            high-end visual art but operate with high reliability.
          </p>

          <blockquote className="mt-2 rounded-r-lg border-l-2 border-accent bg-surface py-4 pl-5 pr-4">
            <p className="font-space text-sm italic leading-relaxed text-ink-muted">
              &ldquo;We don&apos;t build minimum viable products. We build digital command consoles
              that command market authority and instantly lock in client trust.&rdquo;
            </p>
            <footer className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              — Pinaki Team Founders
            </footer>
          </blockquote>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
          {coreValues.map((val, idx) => {
            const IconComp = val.icon;
            return (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="h-full"
              >
                <Card padding="lg" className="h-full">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg border border-accent-line bg-accent-soft text-accent">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <h4 className="mb-3 font-space text-lg font-bold text-ink">{val.title}</h4>
                  <p className="font-poppins text-xs leading-relaxed text-ink-muted">
                    {val.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
