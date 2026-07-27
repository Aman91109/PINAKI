'use client';

import React from 'react';
import { ReactLenis } from 'lenis/react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

/**
 * Smooth-scroll wrapper.
 *
 * The fake boot-sequence preloader, the custom cursor and the WebGL particle
 * field were removed: each delayed or degraded the first impression on a site
 * whose pitch is that it builds fast software.
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
