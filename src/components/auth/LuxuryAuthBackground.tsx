'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mql) return;

    const update = () => setReduced(Boolean(mql.matches));
    update();

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', update);
      return () => mql.removeEventListener('change', update);
    }

    // Safari fallback
    mql.addListener(update);
    return () => mql.removeListener(update);
  }, []);

  return reduced;
}


type Blob = {
  id: string;
  x: number; // percent
  y: number; // percent
  size: number; // px
  hue: number;
  duration: number;
  delay: number;
};

export const LuxuryAuthBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const reducedMotion = usePrefersReducedMotion();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  const blobs: Blob[] = useMemo(
    () => [
      { id: 'b1', x: 15, y: 25, size: 420, hue: 190, duration: 22, delay: 0 },
      { id: 'b2', x: 78, y: 18, size: 520, hue: 270, duration: 28, delay: 2 },
      { id: 'b3', x: 60, y: 72, size: 460, hue: 35, duration: 26, delay: 1.5 },
    ],
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = reducedMotion;

    const particles = new Array(70).fill(0).map((_, i) => {
      const t = (i / 70) * Math.PI * 2;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 0.6 + Math.random() * 1.6,
        vx: (Math.cos(t) * 0.08 + (Math.random() - 0.5) * 0.05) * (reduce ? 0.25 : 1),
        vy: (Math.sin(t) * 0.08 + (Math.random() - 0.5) * 0.05) * (reduce ? 0.25 : 1),
        a: 0.15 + Math.random() * 0.35,
      };
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    setReady(true);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // subtle noise-like dots + drift
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle = `rgba(190, 255, 255, ${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // soft glow vignette
      const g = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.35,
        0,
        canvas.width * 0.5,
        canvas.height * 0.35,
        Math.max(canvas.width, canvas.height)
      );
      g.addColorStop(0, 'rgba(80, 200, 255, 0.08)');
      g.addColorStop(0.5, 'rgba(170, 120, 255, 0.05)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      rafRef.current = window.requestAnimationFrame(draw);
    };

    rafRef.current = window.requestAnimationFrame(draw);

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Base */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(0,217,255,0.10),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(179,102,255,0.10),transparent_55%),radial-gradient(900px_circle_at_55%_80%,rgba(255,215,0,0.08),transparent_55%),linear-gradient(180deg,#07070a 0%,#020204 100%)]" />

      {/* Blobs */}
      {!reducedMotion &&
        blobs.map((b) => (
          <motion.div
            key={b.id}
            className="absolute rounded-full blur-3xl opacity-70"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.size,
              height: b.size,
              background: `radial-gradient(circle at 30% 30%, hsla(${b.hue}, 95%, 70%, 0.55), transparent 60%)`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ x: 0, y: 0, scale: 1, filter: 'blur(30px)' }}
            animate={{
              x: [0, (b.id === 'b1' ? -35 : b.id === 'b2' ? 45 : 25), 0],
              y: [0, (b.id === 'b1' ? 25 : b.id === 'b2' ? -30 : -25), 0],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: b.duration, ease: 'easeInOut', delay: b.delay, repeat: Infinity }}
          />
        ))}

      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden />

      {/* Soft mesh */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
          opacity: 0.25,
          mixBlendMode: 'screen',
          filter: 'blur(0.2px)',
        }}
      />

      {/* Ready indicator for very early hydration */}
      {!ready ? <div className="absolute inset-0 bg-black/20" /> : null}
      {children}
    </div>
  );
};


