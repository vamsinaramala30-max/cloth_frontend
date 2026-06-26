'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ManagedImage from './ManagedImage';
import { useProductStore } from '@/lib/stores/useProductStore';
import Link from 'next/link';

import { useAuthStore } from '@/hooks/useAuth';

export const LuxuryLookbook: React.FC = () => {
  const { collections, isLoadingCollections, fetchCollections } = useProductStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (collections.length === 0 && !isLoadingCollections) {
      fetchCollections();
    }
  }, [collections.length, isLoadingCollections, fetchCollections]);

  if (user) return null;

  const displayCollections = collections.slice(0, 3);

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

        {isLoadingCollections && (
          <div className="grid gap-6 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="relative h-96 w-full animate-pulse rounded-[2rem] bg-white/5 border border-white/10"
              />
            ))}
          </div>
        )}

        {!isLoadingCollections && (
          <div className="grid gap-6 lg:grid-cols-3">
            {displayCollections.map((item, index) => {
              const accentColor = item.color || 'from-cyan-400 to-purple-500';
              return (
                <motion.article
                  key={item.id || item.slug}
                  whileHover={{ y: -12, scale: 1.02 }}
                  transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl shadow-cyan-500/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-96 w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/60" />

                      <ManagedImage
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        priority={index === 0}
                      />

                      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(0,217,255,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(179,102,255,0.18),_transparent_28%)]" />
                    </div>

                    <div className="relative z-10 p-8 md:p-10">
                      <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-cyan-300">
                        {item.productCount || 0} pieces
                      </div>
                      <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-[0.06em] mb-4 uppercase">
                        {item.title}
                      </h3>
                      <p className="text-sm text-zinc-300 leading-relaxed mb-8">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-8 md:p-10 pt-0">
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/collections/${item.slug}`}
                        className={`inline-flex items-center rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.35em] bg-gradient-to-r ${accentColor} text-black font-semibold shadow-lg shadow-cyan-500/20`}
                      >
                        Explore
                      </Link>
                      <span className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-white/80 bg-white/5">
                        AI styling
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
