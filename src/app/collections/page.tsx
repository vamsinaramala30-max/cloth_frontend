'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchFilters } from '@/lib/api';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<string[]>([
    'Neural Silk',
    'Quantum Weave',
    'Ethereal Form',
    'Digital Thread',
  ]);

  useEffect(() => {
    const load = async () => {
      const response = await fetchFilters();
      setCollections(response.data?.data.collections ?? collections);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-light tracking-[0.1em] text-white uppercase mb-4">
            Collections
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 tracking-[0.2em]">
            EXPLORE OUR CURATED LUXURY COLLECTIONS
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {collections.map((collection) => (
            <motion.div
              key={collection}
              variants={item}
              className="group rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl"
              whileHover={{ y: -5 }}
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={`https://images.unsplash.com/photo-1503342394128-c104cbb9810d?q=80&w=2070&auto=format&fit=crop&crop=entropy&sat=-30&exp=15&blend=000000&blend-mode=multiply`}
                  alt={collection}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-light tracking-[0.1em] text-white uppercase mb-4">
                  {collection}
                </h3>
                <p className="text-sm text-zinc-300 mb-6 tracking-[0.05em]">
                  Dynamic collection pulled from the backend filters API.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 uppercase tracking-[0.2em]">Live selection</span>
                  <span className="text-cyan-400 text-sm">Explore →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

