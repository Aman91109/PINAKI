'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';
import { API_BASE_URL } from '@/config';

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

const fallbackFAQs: FaqItem[] = [
  { _id: 'f1', question: 'How long does a typical full-stack project take?', answer: 'Simple Next.js landing portfolios or corporate websites take 2-4 weeks. Complex full-stack applications with database panels take 6-12 weeks.', order: 1 },
  { _id: 'f2', question: 'Do you design in Figma before coding?', answer: 'Yes! Elena Rostova, our Creative Director, maps user flows, wireframes, and complete high-fidelity desktop and mobile layouts in Figma.', order: 2 },
  { _id: 'f3', question: 'Can we edit the website content after launch?', answer: 'Absolutely. We deliver a custom-tailored Admin Dashboard CMS where you can manage portfolio projects, blogs, team profiles, and FAQs.', order: 3 },
  { _id: 'f4', question: 'What happens to file attachments sent via contact form?', answer: 'They are routed through our secure Multer pipeline and hosted on Cloudinary or served locally from our uploads folder.', order: 4 },
  { _id: 'f5', question: 'Do you offer hosting setup and cloud support?', answer: 'Yes, we deploy Next.js to Vercel, Node/Express to Render, and database to MongoDB Atlas by default, or setting up custom Docker/AWS.', order: 5 },
];

export default function FAQ() {
  const [faqs, setFaqs] = useState<FaqItem[]>(fallbackFAQs);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/faqs`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const sorted = [...data.data].sort((a: FaqItem, b: FaqItem) => a.order - b.order);
          setFaqs(sorted);
        }
      } catch {
        console.warn('Could not connect to FAQ API. Using local fallbacks.');
      }
    };
    fetchFAQs();
  }, []);

  return (
    <Section id="faq" tone="canvas" width="md">
      <SectionHeading eyebrow="Questions" title="Frequently Asked Queries" align="center" />

      {/* Single bordered stack rather than 5 detached cards — reads as one control. */}
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
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left transition-colors',
                    isOpen ? 'bg-surface-hover' : 'hover:bg-surface-hover'
                  )}
                >
                  <span className="font-space text-sm font-bold tracking-wide text-ink md:text-base">
                    {faq.question}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors',
                      isOpen
                        ? 'border-accent bg-accent text-accent-ink'
                        : 'border-line text-ink-subtle'
                    )}
                  >
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
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
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden bg-surface-hover"
                  >
                    <p className="px-5 pb-5 font-poppins text-xs leading-relaxed text-ink-muted md:text-sm">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
