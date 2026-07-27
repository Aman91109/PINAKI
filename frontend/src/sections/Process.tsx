'use client';

import { motion } from 'framer-motion';
import { PhoneCall, Ruler, Frame, Code2, ShieldCheck, Rocket } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/primitives';

/**
 * Steps are framed around what the client receives at each stage. The previous
 * version credited each phase to a "phase lead" who did not exist.
 */
const processSteps = [
  {
    step: '01',
    name: 'Discovery call',
    icon: PhoneCall,
    duration: '30 minutes, free',
    description:
      'We talk through what you are trying to achieve, what already exists, and what success looks like. If we are not the right fit we say so on this call.',
    deliverable: 'A written scope and a fixed quote — no obligation',
  },
  {
    step: '02',
    name: 'Architecture & plan',
    icon: Ruler,
    duration: '3–5 days',
    description:
      'We map the data model, pick the stack, identify the risky parts early and break the work into milestones you can track.',
    deliverable: 'Technical plan with dated milestones',
  },
  {
    step: '03',
    name: 'Interface design',
    icon: Frame,
    duration: '1–2 weeks',
    description:
      'Wireframes first, then high-fidelity screens in Figma. You review and sign off before a single component gets built.',
    deliverable: 'Clickable Figma prototype',
  },
  {
    step: '04',
    name: 'Build',
    icon: Code2,
    duration: '2–10 weeks',
    description:
      'We work in weekly increments against the milestone plan. You get a staging URL from week one, so progress is visible rather than described.',
    deliverable: 'Weekly demo build on a live staging link',
  },
  {
    step: '05',
    name: 'Test & harden',
    icon: ShieldCheck,
    duration: '3–7 days',
    description:
      'Auth flows, file uploads and API limits get exercised properly. We run performance and accessibility passes before anything reaches your users.',
    deliverable: 'Test report and security checklist',
  },
  {
    step: '06',
    name: 'Launch & support',
    icon: Rocket,
    duration: 'Ongoing',
    description:
      'We deploy, monitor the first weeks closely and hand over documentation. Retainers are available if you want us on call after that.',
    deliverable: 'Deployed app, docs and a handover session',
  },
];

export default function Process() {
  return (
    <Section id="process" tone="raised" width="lg">
      <SectionHeading
        index="03"
        eyebrow="How we work"
        title="A process designed so you are never guessing."
        description="Six stages, each with something concrete at the end of it. You always know what is happening, what it costs and when it lands."
      />

      <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
        {processSteps.map((proc, idx) => {
          const IconComp = proc.icon;
          return (
            <motion.li
              key={proc.step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (idx % 2) * 0.08 }}
              className="flex flex-col bg-surface p-7"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="font-mono text-3xl font-bold tracking-tight text-line-strong">
                  {proc.step}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-line bg-accent-soft text-accent">
                  <IconComp className="h-4 w-4" />
                </span>
              </div>

              <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                {proc.name}
              </h3>

              <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                {proc.duration}
              </span>

              <p className="mt-3.5 text-sm leading-relaxed text-ink-muted">{proc.description}</p>

              <p className="mt-auto flex items-start gap-2 pt-6 text-[13px] text-ink">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                <span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                    You receive
                  </span>
                  <br />
                  {proc.deliverable}
                </span>
              </p>
            </motion.li>
          );
        })}
      </ol>
    </Section>
  );
}
