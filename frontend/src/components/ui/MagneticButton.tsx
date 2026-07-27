'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  /** How far the element is pulled toward the cursor, as a fraction of the offset. */
  strength?: number;
}

/**
 * Pulls its child slightly toward the cursor. Reserved for hero-level CTAs —
 * applying it to navigation makes targets feel evasive.
 *
 * No-ops for coarse pointers and for users who prefer reduced motion.
 */
export default function MagneticButton({
  children,
  className,
  strength = 0.25,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)');
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setPosition({
      x: (e.clientX - (left + width / 2)) * strength,
      y: (e.clientY - (top + height / 2)) * strength,
    });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.2 }}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.div>
  );
}
