'use client';

import React, { useEffect, useMemo, useRef } from 'react';

export default function CityLights() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, w);
      canvas.height = Math.max(1, h);
    };

    resize();
    window.addEventListener('resize', resize);

    const lights = Array.from({ length: 260 }).map(() => {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 0.8 + Math.random() * 2.2;
      const hue = Math.random() < 0.5 ? 190 + Math.random() * 40 : 265 + Math.random() * 40;
      const speed = 0.08 + Math.random() * 0.35;
      return { x, y, r, hue, speed, phase: Math.random() * Math.PI * 2 };
    });

    let t0 = performance.now();

    const tick = (t: number) => {
      const dt = t - t0;
      t0 = t;

      ctx.clearRect(0, 0, w, h);

      // subtle scanlines
      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      for (let y = 0; y < h; y += 6) ctx.fillRect(0, y, w, 1);

      for (const l of lights) {
        l.phase += dt * 0.001 * l.speed;
        const twinkle = 0.55 + 0.45 * Math.sin(l.phase);
        const alpha = 0.07 + 0.22 * twinkle;

        const grad = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r * 5);
        grad.addColorStop(0, `hsla(${l.hue}, 95%, 70%, ${alpha})`);
        grad.addColorStop(1, `hsla(${l.hue}, 95%, 70%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(l.x, l.y, l.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Parallax drift
      for (const l of lights) {
        l.x -= 0.015 * dt;
        if (l.x < -50) l.x = w + 50;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[0]"
      style={{ opacity: 0.65, background: 'linear-gradient(135deg,#050505 0%, #0b0b10 55%, #050505 100%)' }}
    />
  );
}

