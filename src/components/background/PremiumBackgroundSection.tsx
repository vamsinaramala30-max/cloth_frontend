'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SafeImage from '@/components/SafeImage';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const set = () => setReduced(!!mq.matches);
    set();
    // Safari compatibility
    const anyMq = mq as any;
    if (anyMq.addEventListener) {
      mq.addEventListener('change', set);
      return () => mq.removeEventListener('change', set);
    }
    mq.addListener(set);
    return () => mq.removeListener(set);
  }, []);

  return reduced;
}


type PremiumBackgroundSectionProps = {
  className?: string;
  backgroundImageSrc: string;
  backgroundAlt?: string;
  overlayClassName?: string;
  parallax?: boolean;
  parallaxStrength?: number; // px
  floating?: boolean;
  children: React.ReactNode;
};

export default function PremiumBackgroundSection({
  className,
  backgroundImageSrc,
  backgroundAlt = 'Premium background',
  overlayClassName,
  parallax = true,
  parallaxStrength = 18,
  floating = true,
  children,
}: PremiumBackgroundSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const ref = useRef<HTMLDivElement | null>(null);

  const [visible, setVisible] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const rafRef = useRef<number | null>(null);
  const latestY = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!parallax || prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      if (rafRef.current != null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const rect = el.getBoundingClientRect();
        // When section is in view, translate based on distance from center.
        const viewportH = window.innerHeight || 1;
        const center = rect.top + rect.height / 2;
        const norm = (center - viewportH / 2) / viewportH; // ~[-0.5..0.5]

        latestY.current = -norm * parallaxStrength;
        setParallaxY(latestY.current);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [parallax, parallaxStrength, prefersReducedMotion]);

  const floaters = useMemo(() => {
    if (!floating) return null;
    const items = [0, 1, 2, 3, 4].map((i) => {
      const size = [56, 84, 64, 92, 74][i];
      const left = ["10%", "25%", "55%", "78%", "88%"][i];
      const top = ["12%", "32%", "20%", "46%", "64%"][i];
      const delay = i * 0.6;
      const duration = [6, 8, 7, 10, 9][i];
      const opacity = [0.25, 0.18, 0.22, 0.14, 0.2][i];
      return { size, left, top, delay, duration, opacity, i };
    });
    return items;
  }, [floating]);

  return (
    <section
      ref={ref}
      className={`relative w-full overflow-hidden ${className ?? ''}`}
    >
      {/* Background image layer */}
      <div className="absolute inset-0 z-0">
        <SafeImage
          src={backgroundImageSrc}
          alt={backgroundAlt}
          fill
          className="object-cover w-full h-full opacity-50 will-change-transform"
          loading="lazy"
          sizes="100vw"
        />

        {/* Parallax transform (GPU transform only) */}
        {parallax && !prefersReducedMotion ? (
          <motion.div
            className="absolute inset-0"
            style={{ transform: `translate3d(0, ${parallaxY}px, 0)` }}
          />
        ) : null}

        {/* Readability overlay */}
        <div
          className={
            overlayClassName ??
            'absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/80'
          }
        />
      </div>

      {/* Floating decorative elements */}
      {floaters ? (
        <div className="absolute inset-0 pointer-events-none z-1">
          {floaters.map((f) => (
            <motion.div
              key={f.i}
              className="absolute rounded-full bg-cyan-300/20 blur-2xl"
              style={{ width: f.size, height: f.size, left: f.left, top: f.top, opacity: f.opacity }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: [0, -18, 0], opacity: 1 }}
              transition={{ duration: f.duration, repeat: Infinity, ease: 'easeInOut', delay: f.delay }}
            />
          ))}
        </div>
      ) : null}

      {/* Content */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 14 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </section>
  );
}

