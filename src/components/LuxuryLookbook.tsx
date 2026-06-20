'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SafeImage from './SafeImage';
import { LOOKBOOK_COLLECTIONS } from '@/lib/constants';

export const LuxuryLookbook: React.FC = () => {
  return (
    <section className="relative w-full px-4 md:px-8 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-300 mb-4">
            Editorial Lookbook
          </p>
          <h2 className="text-4xl md:text-6xl font-light tracking-[0.12em] text-white uppercase leading-tight">
            A digital runway that moves like a luxury film.
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {LOOKBOOK_COLLECTIONS.map((item, index) => (
            <motion.article
              key={item.id}
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl shadow-cyan-500/10"
            >
              <div className="relative h-96 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/60" />

                <SafeImage
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  // Only the first card can be above-the-fold; keep rest lazy for performance.
                  loading={index === 0 ? 'eager' : 'lazy'}
                  priority={index === 0}
                />

                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(0,217,255,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(179,102,255,0.18),_transparent_28%)]" />
              </div>

              <div className="relative z-10 p-8 md:p-10">
                <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-cyan-300">
                  {item.subtitle}
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-[0.06em] mb-4">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed mb-8">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.35em] bg-gradient-to-r ${item.accent} text-black font-semibold shadow-lg shadow-cyan-500/20`}
                  >
                    Explore
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-white/80 bg-white/5">
                    AI styling
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

