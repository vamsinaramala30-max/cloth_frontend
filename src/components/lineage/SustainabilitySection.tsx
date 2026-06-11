'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function SustainabilitySection() {
  return (
    <motion.section
      className="rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
    >
      <p className="text-xs md:text-sm text-pink-300 tracking-[0.28em] uppercase">Sustainability</p>
      <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">Responsible craft, premium results</h2>
      <p className="mt-4 text-zinc-300/90 leading-relaxed">
        Sustainability should never be an aesthetic. It’s embedded in sourcing decisions, process improvements,
        and the durability of the final garment—so it lasts longer and performs better.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'Longevity First',
            body: 'Construction choices designed for resilience and repeated wear.',
            tag: 'Wear longer',
          },
          {
            title: 'Better Material Choices',
            body: 'Breathability and drape behavior prioritized to reduce waste across production.',
            tag: 'Waste-aware',
          },
          {
            title: 'Smarter Processes',
            body: 'Continuous refinement in finishing and QA to maintain quality with less iteration.',
            tag: 'Efficiency',
          },
        ].map((x) => (
          <div key={x.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-base md:text-lg font-semibold tracking-tight">{x.title}</h3>
            <p className="mt-2 text-sm text-zinc-300/85 leading-relaxed">{x.body}</p>
            <div className="mt-4">
              <span className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] text-xs md:text-sm text-zinc-200/95">
                {x.tag}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="text-sm text-zinc-400">
          This page is designed as a premium brand experience—built with content and UI patterns that can be updated later.
        </div>
        <button
          type="button"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-lg"
        >
          Our standards
        </button>
      </div>
    </motion.section>
  );
}

