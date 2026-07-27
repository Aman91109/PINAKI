'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const HOVER_SELECTOR = 'a, button, [role="button"], input, textarea, select';

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [supported, setSupported] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorXSpring = useSpring(cursorX, { damping: 40, stiffness: 350, mass: 0.5 });
  const cursorYSpring = useSpring(cursorY, { damping: 40, stiffness: 350, mass: 0.5 });

  // Only render for precise pointers — on touch it is dead weight.
  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setSupported(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!supported) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setVisible(true);
      // Cheaper and more reliable than attaching listeners to every element.
      setHovered(Boolean((e.target as Element | null)?.closest?.(HOVER_SELECTOR)));
    };

    const hide = () => setVisible(false);
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', hide);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', hide);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [supported, cursorX, cursorY]);

  if (!supported || !visible) return null;

  return (
    <>
      {/* Core dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-1.5 w-1.5 rounded-full bg-accent"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      />

      {/* Trailing ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border border-line-strong"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: hovered ? 44 : 26,
          height: hovered ? 44 : 26,
          borderColor: hovered ? 'var(--color-accent)' : 'var(--color-line-strong)',
          scale: pressed ? 0.85 : 1,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      />
    </>
  );
}
