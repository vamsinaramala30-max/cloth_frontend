'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    title: 'Design & Pattern Engineering',
    body: 'Patterns are engineered to match movement. Every curve and seam placement is tested for fit and comfort.',
    accent: 'cyan',
  },
  {
    title: 'Cutting with Precision',
    body: 'Materials are cut with discipline—reducing waste while maintaining the exact shape the design demands.',
    accent: 'purple',
  },
  {
    title: 'Construction & Finishing',
    body: 'Hands-on control during construction ensures strength and longevity. Finishing completes the premium feel.',
    accent: 'pink',
  },
  {
    title: 'Quality Assurance',
    body: 'Garments are checked across detail, drape, and consistency—so each piece meets the same premium standard.',
    accent: 'cyan',
  },
];

function AccentClass(accent: string) {
  switch (accent) {
    case 'purple':
      return 'text-purple-300';
    case 'pink':
      return 'text-pink-300';
    default:
      return 'text-cyan-300';
  }
}

export function ManufacturingJourney() {
  const [idx, setIdx] = useState(1);
  const active = STEPS[idx];
  const accent = useMemo(() => AccentClass(active.accent), [active.accent]);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8">
      <div className="flex flex-col lg:flex-row lg:items-start gap-8">
        <div className="w-full lg:w-[360px]">
          <p className="text-xs md:text-sm text-cyan-300 tracking-[0.28em] uppercase">Manufacturing journey</p>
          <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">From concept to couture-quality</h2>
          <p className="mt-4 text-zinc-300/90 leading-relaxed">
            An interactive look at how we build premium garments with consistency, discipline, and respect for materials.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {STEPS.map((s, i) => {
              const isActive = i === idx;
              return (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={
                    'text-left rounded-2xl border p-4 transition-all ' +
                    (isActive
                      ? 'border-cyan-400/40 bg-white/[0.05] shadow-[0_0_24px_rgba(0,217,255,0.08)]'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20')
                  }
                >
                  <div className="text-sm font-semibold tracking-tight">{String(i + 1).padStart(2, '0')}</div>
                  <div className="mt-2 text-sm text-zinc-300/90 leading-relaxed">{s.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-7"
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl" />
              <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-purple-500/10 blur-3xl" />
            </div>

            <p className="text-xs md:text-sm tracking-[0.28em] uppercase">Step {String(idx + 1).padStart(2, '0')}</p>
            <h3 className={'mt-2 text-2xl md:text-3xl font-semibold tracking-tight ' + accent}>{active.title}</h3>
            <p className="mt-4 text-zinc-300/90 leading-relaxed">{active.body}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              {['Premium precision', 'Fit confidence', 'Consistent finishing'].map((t) => (
                <span
                  key={t}
                  className="px-4 py-2 rounded-full text-xs md:text-sm border border-white/10 bg-white/[0.02] text-zinc-200/95"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="mt-6">
            <div className="h-px w-full bg-white/10" />
            <div className="mt-5 text-sm text-zinc-400">
              Premium is a process, not a promise—each stage is designed to keep the final garment consistent and refined.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

