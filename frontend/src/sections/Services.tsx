'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button, Section, SectionHeading } from '@/components/ui/primitives';
import { API_BASE_URL } from '@/config';

const fallbackServices = [
  { name: 'Website Development', description: 'Fast, secure, accessible sites built on Next.js and React.', iconName: 'Layout', features: ['Responsive', 'SEO-ready', 'Core Web Vitals'] },
  { name: 'Landing Pages', description: 'Conversion-focused pages that turn ad spend into qualified leads.', iconName: 'Compass', features: ['Clear CTAs', 'A/B ready', 'Analytics wired'] },
  { name: 'Business Websites', description: 'Corporate sites that establish credibility and are easy to update.', iconName: 'Building', features: ['CMS included', 'Secure hosting', 'Lead capture'] },
  { name: 'Portfolio Websites', description: 'Showcase sites for studios and individuals who are judged on craft.', iconName: 'Briefcase', features: ['Custom motion', 'Case studies', 'CMS included'] },
  { name: 'E-Commerce', description: 'Storefronts with custom checkout, subscriptions and an ops dashboard.', iconName: 'ShoppingBag', features: ['Stripe', 'Order admin', 'Inventory sync'] },
  { name: 'AI Chatbots', description: 'Assistants grounded in your own docs, with clean handover to a human.', iconName: 'MessageSquareCode', features: ['RAG retrieval', 'Context memory', 'Human handover'] },
  { name: 'Machine Learning', description: 'Forecasting, scoring and segmentation models trained on your data.', iconName: 'Cpu', features: ['Python', 'Pipelines', 'Served via API'] },
  { name: 'Deep Learning', description: 'Vision and language models for classification and extraction work.', iconName: 'Brain', features: ['CNNs & RNNs', 'Transformers', 'OCR pipelines'] },
  { name: 'Python Automation', description: 'Scrapers, report generators and back-office scripts that run themselves.', iconName: 'Terminal', features: ['Web scraping', 'Scheduled jobs', 'API syncs'] },
  { name: 'API Development', description: 'REST and GraphQL services with auth, rate limiting and real documentation.', iconName: 'Share2', features: ['JWT & OAuth', 'OpenAPI docs', 'Rate limiting'] },
  { name: 'Dashboards', description: 'Internal consoles that make your operational data legible at a glance.', iconName: 'PieChart', features: ['Live data', 'CSV export', 'Role-based access'] },
  { name: 'UI/UX Design', description: 'Interface design in Figma, delivered as a build-ready component system.', iconName: 'Layers', features: ['Prototypes', 'Design tokens', 'Handover specs'] },
  { name: 'Graphic Design', description: 'Brand marks, decks and social assets that stay consistent everywhere.', iconName: 'Palette', features: ['Vector assets', 'Brand guide', 'Social kits'] },
  { name: 'SEO Optimization', description: 'Technical audits, schema and speed work aimed at rankings that hold.', iconName: 'Search', features: ['Site audit', 'Schema markup', 'Rank tracking'] },
  { name: 'Hosting & Deployment', description: 'Vercel, Render, AWS or Docker with CI/CD and automated backups.', iconName: 'Cloud', features: ['GitHub Actions', 'Zero downtime', 'SSL & backups'] },
  { name: 'Maintenance', description: 'Ongoing patching, monitoring and small changes on a monthly retainer.', iconName: 'ShieldCheck', features: ['Daily backups', 'Dependency patches', 'Uptime alerts'] },
];

export default function Services() {
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/services`);
        const data = await res.json();
        if (data.success && data.data?.length) setServices(data.data);
      } catch {
        console.warn('Services API unreachable. Using local defaults.');
      }
    };
    fetchServices();
  }, []);

  const renderIcon = (iconName: string) => {
    const IconComponent =
      (Icons as unknown as Record<string, Icons.LucideIcon>)[iconName] || Icons.HelpCircle;
    return <IconComponent className="h-[18px] w-[18px]" />;
  };

  return (
    <Section id="services" tone="canvas">
      <SectionHeading
        index="02"
        eyebrow="Services"
        title="Everything between an idea and a running product."
        description="We take work end to end — design, build, deploy and maintain. If a project needs something outside this list, ask; we will tell you honestly whether we are the right people for it."
      />

      {/* Hairline grid: 16 items read as one considered table rather than 16 boxes. */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {services.map((svc, idx) => (
          <motion.div
            key={svc.name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: (idx % 4) * 0.05 }}
            className="group flex flex-col bg-surface p-6 transition-colors duration-200 hover:bg-surface-hover"
          >
            <span className="mb-5 flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface-inset text-ink-subtle transition-colors duration-200 group-hover:border-accent-line group-hover:bg-accent-soft group-hover:text-accent">
              {renderIcon(svc.iconName)}
            </span>

            <h3 className="font-display text-[15px] font-bold tracking-tight text-ink">
              {svc.name}
            </h3>

            <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{svc.description}</p>

            <ul className="mt-5 flex flex-col gap-1.5 border-t border-line pt-4">
              {(svc.features || []).slice(0, 3).map((feat: string) => (
                <li
                  key={feat}
                  className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink-subtle"
                >
                  <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {feat}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 rounded-xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">
          Not sure which of these you need? Describe the problem and we will scope it for you.
        </p>
        <Button
          variant="secondary"
          onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Describe your project
        </Button>
      </div>
    </Section>
  );
}
