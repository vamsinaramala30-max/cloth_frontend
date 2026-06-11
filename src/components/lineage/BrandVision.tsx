'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function BrandVision() {
  return (
    <motion.section
      className="rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
    >
      <p className="text-xs md:text-sm text-purple-300 tracking-[0.28em] uppercase">Brand vision</p>
      <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
        Luxury that feels like technology—quiet, precise, alive
      </h2>
      <p className="mt-4 text-zinc-300/90 leading-relaxed">
        Our vision is a blend of cinematic design and engineering discipline. We build with clarity so you
        can feel the intention in every line, texture, and movement.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4">
        {[
          {
            title: 'Premium Materials Intelligence',
            desc: 'We prioritize breathability, drape behavior, and durability across real conditions.',
          },
          {
            title: 'Design for Long Life',
            desc: 'Finishing and construction choices that keep garments beautiful and resilient.',
          },
          {
            title: 'Responsible Production',
            desc: 'Better sourcing and process decisions to reduce impact—without losing craft.',
          },
        ].map((x) => (
          <div key={x.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-base md:text-lg font-semibold tracking-tight">{x.title}</h3>
            <p className="mt-2 text-sm text-zinc-300/85 leading-relaxed">{x.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          type="button"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-lg"
        >
          Explore the craft
        </button>
      </div>
    </motion.section>
  );
}

