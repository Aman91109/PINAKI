'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Badge, Card, Section, SectionHeading } from '@/components/ui/primitives';
import { API_BASE_URL } from '@/config';

// Fallback services if API is offline
const fallbackServices = [
  { name: 'Website Development', description: 'Custom, blazing-fast, and secure website development using Next.js & React.', iconName: 'Layout', features: ['Responsive Design', 'Next.js & React', 'SEO Friendly', 'High Performance'] },
  { name: 'Landing Pages', description: 'Conversion-optimized landing pages that turn traffic into leads and customers.', iconName: 'Compass', features: ['Clear CTAs', 'A/B Tested Layouts', 'Super Fast Load', 'Analytics Integrated'] },
  { name: 'Business Websites', description: 'High-end websites that establish trust and command market authority.', iconName: 'Building', features: ['Corporate Design', 'CMS Integration', 'Secure Hosting', 'Lead Capturing'] },
  { name: 'Portfolio Websites', description: 'Premium showcase portfolios featuring modern animations and refined layout systems.', iconName: 'Briefcase', features: ['Cinematic Effects', 'Dark/Light Theme', 'Custom Curators', 'Smooth Scroll'] },
  { name: 'E-Commerce', description: 'Fully featured shopping experiences with custom checkouts, subscriptions, and panel boards.', iconName: 'ShoppingBag', features: ['Stripe Integration', 'Order Dashboards', 'Infinite Products', 'Inventory Control'] },
  { name: 'AI Chatbots', description: 'Intelligent, automated agents using ChatGPT / Claude APIs to engage visitors 24/7.', iconName: 'MessageSquareCode', features: ['Context Retention', 'API Integrations', 'Custom Embeds', 'Human Handover'] },
  { name: 'Machine Learning', description: 'Advanced ML modeling, data analytics, predictive regression, and segmentation systems.', iconName: 'Cpu', features: ['Python & PyTorch', 'Data Pipeline Dev', 'Model Optimization', 'Custom APIs'] },
  { name: 'Deep Learning', description: 'Complex neural networks for vision classification, text analysis, and NLP workloads.', iconName: 'Brain', features: ['CNNs & RNNs', 'Image Processing', 'Transformers Dev', 'High Accuracy Models'] },
  { name: 'Python Automation', description: 'Custom web scrapers, data entry bots, reports automation, and workflow scripts.', iconName: 'Terminal', features: ['Web Scraping', 'Zapier Automation', 'API Syncs', 'Custom Cron Jobs'] },
  { name: 'API Development', description: 'Robust, fast, and scalable Node/Express REST & GraphQL endpoints with authentication.', iconName: 'Share2', features: ['JWT & OAuth', 'API Documentation', 'Rate Limiting', 'Highly Extensible'] },
  { name: 'Dashboard Development', description: 'Aesthetic, interactive monitoring consoles showcasing leads, analytics, and CRM charts.', iconName: 'PieChart', features: ['Recharts Visuals', 'Real-time Feeds', 'Export Options', 'Custom Access Level'] },
  { name: 'UI/UX Design', description: 'Premium digital designs mapped in Figma utilizing futuristic Awwwards-style standards.', iconName: 'Layers', features: ['Figma Prototypes', 'User Journey Mapping', 'High-Fidelity Mockups', 'Component Libraries'] },
  { name: 'Graphic Design', description: 'High-end branding, custom vectors, promotional material, and corporate logos.', iconName: 'Palette', features: ['Vector Graphics', 'Branding Booklets', 'Digital Artwork', 'Social Kits'] },
  { name: 'SEO Optimization', description: 'Rigorous keyword research, speed auditing, and schema mappings to reach Page 1.', iconName: 'Search', features: ['Site Audit', 'Schema Mappings', 'PageSpeed Boost', 'Keyword Rank Tracking'] },
  { name: 'Hosting & Deployment', description: 'Vercel, Render, AWS, or Docker setup with CI/CD triggers and automated backups.', iconName: 'Cloud', features: ['GitHub Actions', 'Zero Downtime', 'SSL Certificate Config', 'Scalable Cluster Setup'] },
  { name: 'Maintenance', description: 'Round-the-clock support, dependency patches, speed audits, and content updates.', iconName: 'ShieldAlert', features: ['Daily Backups', 'Package Audits', 'Bug Resolutions', '24x7 Monitor Alerts'] },
];

export default function Services() {
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/services`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setServices(data.data);
        }
      } catch {
        console.warn('Could not connect to services API. Using local fallbacks.');
      }
    };
    fetchServices();
  }, []);

  const renderIcon = (iconName: string) => {
    const IconComponent =
      (Icons as unknown as Record<string, Icons.LucideIcon>)[iconName] || Icons.HelpCircle;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <Section id="services" tone="raised">
      <SectionHeading eyebrow="Capabilities" title="Next-Gen Services We Deliver" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((svc, idx) => (
          <motion.div
            key={svc.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: (idx % 4) * 0.08 }}
            className="h-full"
          >
            <Card interactive className="flex h-full flex-col justify-between">
              <div>
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg border border-accent-line bg-accent-soft text-accent">
                  {renderIcon(svc.iconName)}
                </div>
                <h3 className="mb-2 font-space text-base font-bold tracking-wide text-ink">
                  {svc.name}
                </h3>
                <p className="mb-4 font-poppins text-xs leading-relaxed text-ink-muted">
                  {svc.description}
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-1.5 border-t border-line pt-4">
                {(svc.features || []).slice(0, 3).map((feat: string) => (
                  <Badge key={feat} tone="accent">
                    {feat}
                  </Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
