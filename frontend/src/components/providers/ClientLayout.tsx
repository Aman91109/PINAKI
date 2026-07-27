'use client';

import React, { useState, useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import Preloader from '../ui/Preloader';
import CustomCursor from '../ui/CustomCursor';
import ThreeBackground from '../canvas/ThreeBackground';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <span className="animate-pulse font-mono text-sm tracking-[0.3em] text-ink-subtle">
          BOOTING PINAKI_
        </span>
      </div>
    );
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }}
    >
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* WebGL particle field, behind everything */}
      <div className="pointer-events-none fixed inset-0 -z-50 h-screen w-screen">
        <ThreeBackground />
      </div>

      <CustomCursor />

      <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </ReactLenis>
  );
}
