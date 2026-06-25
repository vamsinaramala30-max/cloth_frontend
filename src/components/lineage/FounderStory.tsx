'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function FounderStory() {
  return (
    <motion.section
      className="rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
    >
      <p className="text-xs md:text-sm text-cyan-300 tracking-[0.28em] uppercase">Founder story</p>
      <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">A vision built to outlast trends</h2>
      <p className="mt-4 text-zinc-300/90 leading-relaxed">
        Plasma Atelier was created with one idea: luxury should feel intentional. Every collection begins with
        a story—then becomes a system of craft. From fabric behavior to finishing details, our founder
        designed for longevity first.
      </p>

      <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { k: 'Design Ethos', v: 'Minimal impact, maximum presence' },
          { k: 'Materials', v: 'Drape, breathability, resilience' },
          { k: 'Finish', v: 'Precision that stays beautiful' },
        ].map((x) => (
          <div key={x.k} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm font-semibold tracking-tight">{x.k}</p>
            <p className="mt-2 text-sm text-zinc-300/85 leading-relaxed">{x.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <span className="px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-200 text-xs md:text-sm">
          Premium craft
        </span>
        <span className="px-4 py-2 rounded-full bg-purple-400/10 border border-purple-400/30 text-purple-200 text-xs md:text-sm">
          Sustainable mindset
        </span>
        <span className="px-4 py-2 rounded-full bg-pink-400/10 border border-pink-400/30 text-pink-200 text-xs md:text-sm">
          Future-forward design
        </span>
      </div>
    </motion.section>
  );
}

