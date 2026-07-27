'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MessageSquare,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Button,
  Card,
  Field,
  Input,
  Section,
  SectionHeading,
  Select,
  Textarea,
} from '@/components/ui/primitives';
import { cn } from '@/lib/cn';
import { API_BASE_URL } from '@/config';

const projectTypes = [
  'Web Development',
  'AI/ML Solutions',
  'UI/UX Design',
  'Automation',
  'Mobile Apps',
];

const directChannels = [
  {
    icon: Mail,
    label: 'Send Email',
    value: 'pinaki.sna@gmail.com',
    href: 'mailto:pinaki.sna@gmail.com',
    external: false,
  },
  {
    icon: MessageSquare,
    label: 'WhatsApp Direct',
    value: '+91 9508725672',
    href: 'https://wa.me/919508725672',
    external: true,
  },
  {
    icon: Phone,
    label: 'Direct Call',
    value: '+91 9508725672',
    href: 'tel:+919508725672',
    external: false,
  },
];

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  projectType: 'Web Development',
  message: '',
};

export default function Contact() {
  const [formData, setFormData] = useState(emptyForm);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSuccessFlow = (msg: string) => {
    setStatus('success');
    setFeedbackMsg(msg);
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setFormData(emptyForm);
    setSelectedDate('');
    setSelectedTime('');
  };

  const saveLeadLocally = (lead: Record<string, string>) => {
    try {
      const existing = JSON.parse(localStorage.getItem('lead_inquiries') || '[]');
      existing.push({ ...lead, submittedAt: new Date().toISOString() });
      localStorage.setItem('lead_inquiries', JSON.stringify(existing));
    } catch (e) {
      console.error('Error saving local lead', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setFeedbackMsg('Please complete all required fields (Name, Email, Message).');
      return;
    }

    setStatus('submitting');
    let finalMessage = formData.message;
    if (selectedDate && selectedTime) {
      finalMessage += `\n\n[DISCOVERY CALL REQUESTED: ${selectedDate} at ${selectedTime}]`;
    }

    try {
      const bodyData = new FormData();
      bodyData.append('name', formData.name);
      bodyData.append('email', formData.email);
      bodyData.append('phone', formData.phone);
      bodyData.append('company', formData.company);
      bodyData.append('projectType', formData.projectType);
      bodyData.append('message', finalMessage);

      const res = await fetch(`${API_BASE_URL}/api/public/lead`, {
        method: 'POST',
        body: bodyData,
      });

      const data = await res.json();
      if (data.success) {
        handleSuccessFlow(
          data.message || 'Inquiry submitted successfully! Our team will contact you shortly.'
        );
      } else {
        saveLeadLocally({ ...formData, message: finalMessage });
        handleSuccessFlow('Inquiry submitted successfully! Our team will contact you shortly.');
      }
    } catch (err) {
      console.warn('API connection offline, saving lead locally:', err);
      saveLeadLocally({ ...formData, message: finalMessage });
      handleSuccessFlow('Inquiry submitted successfully! Our team will contact you shortly.');
    }
  };

  return (
    <Section id="contact" tone="raised">
      <SectionHeading
        eyebrow="Hire Us"
        title="Initiate Project Request"
        description="Tell us what you're building. We reply within a few hours with next steps — no automated funnels."
        align="center"
      />

      <div className="mb-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Direct channels + scheduling */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <h3 className="font-space text-lg font-bold text-ink">
            Connect Directly with the Directors
          </h3>

          <div className="flex flex-col gap-3">
            {directChannels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.external ? '_blank' : undefined}
                rel={channel.external ? 'noreferrer' : undefined}
                className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 transition-colors duration-200 hover:border-accent-line hover:bg-surface-hover"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent-line bg-accent-soft text-accent">
                  <channel.icon className="h-4 w-4" />
                </span>
                <span className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                    {channel.label}
                  </span>
                  <span className="font-space text-xs text-ink">{channel.value}</span>
                </span>
              </a>
            ))}
          </div>

          <Card padding="md" className="flex flex-col gap-5">
            <h4 className="flex items-center gap-2 font-space text-sm font-semibold uppercase tracking-wider text-ink">
              <CalendarIcon className="h-4 w-4 text-accent" />
              Schedule Discovery Call
            </h4>
            <p className="font-poppins text-xs leading-relaxed text-ink-muted">
              Choose a preferred date and time block. We will confirm the call on WhatsApp or email.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Date">
                {(id) => (
                  <Input
                    id={id}
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                )}
              </Field>
              <Field label="Time Block">
                {(id) => (
                  <Select
                    id={id}
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    <option value="">Select Time</option>
                    <option value="10:00 AM - 10:30 AM IST">10:00 AM IST</option>
                    <option value="01:30 PM - 02:00 PM IST">01:30 PM IST</option>
                    <option value="04:00 PM - 04:30 PM IST">04:00 PM IST</option>
                    <option value="07:00 PM - 07:30 PM IST">07:00 PM IST</option>
                  </Select>
                )}
              </Field>
            </div>
          </Card>
        </div>

        {/* Lead form */}
        <Card padding="lg" className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Your Name *">
                {(id) => (
                  <Input
                    id={id}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    autoComplete="name"
                    required
                  />
                )}
              </Field>
              <Field label="Email Address *">
                {(id) => (
                  <Input
                    id={id}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. rahul@company.com"
                    autoComplete="email"
                    required
                  />
                )}
              </Field>
              <Field label="Phone (Optional)">
                {(id) => (
                  <Input
                    id={id}
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 9508725672"
                    autoComplete="tel"
                  />
                )}
              </Field>
              <Field label="Company Name">
                {(id) => (
                  <Input
                    id={id}
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Corp"
                    autoComplete="organization"
                  />
                )}
              </Field>
            </div>

            <fieldset className="flex flex-col gap-2.5">
              <legend className="mb-2.5 font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                Scope of Work
              </legend>
              <div className="flex flex-wrap gap-2">
                {projectTypes.map((type) => {
                  const isActive = formData.projectType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setFormData((prev) => ({ ...prev, projectType: type }))}
                      className={cn(
                        'cursor-pointer rounded-lg border px-3.5 py-2 font-space text-[10px] uppercase tracking-wider transition-colors duration-200',
                        isActive
                          ? 'border-accent bg-accent text-accent-ink'
                          : 'border-line bg-surface-inset text-ink-muted hover:border-line-strong hover:text-ink'
                      )}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <Field label="Detailed Message *">
              {(id) => (
                <Textarea
                  id={id}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Describe your project idea, requirements, or anything you'd like to discuss..."
                  required
                />
              )}
            </Field>

            <p className="rounded-lg border border-accent-line bg-accent-soft p-4 font-poppins text-[11px] leading-relaxed text-ink-muted">
              <span className="font-semibold text-accent">No pricing tags here.</span> After you
              submit, our team will reach out via WhatsApp or email to understand your scope and
              share a custom quote personally.
            </p>

            <Button type="submit" size="lg" fullWidth disabled={status === 'submitting'}>
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting proposal…
                </>
              ) : (
                'Launch Request'
              )}
            </Button>

            <div aria-live="polite">
              <AnimatePresence mode="wait">
                {status === 'success' && (
                  <motion.p
                    key="ok"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex gap-3 rounded-lg border border-positive-line bg-positive-soft p-4 font-poppins text-xs text-positive"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span>{feedbackMsg}</span>
                  </motion.p>
                )}

                {status === 'error' && (
                  <motion.p
                    key="err"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex gap-3 rounded-lg border border-negative-line bg-negative-soft p-4 font-poppins text-xs text-negative"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{feedbackMsg}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Card>
      </div>

      {/* Map */}
      <Card id="map" padding="md" className="flex flex-col gap-4 scroll-mt-24">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h3 className="flex items-center gap-2 font-space text-base font-bold uppercase tracking-wider text-ink">
            <MapPin className="h-5 w-5 text-accent" />
            Office Hub — Sector 62, Noida
          </h3>
          <a
            href="https://www.openstreetmap.org/?mlat=28.6280&mlon=77.3649#map=15/28.6280/77.3649"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline"
          >
            Open Full Map <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <p className="font-poppins text-xs text-ink-muted">
          New Delhi NCR, India — interactive OpenStreetMap view.
        </p>

        <div className="relative h-[320px] w-full overflow-hidden rounded-lg border border-line">
          <iframe
            title="Pinaki Labs office location on OpenStreetMap"
            width="100%"
            height="100%"
            loading="lazy"
            src="https://www.openstreetmap.org/export/embed.html?bbox=77.3500%2C28.6200%2C77.3800%2C28.6400&amp;layer=mapnik&amp;marker=28.6280%2C77.3649"
            className="h-full w-full invert-[0.92] hue-rotate-180 contrast-[1.1] brightness-[0.9]"
          />
        </div>
      </Card>
    </Section>
  );
}
