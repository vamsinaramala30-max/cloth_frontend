'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const ITEMS = [
  { title: 'Hero showcase', desc: 'Cinematic hero blocks with luxe typography.' },
  { title: 'Featured collections', desc: 'Glass cards, fast filters, premium spacing.' },
  { title: 'Trending products', desc: 'Conversion-ready product grids.' },
  { title: 'Fashion magazine', desc: 'Editorial sections designed for dwell time.' },
  { title: 'AI stylist', desc: 'Personalized styling experiences.' },
];

export default function LuxuryTemplatesRail() {
  const bullets = useMemo(() => ITEMS, []);

  return (
    <section className="relative mt-2">
      <div className="max-w-7xl mx-auto px-0">
        <motion.div
          className="flex items-end justify-between gap-6 mb-8"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-zinc-400">Templates Preview</div>
            <h3 className="mt-3 text-3xl md:text-4xl text-white font-light">Luxury motion, modern structure.</h3>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-1 w-1 rounded-full bg-cyan-300/80" />
              Parallax + glass overlays
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bullets.map((it, idx) => (
            <motion.div
              key={it.title}
              className="rounded-[1.4rem] border border-white/10 bg-black/25 backdrop-blur-xl p-5 overflow-hidden"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.06 }}
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-purple-500/10 blur-2xl" />

              <div className="relative">
                <div className="text-white font-semibold text-lg">{it.title}</div>
                <div className="mt-2 text-zinc-300 text-sm leading-relaxed">{it.desc}</div>

                <div className="mt-5 h-[1px] w-full bg-gradient-to-r from-cyan-300/30 via-purple-300/20 to-transparent" />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.18em] text-zinc-400">RARE RAB IT</span>
                  <span className="inline-flex items-center gap-2 text-xs text-cyan-200">
                    <span className="inline-block h-1 w-1 rounded-full bg-cyan-300/80" />
                    Luxury-ready
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

