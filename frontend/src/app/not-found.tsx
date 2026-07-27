import { ArrowLeft, Terminal } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Button from '@/components/ui/primitives/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-canvas">
      <Navbar />

      <main className="mx-auto my-auto flex w-full max-w-lg flex-col items-center px-6 py-32 text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg border border-accent-line bg-accent-soft text-accent">
          <Terminal className="h-6 w-6" />
        </div>

        <h1 className="mb-4 font-space text-8xl font-bold tracking-tighter text-ink">404</h1>

        <p className="mb-3 font-space text-base font-semibold uppercase tracking-[0.2em] text-accent">
          Directory node not found
        </p>

        <p className="mb-8 max-w-sm font-poppins text-sm leading-relaxed text-ink-muted">
          The server could not resolve the path you requested. Check the address, or head back to
          the home page.
        </p>

        <Button href="/" size="lg">
          <ArrowLeft className="h-4 w-4" />
          Return to Base Node
        </Button>
      </main>

      <Footer />
    </div>
  );
}
