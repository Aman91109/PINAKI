import { Scale } from 'lucide-react';
import LegalPage, { type LegalClause } from '@/components/ui/LegalPage';

const clauses: LegalClause[] = [
  {
    heading: '1. Agreement of Engagements',
    body: 'By submitting a project inquiry or selecting one of our pricing tiers (Starter, Professional, Enterprise), you agree to initiate a project discussion. No binding code development contracts are established until a scope specification agreement has been co-signed by both the client and a representative of Pinaki Labs.',
  },
  {
    heading: '2. Figma Designs & Wireframes',
    body: 'Elena Rostova manages all project user journey blueprints and Figma prototypes. All draft wireframes delivered during the design phase remain the property of Pinaki Labs until full payment milestones are completed, upon which full Figma file ownership transitions to the client.',
  },
  {
    heading: '3. Source Code Licenses',
    body: 'Unless agreed otherwise in writing, we build systems using MIT-compatible next-generation frameworks (Next.js, Express, React, Mongoose). Upon final deployment hand-off (Vercel deployment triggers, Render server maps, Atlas collection seeds), the custom source code license is fully assigned to the client.',
  },
  {
    heading: '4. Maintenance Commitments',
    body: 'Starter plans include 3 months support, Professional includes 6 months support, and Enterprise packages offer customizable support matrices. Maintenance support includes library security patches, API endpoint diagnostics, and database query tuning. Any changes to layout shapes or database schemas are subject to incremental hourly coding estimates.',
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      icon={Scale}
      title="Terms & Conditions"
      meta="Effective date: July 8, 2026 — Version 1.0.0"
      clauses={clauses}
    />
  );
}
