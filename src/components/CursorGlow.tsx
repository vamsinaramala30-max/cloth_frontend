'use client';

import { useEffect, useState } from 'react';

export const CursorGlow: React.FC = () => {

  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Animate the glow element opacity via a CSS-safe transform/opacity animation.
    // Avoid framer-motion's removed `animate` export.
    const target = document.querySelector('#cursor-glow') as HTMLElement | null;
    if (target) {
      // useAnimate is not available here without refs; fallback to CSS animation.
      target.style.animation = 'cursorGlowPulse 1.2s ease-in-out infinite';
    }


    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none">
      <div
        id="cursor-glow"
        className={`fixed z-50 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl transition-transform duration-200 ${
          isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-30'
        }`}
        style={{ left: `${position.x - 96}px`, top: `${position.y - 96}px` }}
      />
      <div
        className="fixed z-50 h-10 w-10 rounded-full bg-white/10 border border-white/20 shadow-[0_0_40px_rgba(0,217,255,0.5)] pointer-events-none"
        style={{ left: `${position.x - 20}px`, top: `${position.y - 20}px` }}
      />
    </div>
  );
};
