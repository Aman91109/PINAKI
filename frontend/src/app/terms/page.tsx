import { Scale } from 'lucide-react';
import LegalPage, { type LegalClause } from '@/components/ui/LegalPage';

const clauses: LegalClause[] = [
  {
    heading: '1. Engagement',
    body: 'Submitting an enquiry or requesting a quote starts a conversation, not a contract. No binding agreement exists until a written scope has been agreed by both you and Pinaki. Quotes issued after a discovery call are valid for 30 days.',
  },
  {
    heading: '2. Scope and changes',
    body: 'Fixed-scope projects are quoted against a written specification agreed before work begins. Work falling outside that specification is re-quoted and requires your approval before we start it — we do not add charges to an invoice without agreeing them first.',
  },
  {
    heading: '3. Design files and drafts',
    body: 'Wireframes, prototypes and design files produced during a project remain our property until the final payment milestone clears, at which point full ownership of those files transfers to you.',
  },
  {
    heading: '4. Source code and ownership',
    body: 'Unless agreed otherwise in writing, projects are built on permissively licensed open-source frameworks. On final payment, the custom source code, design files and infrastructure accounts created for your project are assigned to you in full. We retain no licence over your business logic and do not host your product on our own accounts.',
  },
  {
    heading: '5. Payment',
    body: 'Fixed-scope projects are invoiced against milestones rather than as a single lump sum. Retainers are invoiced monthly in advance and may be cancelled with 30 days notice. Consulting work is invoiced on completion. Late payment may pause active work until settled.',
  },
  {
    heading: '6. Support after launch',
    body: 'Every project includes 30 days of bug fixes at no additional cost, covering defects in work we delivered. New features, third-party changes and content updates fall outside that window and are quoted separately or covered by a retainer.',
  },
  {
    heading: '7. Confidentiality',
    body: 'We treat everything you share about your business as confidential and will sign your NDA on request. We may reference a project in our portfolio only with your permission, and never disclose commercial terms.',
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      icon={Scale}
      title="Terms & Conditions"
      meta="Effective 8 July 2026 — version 1.1"
      clauses={clauses}
    />
  );
}
