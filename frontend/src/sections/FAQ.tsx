'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Button, Section, SectionHeading } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';
import { CONTACT } from '@/content/site';
import { API_BASE_URL } from '@/config';

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

const fallbackFAQs: FaqItem[] = [
  {
    _id: 'f1',
    question: 'How long does a typical project take?',
    answer:
      'A marketing site or landing page is usually 2–4 weeks. A full application with a database, auth and an admin panel runs 6–12 weeks. You get a dated milestone plan before we start, so the estimate is not a guess you have to trust.',
    order: 1,
  },
  {
    _id: 'f2',
    question: 'What does it cost?',
    answer:
      'It depends entirely on scope, which is why we do not publish a price list. After a 30-minute discovery call you get a written scope and one fixed number. That quote is free and there is no obligation attached to it.',
    order: 2,
  },
  {
    _id: 'f3',
    question: 'Do you design before you code?',
    answer:
      'Yes. Wireframes first, then high-fidelity screens in Figma that you sign off on. Building before the design is settled is how projects double in cost.',
    order: 3,
  },
  {
    _id: 'f4',
    question: 'Can we edit the site ourselves after launch?',
    answer:
      'Yes. Projects ship with an admin dashboard where you manage portfolio entries, blog posts, team profiles, services and FAQs without touching code. We walk you through it on the handover call.',
    order: 4,
  },
  {
    _id: 'f5',
    question: 'Who owns the code?',
    answer:
      'You do, on final payment — source code, design files and infrastructure accounts. We do not host your business on our accounts or hold anything back as leverage.',
    order: 5,
  },
  {
    _id: 'f6',
    question: 'What happens if something breaks after launch?',
    answer:
      'Every project includes 30 days of bug fixes at no charge. After that you can take a monthly retainer or just call us when something needs attention — we do not force ongoing contracts.',
    order: 6,
  },
  {
    _id: 'f7',
    question: 'Do you work with clients outside India?',
    answer: `Regularly. We are on ${CONTACT.timezone} and keep overlapping hours with European and US-East schedules. Calls, written updates and a shared staging link mean the timezone gap rarely matters.`,
    order: 7,
  },
  {
    _id: 'f8',
    question: 'Can you take over a project someone else started?',
    answer:
      'Often, yes. We start with a paid audit of the existing codebase so we can tell you honestly whether it is worth continuing or cheaper to rebuild. We will say the unprofitable thing if it is true.',
    order: 8,
  },
];

export default function FAQ() {
  const [faqs, setFaqs] = useState<FaqItem[]>(fallbackFAQs);
  const [openId, setOpenId] = useState<string | null>(fallbackFAQs[0]._id);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/faqs`);
        const data = await res.json();
        if (data.success && data.data?.length) {
          const sorted = [...data.data].sort((a: FaqItem, b: FaqItem) => a.order - b.order);
          setFaqs(sorted);
          setOpenId(sorted[0]._id);
        }
      } catch {
        console.warn('FAQ API unreachable. Using local defaults.');
      }
    };
    fetchFAQs();
  }, []);

  return (
    <Section id="faq" tone="raised" width="lg">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading index="07" eyebrow="FAQ" title="Questions we get asked." className="mb-8" />
          <p className="text-sm leading-relaxed text-ink-muted">
            Anything not covered here, just ask. We reply {CONTACT.responseTime} and we would rather
            answer ten questions up front than have you commit to the wrong thing.
          </p>
          <Button
            variant="secondary"
            className="mt-6"
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ask us directly
          </Button>
        </div>

        <div className="lg:col-span-8">
          <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {faqs.map((faq) => {
              const isOpen = openId === faq._id;
              const panelId = `faq-panel-${faq._id}`;
              return (
                <div key={faq._id}>
                  <h3>
                    <button
                      onClick={() => setOpenId(isOpen ? null : faq._id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-surface-hover"
                    >
                      <span
                        className={cn(
                          'font-display text-sm font-bold tracking-tight transition-colors md:text-base',
                          isOpen ? 'text-accent' : 'text-ink'
                        )}
                      >
                        {faq.question}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded border transition-colors',
                          isOpen
                            ? 'border-accent bg-accent text-accent-ink'
                            : 'border-line text-ink-subtle'
                        )}
                      >
                        {isOpen ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-ink-muted">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
