'use client';

import React, { useState, useEffect } from 'react';
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
  'SYSTEM READY. ENJOY PINAKI.'
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Increment progress counter
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(onComplete, 800); // Wait for exit animations
          }, 400);
          return 100;
        }
        // Random step increments for realistic loading
        const step = Math.floor(Math.random() * 8) + 3;
        return Math.min(prev + step, 100);
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    // Cycle log text based on progress intervals
    const chunk = Math.floor(100 / statusLogs.length);
    const index = Math.min(Math.floor(progress / chunk), statusLogs.length - 1);
    setLogIndex(index);
  }, [progress]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -100,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#050816] p-8 md:p-16 select-none overflow-hidden"
        >
          {/* Header Tag */}
          <div className="flex justify-between items-start font-mono text-[10px] md:text-xs text-[#8B5CF6]/60 tracking-wider">
            <div>PINAKI LABS // CORE_VER_2.6</div>
            <div>[ STATUS: CALIBRATING ]</div>
          </div>

          {/* Main Visual Center: Giant counter and loading bar */}
          <div className="flex flex-col items-center justify-center my-auto relative">
            {/* Ambient Purple Backdrop Glow */}
            <div className="absolute w-[300px] h-[300px] rounded-full bg-[#8B5CF6]/10 blur-[120px] pointer-events-none -z-10" />
            
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-8xl md:text-[12rem] font-bold font-space text-white tracking-tighter"
            >
              {progress.toString().padStart(3, '0')}
            </motion.h1>

            {/* Solid Progress Bar */}
            <div className="w-full max-w-lg h-[2px] bg-[#1E293B] relative overflow-hidden rounded-full mt-4">
              <motion.div
                className="absolute top-0 left-0 h-full bg-[#06B6D4] shadow-[0_0_8px_#06B6D4]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Footer status log stream */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end font-mono text-[11px] md:text-xs tracking-widest text-[#EDEDED] gap-4">
            <div className="flex flex-col">
              <span className="text-[#8B5CF6]/50 mb-1">SYSTEM ACTIVITY_</span>
              <motion.span
                key={logIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#06B6D4]"
              >
                &gt; {statusLogs[logIndex]}
              </motion.span>
            </div>

            <div className="text-right md:w-48 text-[#EDEDED]/40">
              EST. TIME: {(0.01 * (100 - progress)).toFixed(2)}s
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
