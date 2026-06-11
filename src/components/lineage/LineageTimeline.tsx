'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

const ITEMS: TimelineItem[] = [
  {
    year: '01',
    title: 'The First Sketch',
    description:
      'A digital atelier begins: silhouettes defined by movement, fabric behavior, and the quiet confidence of restraint.',
  },
  {
    year: '02',
    title: 'Craft Partnering',
    description:
      'A curated network of makers—focused on longevity, precision, and finishing that feels effortless.',
  },
  {
    year: '03',
    title: 'Material Intelligence',
    description:
      'Fabric is treated as a system: breathability, drape, and resilience mapped across real-world conditions.',
  },
  {
    year: '04',
    title: 'Cut & Construction',
    description:
      'Pattern engineering meets hands-on control—every seam placement intentional, every edge refined.',
  },
  {
    year: '05',
    title: 'A Responsible Future',
    description:
      'Sourcing and process improvements designed to reduce impact without compromising premium feel.',
  },
];

export function LineageTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);

  const active = ITEMS[activeIndex];
  const accent = useMemo(() => {
    const map = ['text-cyan-400', 'text-purple-400', 'text-pink-400', 'text-cyan-300', 'text-purple-300'];
    return map[activeIndex % map.length];
  }, [activeIndex]);

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-10 left-1/3 w-[360px] h-[360px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 md:p-6">
            <p className="text-xs md:text-sm text-cyan-300 tracking-[0.28em] uppercase">Interactive Timeline</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
              <span className={accent}>{active.year}</span> — {active.title}
            </h2>
            <p className="mt-4 text-zinc-300/90 leading-relaxed">{active.description}</p>

            <div className="mt-6 flex gap-3">
              {ITEMS.map((it, idx) => (
                <button
                  key={it.year}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={
                    'h-2.5 w-2.5 rounded-full transition-all ' +
                    (idx === activeIndex ? 'bg-cyan-400 scale-125' : 'bg-white/25 hover:bg-white/40')
                  }
                  aria-label={`Timeline step ${it.year}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative pl-6 md:pl-10">
            <div className="absolute left-2 md:left-3 top-2 bottom-2 w-px bg-white/10" />

            <div className="space-y-5">
              {ITEMS.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <motion.button
                    key={item.year}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={
                      'w-full text-left rounded-2xl p-4 border transition-all ' +
                      (isActive
                        ? 'border-cyan-400/40 bg-cyan-400/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20')
                    }
                    initial={false}
                    animate={isActive ? { boxShadow: '0 0 30px rgba(0,217,255,0.12)' } : { boxShadow: 'none' }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div
                          className={
                            'h-10 w-10 rounded-full flex items-center justify-center border ' +
                            (isActive ? 'border-cyan-400/60 bg-cyan-400/20 text-cyan-200' : 'border-white/10 bg-white/5 text-white/70')
                          }
                        >
                          <span className="text-sm font-semibold">{item.year}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-semibold tracking-tight">{item.title}</h3>
                        <p className="mt-1 text-sm md:text-[15px] text-zinc-300/85">{item.description}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

