import type { Metadata } from 'next';
import { ArrowLeft, Mail } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Button from '@/components/ui/primitives/Button';
import { CONTACT } from '@/content/site';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-canvas">
      <Navbar />

      <main className="mx-auto my-auto flex w-full max-w-xl flex-col items-start px-6 py-40">
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
          Error 404
        </span>

        <h1 className="mt-5 font-display text-5xl font-bold tracking-tighter text-ink md:text-7xl">
          This page doesn&apos;t exist.
        </h1>

        <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted">
          The link is either broken or the page has moved. Nothing you did wrong.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/" size="lg">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>
          <Button href={`mailto:${CONTACT.email}`} variant="secondary" size="lg">
            <Mail className="h-4 w-4" />
            Report a broken link
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
