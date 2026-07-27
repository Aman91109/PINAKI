'use client';

import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalized position relative to center of the card
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;
    
    // Limit rotation angle (max 10 degrees)
    const rotateX = (-y / (height / 2)) * 10;
    const rotateY = (x / (width / 2)) * 10;
    
    setRotate({ x: rotateX, y: rotateY });
    
    // Set mouse glow light position (percentage coordinates)
    const glowX = ((e.clientX - rect.left) / width) * 100;
    const glowY = ((e.clientY - rect.top) / height) * 100;
    setGlow({ x: glowX, y: glowY, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlow((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      className={`relative rounded-2xl glass-card select-none overflow-hidden ${className}`}
    >
      {/* Interactive Neon Spotlight Overlay */}
      <div
        style={{
          backgroundColor: 'rgba(6, 182, 212, 0.08)',
          opacity: glow.opacity,
          transition: 'opacity 0.3s ease',
        }}
        className="absolute inset-0 pointer-events-none z-10"
      />
      {children}
    </div>
  );
}
