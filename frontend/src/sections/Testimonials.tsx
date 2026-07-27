'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
import { SampleNotice, SampleTag, Section, SectionHeading } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';
import { API_BASE_URL } from '@/config';

interface Testimonial {
  _id: string;
  name: string;
  rating: number;
  review: string;
  company: string;
  photo: string;
}

const fallbackTestimonials: Testimonial[] = [
  {
    _id: 'tes1',
    name: 'Marcus Thorne',
    rating: 5,
    review:
      'The CRM they built cut our inbox triage down to almost nothing. Churn predictions land around 92% accuracy and support satisfaction is up 30%. They shipped when they said they would.',
    company: 'CEO, Aura Analytics',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
  },
  {
    _id: 'tes2',
    name: 'Sarah Jenkins',
    rating: 5,
    review:
      'Our landing pages convert at 18.5% now, up from under 7%. What impressed me most was that they pushed back on two ideas of mine that would not have worked.',
    company: 'Product Director, Jenkins Retail',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
  },
  {
    _id: 'tes3',
    name: 'Rajesh Nair',
    rating: 5,
    review:
      'The scrapers and lead bots replaced what used to be a four-person job. Deployed on AWS and running without intervention for eight months.',
    company: 'Operations VP, Nair Logistics',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [isSample, setIsSample] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/testimonials`);
        const data = await res.json();
        if (data.success && data.data?.length) {
          setTestimonials(data.data);
          setIsSample(false);
        }
      } catch {
        console.warn('Testimonials API unreachable. Showing sample reviews.');
      }
    };
    fetchTestimonials();
  }, []);

  if (!testimonials.length) return null;

  return (
    <Section id="testimonials" tone="raised">
      <SectionHeading
        index="05"
        eyebrow="Client feedback"
        title="What clients said afterwards."
      />

      {isSample && (
        <SampleNotice label="These reviews, the people quoted and their photographs are invented." />
      )}

      {/* Static grid rather than a carousel — all proof visible at once, nothing
          hidden behind an interaction a visitor may never perform. */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.slice(0, 3).map((t, idx) => (
          <motion.figure
            key={t._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative flex flex-col rounded-xl border border-line bg-surface p-7"
          >
            <Quote aria-hidden className="absolute right-6 top-6 h-8 w-8 text-line" />

            <div
              className="mb-5 flex gap-1"
              aria-label={`Rated ${t.rating} out of 5`}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  aria-hidden
                  className={cn(
                    'h-3.5 w-3.5',
                    i < t.rating ? 'fill-accent text-accent' : 'text-line-strong'
                  )}
                />
              ))}
            </div>

            <blockquote className="flex-1 text-sm leading-relaxed text-ink-muted">
              &ldquo;{t.review}&rdquo;
            </blockquote>

            <figcaption className="mt-7 flex items-center gap-3.5 border-t border-line pt-5">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-line">
                <Image
                  src={t.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <span className="flex flex-col">
                <span className="flex items-center gap-2 font-display text-sm font-bold text-ink">
                  {t.name}
                  {isSample && <SampleTag />}
                </span>
                <span className="mt-0.5 text-[11px] text-ink-subtle">{t.company}</span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}
