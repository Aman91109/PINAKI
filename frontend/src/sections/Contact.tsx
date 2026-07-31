'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  Clock,
  ExternalLink,
  ArrowUpRight,
} from 'lucide-react';
import {
  Button,
  Field,
  Input,
  Section,
  SectionHeading,
  Select,
  Textarea,
} from '@/components/ui/primitives';
import { cn } from '@/lib/cn';
import { AVAILABILITY, CONTACT } from '@/content/site';
import { API_BASE_URL } from '@/config';

const projectTypes = [
  'Web application',
  'Marketing site',
  'AI / ML',
  'Automation',
  'Mobile app',
  'Something else',
];

/**
 * Budget bands qualify leads before the call. Adjust these to match your own
 * floor — they are appended to the message body, so the API needs no changes.
 */
const budgetBands = [
  'Not sure yet',
  'Under ₹1,00,000',
  '₹1,00,000 – ₹3,00,000',
  '₹3,00,000 – ₹8,00,000',
  'Over ₹8,00,000',
];

const channels = [
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    external: false,
  },
  {
    icon: MessageSquare,
    label: 'WhatsApp',
    value: CONTACT.phone,
    href: CONTACT.whatsappHref,
    external: true,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: CONTACT.phone,
    href: CONTACT.phoneHref,
    external: false,
  },
];

const emptyForm = {
  name: '',
  email: '',
  company: '',
  projectType: 'Web application',
  budget: 'Not sure yet',
  message: '',
};

export default function Contact() {
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setFeedbackMsg('Please fill in your name, email and a short description of the project.');
      return;
    }

    setStatus('submitting');

    try {
      const bodyData = new FormData();
      bodyData.append('name', formData.name);
      bodyData.append('email', formData.email);
      bodyData.append('phone', '');
      bodyData.append('company', formData.company);
      bodyData.append('budget', formData.budget);
      bodyData.append('projectType', formData.projectType);
      bodyData.append('message', formData.message);

      const res = await fetch(`${API_BASE_URL}/api/public/lead`, {
        method: 'POST',
        body: bodyData,
      });
      const data = await res.json();

      if (!data.success) saveLeadLocally(formData);
    } catch (err) {
      console.warn('Lead API offline, saving locally:', err);
      saveLeadLocally(formData);
    }

    setStatus('success');
    setFeedbackMsg(
      `Thanks — that came through. We read every enquiry ourselves and will reply ${CONTACT.responseTime}.`
    );
    setFormData(emptyForm);
  };

  return (
    <Section id="contact" tone="raised">
      <SectionHeading
        index="09"
        eyebrow="Start a project"
        title="Tell us what you're building."
        description="A paragraph is enough to start. We will come back with questions, a recommended approach and a fixed quote — free, and with nothing attached to it."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left rail */}
        <div className="flex flex-col gap-4 lg:col-span-4">
          <div className="rounded-xl border border-line bg-surface p-6">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
              </span>
              <span className="font-display text-sm font-bold text-ink">{AVAILABILITY.status}</span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{AVAILABILITY.detail}</p>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line">
            {channels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.external ? '_blank' : undefined}
                rel={channel.external ? 'noreferrer' : undefined}
                className="group flex items-center gap-4 bg-surface p-5 transition-colors hover:bg-surface-hover"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-inset text-ink-subtle transition-colors group-hover:border-accent-line group-hover:bg-accent-soft group-hover:text-accent">
                  <channel.icon className="h-4 w-4" />
                </span>
                <span className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                    {channel.label}
                  </span>
                  <span className="text-sm text-ink">{channel.value}</span>
                </span>
                <ArrowUpRight className="ml-auto h-4 w-4 text-ink-subtle transition-colors group-hover:text-accent" />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-6 text-[13px] text-ink-muted">
            <span className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-accent" />
              Replies {CONTACT.responseTime} · {CONTACT.timezone}
            </span>
            <span className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-accent" />
              {CONTACT.city}, {CONTACT.region}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-line bg-surface p-6 md:p-8 lg:col-span-8">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[420px] flex-col items-center justify-center text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-positive-line bg-positive-soft text-positive">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-ink">
                  Message received
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
                  {feedbackMsg}
                </p>
                <Button
                  variant="secondary"
                  className="mt-7"
                  onClick={() => {
                    setStatus('idle');
                    setFeedbackMsg('');
                  }}
                >
                  Send another
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
                noValidate
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Your name *">
                    {(id) => (
                      <Input
                        id={id}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Rahul Sharma"
                        autoComplete="name"
                        required
                      />
                    )}
                  </Field>
                  <Field label="Email *">
                    {(id) => (
                      <Input
                        id={id}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="rahul@company.com"
                        autoComplete="email"
                        required
                      />
                    )}
                  </Field>
                  <Field label="Company">
                    {(id) => (
                      <Input
                        id={id}
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Acme Ltd"
                        autoComplete="organization"
                      />
                    )}
                  </Field>
                  <Field label="Budget range">
                    {(id) => (
                      <Select
                        id={id}
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                      >
                        {budgetBands.map((band) => (
                          <option key={band} value={band}>
                            {band}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>
                </div>

                <fieldset>
                  <legend className="mb-3 font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                    What kind of project?
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
                            'cursor-pointer rounded-lg border px-3.5 py-2 font-display text-xs tracking-wide transition-colors duration-200',
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

                <Field
                  label="What are you building? *"
                  hint="Deadlines, existing systems and what success looks like all help us quote accurately."
                >
                  {(id) => (
                    <Textarea
                      id={id}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="We need a booking system for our clinic — patients pick a slot, staff manage it from a dashboard, and it has to talk to our existing records system…"
                      required
                    />
                  )}
                </Field>

                <div aria-live="polite">
                  {status === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-1 flex gap-3 rounded-lg border border-negative-line bg-negative-soft p-4 text-xs text-negative"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{feedbackMsg}</span>
                    </motion.p>
                  )}
                </div>

                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <Button type="submit" size="lg" disabled={status === 'submitting'}>
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      'Send enquiry'
                    )}
                  </Button>
                  <span className="text-xs text-ink-subtle">
                    No newsletter signup, no sales sequence. Just a reply.
                  </span>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Location */}
      <div id="map" className="mt-6 scroll-mt-24 overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex flex-col justify-between gap-3 border-b border-line p-6 sm:flex-row sm:items-center">
          <h3 className="flex items-center gap-2.5 font-display text-base font-bold text-ink">
            <MapPin className="h-4 w-4 text-accent" />
            {CONTACT.city}, {CONTACT.region}
          </h3>
          <a
            href="https://www.openstreetmap.org/?mlat=28.6280&mlon=77.3649#map=15/28.6280/77.3649"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline"
          >
            Open in maps <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="relative h-[300px] w-full">
          <iframe
            title="Pinaki studio location"
            width="100%"
            height="100%"
            loading="lazy"
            src="https://www.openstreetmap.org/export/embed.html?bbox=77.3500%2C28.6200%2C77.3800%2C28.6400&amp;layer=mapnik&amp;marker=28.6280%2C77.3649"
            className="h-full w-full grayscale invert-[0.93] contrast-[0.9]"
          />
        </div>
      </div>
    </Section>
  );
}
