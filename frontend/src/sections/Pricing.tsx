'use client';

import { motion } from 'framer-motion';
import { Check, Package, Repeat, Timer } from 'lucide-react';
import { Button, Section, SectionHeading } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';
import { CONTACT } from '@/content/site';

/**
 * Engagement models rather than invented price tiers. We describe how billing
 * works and what is included; the number itself comes out of the discovery
 * call, which is honest and still gives a buyer something concrete to weigh.
 */
const models = [
  {
    icon: Package,
    name: 'Fixed-scope project',
    tagline: 'Most clients start here',
    best: 'A defined build with a clear finish line — a site, an app, an integration.',
    billing: 'Quoted as one number after the discovery call',
    featured: true,
    includes: [
      'Written scope agreed before work starts',
      'Milestone payments, not one lump sum',
      'Weekly demo builds on a staging URL',
      'Fixed price — scope changes get re-quoted',
      '30 days of post-launch bug fixes',
    ],
  },
  {
    icon: Repeat,
    name: 'Monthly retainer',
    tagline: 'For continuous work',
    best: 'Ongoing feature work, maintenance and support on a product that keeps moving.',
    billing: 'Reserved capacity billed monthly, cancel with 30 days notice',
    featured: false,
    includes: [
      'A set number of days reserved each month',
      'Priority response ahead of project work',
      'Dependency patching and uptime monitoring',
      'Monthly written summary of work done',
      'Unused days roll over once',
    ],
  },
  {
    icon: Timer,
    name: 'Consulting & audits',
    tagline: 'Short engagements',
    best: 'A second opinion — performance audits, architecture reviews, hiring support.',
    billing: 'Hourly or day rate, invoiced on completion',
    featured: false,
    includes: [
      'Codebase and architecture review',
      'Performance and Core Web Vitals audit',
      'Security and dependency assessment',
      'Written findings with prioritised fixes',
      'Follow-up call to walk through it',
    ],
  },
];

export default function Pricing() {
  const scrollToContact = () =>
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Section id="pricing" tone="canvas">
      <SectionHeading
        index="06"
        eyebrow="Engagement"
        title="Three ways to work with us."
        description="We do not publish fixed price lists, because a number without a scope is meaningless. What we do publish is exactly how billing works, so there are no surprises on the invoice."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {models.map((model, idx) => {
          const Icon = model.icon;
          return (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={cn(
                'relative flex flex-col rounded-xl border bg-surface p-7',
                model.featured ? 'border-accent-line' : 'border-line'
              )}
            >
              {model.featured && (
                <span className="absolute -top-2.5 left-7 rounded bg-accent px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent-ink">
                  {model.tagline}
                </span>
              )}

              <span
                className={cn(
                  'mb-5 flex h-10 w-10 items-center justify-center rounded-lg border',
                  model.featured
                    ? 'border-accent-line bg-accent-soft text-accent'
                    : 'border-line bg-surface-inset text-ink-subtle'
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>

              <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                {model.name}
              </h3>

              <p className="mt-2.5 text-[13px] leading-relaxed text-ink-muted">{model.best}</p>

              <p className="mt-5 rounded-lg border border-line bg-surface-inset px-4 py-3 font-mono text-[11px] leading-relaxed text-ink">
                {model.billing}
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-line pt-6">
                {model.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] text-ink-muted">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button
                variant={model.featured ? 'primary' : 'secondary'}
                fullWidth
                className="mt-7"
                onClick={scrollToContact}
              >
                Get a quote
              </Button>
            </motion.div>
          );
        })}
      </div>


    </Section>
  );
}
