'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '@/components/ui/Navbar';
import Hero from '@/sections/Hero';
import Work from '@/sections/Work';
import Services from '@/sections/Services';
import Process from '@/sections/Process';
import Team from '@/sections/Team';
import Testimonials from '@/sections/Testimonials';
import Pricing from '@/sections/Pricing';
import FAQ from '@/sections/FAQ';
import BlogSection from '@/sections/BlogSection';
import Contact from '@/sections/Contact';
import Footer from '@/components/ui/Footer';
import PinakiChatbot from '@/components/ui/PinakiChatbot';

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar />

      {/*
        Order is deliberate: proof before pitch. Work sits directly under the
        hero so a visitor sees evidence before being asked to read a service
        list, and pricing sits after the team and testimonials have done the
        credibility work.
      */}
      <main id="main" className="relative">
        <Hero />
        <Work />
        <Services />
        <Process />
        <Team />
        <Testimonials />
        <Pricing />
        <FAQ />
        <BlogSection />
        <Contact />
      </main>

      <Footer />

      <div className="fixed bottom-24 right-6 z-40">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-ink-muted transition-colors hover:border-accent-line hover:text-accent"
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <PinakiChatbot />
    </>
  );
}
