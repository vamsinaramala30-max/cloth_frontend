'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { IMAGE_MAP } from '../lib/images';

export const ProductSpotlight: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - rect.left - rect.width / 2;
    const dy = event.clientY - rect.top - rect.height / 2;
    x.set(dx);
    y.set(dy);
  };

  return (
    <section className="relative w-full py-24 md:py-32 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/80" />
      <div className="absolute -left-24 top-20 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-0 top-1/3 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-20 max-w-7xl mx-auto grid gap-10 xl:grid-cols-[1fr_0.95fr] items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-white/80 shadow-lg shadow-cyan-500/10">
            <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            Spotlight Capsule
          </div>

          <h2 className="text-4xl md:text-6xl font-extralight uppercase tracking-[0.12em] text-white leading-tight">
            Interactive 3D product showcase
          </h2>

          <p className="max-w-xl text-sm md:text-base leading-relaxed text-zinc-300 tracking-[0.18em]">
            Experience a dynamic product spotlight with glowing floating cards, fabric-inspired motion,
            and soft cinematic lighting that brings the piece to life.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
              <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300">Fabric Motion</p>
              <p className="mt-3 text-sm text-white/80">Liquid textures imitate silk drape and motion.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
              <p className="text-[10px] uppercase tracking-[0.35em] text-purple-300">Luxury Glow</p>
              <p className="mt-3 text-sm text-white/80">Soft ambient lighting highlights every contour.</p>
            </div>
          </div>

          <Link href="/products">
            <motion.div
              className="inline-flex items-center gap-3 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-7 py-3 text-xs uppercase tracking-[0.3em] text-cyan-200 hover:bg-cyan-400/20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Collection
              <span className="text-white">→</span>
            </motion.div>
          </Link>
        </div>

        <div className="relative group">
          <motion.div
            className="relative w-full h-[420px] rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-cyan-500/10"
            style={{ rotateX, rotateY, perspective: 1200 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              x.set(0);
              y.set(0);
            }}
            onMouseEnter={() => setHovered(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-purple-500/10" />
            <div className="absolute -left-16 top-16 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute right-8 bottom-8 w-36 h-36 rounded-full bg-purple-400/10 blur-2xl" />

            <motion.div
              className="absolute inset-0"
              animate={hovered ? { opacity: 0.2, scale: 1.02 } : { opacity: 0.1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,217,255,0.3),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(179,102,255,0.2),_transparent_30%)]" />
            </motion.div>

            <div className="relative z-10 flex h-full items-center justify-center px-8">
              <div className="relative w-full max-w-xl h-80 rounded-[1.8rem] overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-black/20 shadow-inner shadow-black/20">
                <Image
                  src={IMAGE_MAP.runway}
                  alt="Featured Piece"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="absolute inset-0 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                <div className="absolute left-6 bottom-6 z-20 rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300">Limited runway</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">Runway Capsule</h3>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -left-8 top-6 w-32 h-32 rounded-full border border-cyan-300/20 bg-cyan-300/10 blur-2xl"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-6 bottom-6 w-28 h-28 rounded-full border border-purple-300/20 bg-purple-300/10 blur-2xl"
            animate={{ x: [0, 14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </section>
  );
};
