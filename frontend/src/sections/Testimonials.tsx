'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';
import { Card, Section, SectionHeading } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';
import { API_BASE_URL } from '@/config';

const fallbackTestimonials = [
  {
    _id: 'tes1',
    name: 'Marcus Thorne',
    rating: 5,
    review:
      'The AI CRM portal this team built has completely streamlined our inbox management. Churn predictions are sitting at 92% accuracy, and customer satisfaction is up by 30%. Absolutely premium engineering.',
    company: 'CEO, Aura Analytics Corp',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
  },
  {
    _id: 'tes2',
    name: 'Sarah Jenkins',
    rating: 5,
    review:
      'Working with them felt like hiring an elite design lab. The Next.js landing layouts they designed convert at a massive 18.5%, and the 3D scroll effects blew our board away.',
    company: 'Product Director, Jenkins Retail',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
  },
  {
    _id: 'tes3',
    name: 'Rajesh Nair',
    rating: 5,
    review:
      'The Python web scrapers and lead bots they wrote automated what used to be a full-time 4-person job. They deployed it on AWS, and it runs like a clock. Extremely worth the investment.',
    company: 'Operations VP, Nair Logistic Solutions',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
  },
  {
    _id: 'tes4',
    name: 'Lara Croft',
    rating: 5,
    review:
      "Elena's Figma designs and UI mockups were breath-taking. They translated a highly complex cryptocurrency concept into a sleek, clean mobile application. Client reviews are excellent.",
    company: 'Creative Lead, Croft Cryptology',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/testimonials`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setTestimonials(data.data);
        }
      } catch {
        console.warn('Could not connect to testimonials API. Using local fallbacks.');
      }
    };
    fetchTestimonials();
  }, []);

  const handleNext = () => setActive((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[active];
  if (!current) return null;

  const navButton =
    'flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-ink-subtle transition-colors hover:border-line-strong hover:text-ink';

  return (
    <Section tone="raised" width="lg">
      <SectionHeading eyebrow="Testimonials" title="Trusted By Elite Innovators" align="center" />

      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current._id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
          >
            <Card padding="lg" className="min-h-[340px] md:p-12">
              <Quote aria-hidden className="absolute right-8 top-8 h-10 w-10 text-line-strong" />

              <div className="mb-6 flex gap-1" aria-label={`Rated ${current.rating} out of 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    aria-hidden
                    className={cn(
                      'h-3.5 w-3.5',
                      i < current.rating ? 'fill-accent text-accent' : 'text-line-strong'
                    )}
                  />
                ))}
              </div>

              <blockquote className="mb-8 font-poppins text-sm leading-relaxed text-ink-muted md:text-base">
                &ldquo;{current.review}&rdquo;
              </blockquote>

              <div className="flex items-center gap-4">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-line">
                  <Image
                    src={current.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </span>
                <span className="flex flex-col">
                  <span className="font-space text-sm font-bold text-ink">{current.name}</span>
                  <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
                    {current.company}
                  </span>
                </span>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button onClick={handlePrev} aria-label="Previous testimonial" className={navButton}>
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex gap-2" role="tablist" aria-label="Select testimonial">
            {testimonials.map((t, i) => (
              <button
                key={t._id}
                role="tab"
                aria-selected={i === active}
                aria-label={`Testimonial ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  'h-1.5 cursor-pointer rounded-full transition-all duration-300',
                  i === active ? 'w-6 bg-accent' : 'w-1.5 bg-line-strong hover:bg-ink-subtle'
                )}
              />
            ))}
          </div>

          <button onClick={handleNext} aria-label="Next testimonial" className={navButton}>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Section>
  );
}
