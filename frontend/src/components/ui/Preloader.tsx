'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

const statusLogs = [
  'INITIALIZING SYSTEM LOGS...',
  'CONNECTING PINAKI SUITE...',
  'LOADING GEOMETRIC SHADER MATRICES...',
  'SEEDING MOCK DATA TABLES...',
  'BOOTING THREE.JS WebGL CANVAS...',
  'SYNCHRONIZING GSAP TIMELINES...',
  'SYSTEM READY. ENJOY PINAKI.',
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(onComplete, 800);
          }, 400);
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 3;
        return Math.min(prev + step, 100);
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onComplete]);

  const logIndex = Math.min(
    Math.floor(progress / Math.floor(100 / statusLogs.length)),
    statusLogs.length - 1
  );

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -100, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[9999] flex select-none flex-col justify-between overflow-hidden bg-canvas p-8 md:p-16"
        >
          <div className="flex items-start justify-between font-mono text-[10px] tracking-wider text-ink-subtle md:text-xs">
            <span>PINAKI LABS / CORE_VER_2.6</span>
            <span>[ STATUS: CALIBRATING ]</span>
          </div>

          <div className="relative my-auto flex flex-col items-center justify-center">
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="font-space text-8xl font-bold tracking-tighter text-ink md:text-[12rem]"
            >
              {progress.toString().padStart(3, '0')}
            </motion.span>

            <div className="mt-4 h-0.5 w-full max-w-lg overflow-hidden rounded-full bg-line">
              <div
                className="h-full bg-accent transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 font-mono text-[11px] tracking-widest md:flex-row md:items-end md:text-xs">
            <div className="flex flex-col">
              <span className="mb-1 text-ink-subtle">SYSTEM ACTIVITY_</span>
              <motion.span
                key={logIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-accent"
              >
                &gt; {statusLogs[logIndex]}
              </motion.span>
            </div>

            <span className="text-right text-ink-subtle md:w-48">
              EST. TIME: {(0.01 * (100 - progress)).toFixed(2)}s
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
