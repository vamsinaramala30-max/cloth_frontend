'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/constants';

export const CircularCategories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

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
    hidden: { opacity: 0, scale: 0 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="relative w-full py-20 px-4 md:px-8 z-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-light tracking-[0.1em] text-white uppercase mb-4">
            Category Nexus
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 tracking-[0.2em]">
            EXPLORE BY COLLECTION TYPE
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {CATEGORIES.map((category) => (
            <motion.div
              key={category.id}
              variants={item}
              onClick={() => setSelectedCategory(category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="relative group cursor-pointer"
            >
              {/* Circular Background */}
              <motion.div
                className={`relative aspect-square rounded-full flex flex-col items-center justify-center transition-all duration-500 border-2 ${
                  selectedCategory === category.id
                    ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/50'
                    : hoveredCategory === category.id
                      ? 'border-purple-400 bg-purple-400/5 shadow-lg shadow-purple-400/30'
                      : 'border-white/20 bg-white/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Glowing Ring Effect */}
                {(selectedCategory === category.id || hoveredCategory === category.id) && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-cyan-400/30"
                    animate={{ scale: [1, 1.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  className="text-4xl md:text-5xl mb-2"
                  animate={
                    hoveredCategory === category.id ? { scale: 1.2, rotate: 10 } : { scale: 1 }
                  }
                  transition={{ duration: 0.3 }}
                >
                  {category.icon}
                </motion.div>

                {/* Label */}
                <motion.p
                  className={`text-xs md:text-sm font-bold tracking-[0.2em] uppercase transition-colors ${
                    selectedCategory === category.id ? 'text-cyan-300' : 'text-white'
                  }`}
                  animate={hoveredCategory === category.id ? { y: -2 } : { y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {category.label}
                </motion.p>
              </motion.div>

              {/* Bottom Accent Line */}
              {selectedCategory === category.id && (
                <motion.div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-cyan-400 to-purple-400"
                  layoutId="activeCategory"
                  transition={{ type: 'spring', damping: 20 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Category Description */}
        {selectedCategory && (
          <motion.div
            className="mt-12 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-center text-sm md:text-base text-zinc-300">
              Browse our curated {CATEGORIES.find((c) => c.id === selectedCategory)?.label} collection
              featuring the latest in futuristic luxury fashion.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
