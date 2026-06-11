'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SearchBar } from './SearchBar';
import SafeImage from './SafeImage';

export const HeroSection: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 18,
        y: (e.clientY / window.innerHeight - 0.5) * 18,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,217,255,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(179,102,255,0.18),_transparent_28%)]" />

      <SafeImage
        src="/images/vk/editorial-background.webp"
        alt="Editorial background"
        fill
        className="object-cover"
        priority
      />

      <motion.div
        className="absolute inset-0 z-0"
        style={{
          filter: 'brightness(0.45) contrast(1.15) grayscale(20%)',
          transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 90 }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/90" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="space-y-8">
          <motion.span
            className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-[10px] uppercase tracking-[0.45em] text-cyan-300 shadow-lg shadow-cyan-500/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-cyan-300 animate-ping" />
            2026 Editorial Release
          </motion.span>

          <motion.h1
            className="text-5xl md:text-7xl xl:text-8xl font-extralight uppercase tracking-[0.12em] text-white leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Futuristic fashion where
            <span className="block font-black bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent mt-3">
              motion meets luxury.
            </span>
          </motion.h1>

          <motion.p
            className="max-w-xl text-sm md:text-base text-zinc-300 tracking-[0.18em] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
          >
            Explore an ultra-premium editorial experience with floating glass layers, dynamic lighting,
            fabric-inspired motion, and AI-driven product storytelling.
          </motion.p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/shop">
              <motion.div
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-10 py-4 text-xs uppercase tracking-[0.35em] text-black shadow-2xl shadow-cyan-500/20 hover:scale-[1.02] transition-transform duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Enter the vault
              </motion.div>
            </Link>
            <a href="#featured" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/80 hover:text-white transition-colors">
              <span className="text-cyan-300">→</span>
              See latest drops
            </a>
          </div>

          <motion.div
            className="mt-6 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
          >
            <SearchBar />
          </motion.div>
        </div>

        <div className="relative hidden lg:block">
          <motion.div
            className="relative mx-auto w-full max-w-xl h-[520px] rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl shadow-cyan-500/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,217,255,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(179,102,255,0.15),_transparent_30%)]" />
            <div className="absolute inset-0">
              <SafeImage
                src="image/backimg.jpeg"
                alt="Editorial preview"
                fill
                className="object-cover mix-blend-screen opacity-80"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
            <div className="absolute left-8 top-8 w-24 h-24 rounded-3xl border border-white/10 bg-white/10 blur-2xl" />
            <div className="absolute right-10 bottom-16 w-32 h-32 rounded-full bg-purple-400/10 blur-3xl" />
            <div className="absolute inset-x-10 bottom-12 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300">Editorial Motion</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Fluid silk structures with soft cinematic glow.</h3>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute left-6 top-1/2 h-[280px] w-[1px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
        animate={{ y: [0, 18, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute right-16 bottom-8 w-16 h-16 rounded-full bg-cyan-400/20 blur-3xl"
        animate={{ x: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </section>
  );
};
