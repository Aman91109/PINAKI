'use client';

import { Phone, MessageSquare, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, Section, SectionHeading } from '@/components/ui/primitives';

const contactChannels = [
  {
    icon: Phone,
    label: 'Call Us',
    description: 'Speak directly with our team',
    href: 'tel:+919508725672',
    display: '+91 9508725672',
    external: false,
  },
  {
    icon: MessageSquare,
    label: 'WhatsApp Us',
    description: 'Chat with us on WhatsApp for quick replies',
    href: 'https://wa.me/919508725672',
    display: '+91 9508725672',
    external: true,
  },
  {
    icon: Mail,
    label: 'Email Us',
    description: 'Send us your project details anytime',
    href: 'mailto:pinaki.sna@gmail.com',
    display: 'pinaki.sna@gmail.com',
    external: false,
  },
];

export default function Pricing() {
  return (
    <Section id="pricing" tone="raised" width="lg">
      <SectionHeading
        eyebrow="Get In Touch"
        title="Let's Discuss Your Project"
        description="Every project is unique. Reach out to us directly — we'll understand your requirements and craft a tailored solution just for you."
        align="center"
      />

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {contactChannels.map((channel, idx) => (
          <motion.div
            key={channel.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.12 }}
            className="group h-full"
          >
            <a
              href={channel.href}
              target={channel.external ? '_blank' : undefined}
              rel={channel.external ? 'noreferrer' : undefined}
              className="block h-full"
            >
              <Card interactive padding="lg" className="flex h-full flex-col gap-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-accent-line bg-accent-soft text-accent">
                  <channel.icon className="h-5 w-5" />
                </span>

                <div>
                  <h3 className="mb-1 font-space text-base font-bold uppercase tracking-wider text-ink">
                    {channel.label}
                  </h3>
                  <p className="font-poppins text-[11px] leading-relaxed text-ink-muted">
                    {channel.description}
                  </p>
                </div>

                <span className="mt-auto flex items-center justify-between gap-2 font-space text-xs font-semibold text-accent">
                  {channel.display}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Card>
            </a>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-xl border border-accent-line bg-accent-soft p-8 text-center"
      >
        <p className="mb-2 font-space text-lg font-bold text-ink">
          No Fixed Price Tags — Because Your Vision Is Custom
        </p>
        <p className="mx-auto max-w-lg font-poppins text-xs leading-relaxed text-ink-muted">
          We believe in transparent, honest conversations. Connect with us via call, WhatsApp, or
          email and we will provide a personalised quote based on your exact needs — no hidden fees,
          no surprises.
        </p>
      </motion.div>
    </Section>
  );
}
