'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from './GlassCard';

export const CampaignVideoSection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden py-24 md:py-32 px-4 md:px-8">
      <div className="absolute inset-0 bg-black/85" />
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-in-a-studio-5436-large.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/50 to-transparent" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto grid gap-10 lg:grid-cols-[1.3fr_0.9fr] items-center">
        <div className="space-y-6 md:space-y-10">
          <motion.span
            className="inline-flex px-4 py-2 rounded-full border border-white/15 bg-white/5 text-[10px] tracking-[0.4em] text-cyan-300 uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Campaign Premiere
          </motion.span>

          <motion.h2
            className="text-4xl md:text-6xl xl:text-7xl font-extralight uppercase tracking-[0.15em] text-white leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            The future of fashion moves in motion.
          </motion.h2>

          <motion.p
            className="max-w-2xl text-sm md:text-base text-zinc-300 tracking-[0.18em] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
          >
            Discover an editorial campaign built for immersive storytelling, dynamic luxury gradients,
            and high-fashion motion blur transitions that feel cinematic and alive.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
          >
            <Link href="/shop">
              <motion.div
                className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold text-xs uppercase tracking-[0.3em] shadow-2xl shadow-cyan-500/20 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore the Runway
              </motion.div>
            </Link>
            <motion.a
              href="#"
              className="text-xs uppercase tracking-[0.35em] text-white/80 hover:text-white"
              whileHover={{ x: 4 }}
            >
              Watch full campaign
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          className="relative rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-cyan-500/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/10 blur-3xl" />
          <div className="relative p-8 md:p-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">High Fashion Motion</p>
                <h3 className="mt-3 text-2xl md:text-4xl font-semibold text-white tracking-[0.05em]">
                  Editorial Motion Suite
                </h3>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-400 shadow-xl shadow-cyan-500/30 flex items-center justify-center text-white text-sm uppercase tracking-[0.25em]">
                AI
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <GlassCard className="p-6 bg-black/40 border-white/10" glow="purple" hover={false}>
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-300">Dynamic float</p>
                <p className="mt-3 text-lg text-white font-semibold">Fabric waves & motion blur</p>
              </GlassCard>
              <GlassCard className="p-6 bg-black/40 border-white/10" glow="cyan" hover={false}>
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-300">Cinematic lighting</p>
                <p className="mt-3 text-lg text-white font-semibold">Glow contours with subtle parallax</p>
              </GlassCard>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl p-6 bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.4em] text-cyan-300">Editor’s Pick</p>
                <p className="mt-3 text-sm text-zinc-300">
                  A campaign designed for editorial impact—layers, gradients, and motion.
                </p>
              </div>
              <div className="rounded-3xl p-6 bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.4em] text-purple-300">Limited Drop</p>
                <p className="mt-3 text-sm text-zinc-300">
                  Activate premium release moments with glowing product spotlights.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
