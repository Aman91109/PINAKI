import { Shield } from 'lucide-react';
import LegalPage, { type LegalClause } from '@/components/ui/LegalPage';

const clauses: LegalClause[] = [
  {
    heading: '1. Data Nodes Collected',
    body: 'Pinaki Labs collects name, email address, phone, and company name when you voluntarily request project proposals through our contact interfaces or subscribe to our monthly insights letter. If you upload file attachments (like spec PDFs or wireframe images), they are processed using secure uploader pipelines.',
  },
  {
    heading: '2. Processing & Utilization',
    body: 'We process lead requests strictly to verify budget tiers, arrange scheduled discovery calls, formulate design drafts, and coordinate code engineering agreements. Subscriber details are utilized solely to deliver insights newsletters. We do not distribute database records to third-party ad entities.',
  },
  {
    heading: '3. Security Verification Logs',
    body: 'Our administration panels utilize JSON Web Tokens (JWT) mapped over secure cookies. Passwords are saved utilizing 10-round bcrypt encryption salts. Access level logs are restricted strictly to verified agency developers.',
  },
  {
    heading: '4. Cloud Storage Pipelines',
    body: 'Image assets and file uploads are hosted on secure Cloudinary CDN structures or stored on encrypted local disk arrays. We retain data records only as long as required to coordinate developer agreements.',
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      icon={Shield}
      title="Privacy Policy"
      meta="Last modified: July 8, 2026 — Version 1.0.0"
      clauses={clauses}
    />
  );
}
