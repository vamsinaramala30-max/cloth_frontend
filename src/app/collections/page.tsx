'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Grid, LayoutList } from 'lucide-react';
import { useProductStore } from '@/lib/stores/useProductStore';
import { IMAGE_MAP } from '@/lib/images';

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
  const { collections, isLoadingCollections, collectionsError, fetchCollections } = useProductStore();

  useEffect(() => {
    if (collections.length === 0 && !isLoadingCollections) {
      fetchCollections();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayCollections = collections.length > 0 ? collections : [];

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
            Curated expressions of futuristic luxury — from AI-generated couture to runway masterworks.
          </p>
          <div className="mt-8 w-24 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto" />
        </motion.div>

        {/* Error */}
        {collectionsError && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-300">
            {collectionsError}
          </div>
        )}

        {/* Controls */}
        <motion.div
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-xs text-zinc-500 uppercase tracking-widest">
            {isLoadingCollections ? 'Loading…' : `${displayCollections.length} Collections`}
          </p>
          <div className="flex items-center gap-2 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}
              aria-label="List view"
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Loading Skeletons */}
        {isLoadingCollections && (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-2xl bg-white/5 ${viewMode === 'grid' ? 'h-80' : 'h-28'}`}
              />
            ))}
          </div>
        )}

        {/* Grid View */}
        {!isLoadingCollections && viewMode === 'grid' && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {displayCollections.map((collection) => {
              const collectionImage = collection.bannerImage || collection.image || IMAGE_MAP.collection;
              return (
                <motion.div key={collection.id || collection.slug} variants={item} className="group">
                  <Link href={`/collections/${collection.slug}`}>
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-cyan-400/30 transition-all duration-500">
                      <Image
                        src={collectionImage}
                        alt={collection.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 mb-2">
                          {collection.itemCount ?? collection.productCount ?? 0} pieces
                        </p>
                        <h2 className="text-2xl font-light tracking-[0.1em] text-white uppercase mb-2">
                          {collection.title}
                        </h2>
                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {collection.description}
                        </p>
                        <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                          <span className="text-[10px] uppercase tracking-widest text-white">Explore</span>
                          <ArrowRight className="h-3 w-3 text-cyan-400" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* List View */}
        {!isLoadingCollections && viewMode === 'list' && (
          <motion.div
            className="flex flex-col gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {displayCollections.map((collection) => {
              const collectionImage = collection.bannerImage || collection.image || IMAGE_MAP.collection;
              return (
                <motion.div key={collection.id || collection.slug} variants={item}>
                  <Link href={`/collections/${collection.slug}`}>
                    <div className="flex items-center gap-6 p-5 rounded-2xl border border-white/[0.08] hover:border-cyan-400/30 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-400 group">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <Image
                          src={collectionImage}
                          alt={collection.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-cyan-400 mb-1">
                          {collection.itemCount ?? collection.productCount ?? 0} pieces
                        </p>
                        <h2 className="text-lg font-light tracking-[0.08em] text-white uppercase truncate">
                          {collection.title}
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{collection.description}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2 text-zinc-500 group-hover:text-white transition-colors">
                        <span className="text-[10px] uppercase tracking-widest hidden sm:block">View</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoadingCollections && !collectionsError && displayCollections.length === 0 && (
          <div className="text-center py-24">
            <p className="text-zinc-500 text-sm uppercase tracking-widest">No collections found.</p>
            <Link href="/products" className="mt-6 inline-block text-cyan-400 text-xs uppercase tracking-widest hover:text-cyan-300 transition-colors">
              Browse Products →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}