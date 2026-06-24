'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Grid, LayoutList } from 'lucide-react';
import { COLLECTIONS } from '@/lib/data/collections';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

type ViewMode = 'grid' | 'list';

export default function CollectionsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  return (
    <div className="relative min-h-screen pt-28 pb-24 px-4 md:px-8 z-20">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 mb-4">
            Plasma Atelier
          </p>
          <h1 className="text-5xl md:text-7xl font-light tracking-[0.08em] text-white uppercase mb-5">
            Collections
          </h1>
          <p className="text-sm text-zinc-400 tracking-[0.15em] max-w-lg mx-auto leading-relaxed">
            Eight curated expressions of futuristic luxury — from AI-generated couture to runway masterworks.
          </p>
          <div className="mt-8 w-24 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto" />
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-xs text-zinc-500 uppercase tracking-widest">
            {COLLECTIONS.length} Collections
          </p>
          <div className="flex items-center gap-2 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {COLLECTIONS.map((col) => (
              <motion.div key={col.id} variants={item}>
                <Link href={`/collections/${col.slug}`} aria-label={`View ${col.title} collection`}>
                  <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] hover:border-white/20 transition-all duration-500 cursor-pointer">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={col.image}
                        alt={col.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      {/* Accent Line */}
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${col.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] text-zinc-400 uppercase tracking-widest">
                          {col.itemCount} pieces
                        </span>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
                        </motion.div>
                      </div>
                      <h2 className="text-lg font-light tracking-[0.08em] text-white uppercase group-hover:text-cyan-300 transition-colors">
                        {col.title}
                      </h2>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {col.description}
                      </p>
                    </div>

                    {/* Hover Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${col.accentColor} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none`} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <motion.div
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {COLLECTIONS.map((col, idx) => (
              <motion.div key={col.id} variants={item}>
                <Link href={`/collections/${col.slug}`} aria-label={`View ${col.title} collection`}>
                  <div className="group flex items-center gap-6 p-5 border border-white/[0.08] hover:border-white/20 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 cursor-pointer">
                    {/* Index */}
                    <span className="text-2xl font-light text-zinc-700 w-8 flex-shrink-0 text-right">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    {/* Image Thumbnail */}
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                      <Image src={col.image} alt={col.title} fill className="object-cover" sizes="64px" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-base font-medium tracking-[0.08em] text-white uppercase group-hover:text-cyan-300 transition-colors">
                          {col.title}
                        </h2>
                        <div className={`h-px flex-1 bg-gradient-to-r ${col.accentColor} opacity-20 group-hover:opacity-60 transition-opacity`} />
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-1">{col.description}</p>
                    </div>

                    {/* Piece count */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-light text-white">{col.itemCount}</p>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest">pieces</p>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}