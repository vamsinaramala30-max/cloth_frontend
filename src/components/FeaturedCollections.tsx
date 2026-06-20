'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SafeImage from './SafeImage';

interface FeaturedCollectionsProps {
  collections?: Array<{
    id: number;
    title: string;
    description: string;
    image: string;
    color: string;
  }>;
}

const defaultCollections = [
  {
    id: 1,
    title: 'Neural Silk',
    description: 'AI-Generated Aesthetic',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2070',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 2,
    title: 'Quantum Weave',
    description: 'Futuristic Textiles',
    image: 'https://images.unsplash.com/photo-1552062407-c551eeda4921?q=80&w=2070',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 3,
    title: 'Ethereal Form',
    description: 'Luxury Minimalism',
    image: 'https://images.unsplash.com/photo-1490481651971-daf3dd63d3ff?q=80&w=2070',
    color: 'from-amber-400 to-orange-600',
  },
];

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({
  collections = defaultCollections,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  useEffect(() => {
    if (!autoplay) return;

    timeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % collections.length);
    }, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeIndex, autoplay, collections.length]);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % collections.length);
    setAutoplay(false);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + collections.length) % collections.length);
    setAutoplay(false);
  };

  const active = collections[activeIndex];

  return (
    <section
      id="featured"
      className="relative w-full min-h-screen py-20 md:py-32 px-4 md:px-8 overflow-hidden z-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-[0.1em] text-white uppercase mb-4">
            Featured Collections
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 tracking-[0.2em]">
            CURATED LUXURY EXPERIENCES
          </p>
        </motion.div>

        {/* Featured Carousel */}
        <div className="relative h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="relative aspect-video md:aspect-auto md:h-96 rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8 }}
            >
              {/* Background Image */}
              <SafeImage
                src={active?.image}
                alt={active?.title ?? 'Featured collection'}
                fill
                className="object-cover"
                // Carousel LCP should be limited; only mark the first view as priority.
                priority={activeIndex === 0}
                loading={activeIndex === 0 ? 'eager' : 'lazy'}
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-12">
                <motion.h3
                  className="text-3xl md:text-5xl font-light tracking-[0.08em] text-white uppercase mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {active.title}
                </motion.h3>

                <motion.p
                  className="text-sm md:text-base text-zinc-300 mb-6 tracking-[0.1em]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {active.description}
                </motion.p>

                <motion.button
                  className="px-6 md:px-8 py-2 md:py-3 border border-white text-white text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Collection
                </motion.button>
              </div>

              {/* Glow Border */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-transparent pointer-events-none"
                animate={{
                  borderColor: [
                    'rgba(0, 217, 255, 0.2)',
                    'rgba(179, 102, 255, 0.2)',
                    'rgba(0, 217, 255, 0.2)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            {/* Thumbnails */}
            <div className="flex gap-3 md:gap-4">
              {collections.map((collection, index) => (
                <motion.button
                  key={collection.id}
                  className={`relative w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    activeIndex === index
                      ? 'border-cyan-400'
                      : 'border-white/20'
                  }`}
                  onClick={() => {
                    setActiveIndex(index);
                    setAutoplay(false);
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <SafeImage
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="96px"
                  />
                  {activeIndex === index && (
                    <motion.div
                      className="absolute inset-0 border-2 border-cyan-400"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4">
              <motion.button
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/30 hover:border-cyan-400 flex items-center justify-center text-white hover:text-cyan-400 transition-all duration-300 group"
                onClick={prev}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: 'rgba(0, 217, 255, 0.1)',
                }}
              >
                <span className="text-xl">←</span>
              </motion.button>

              <motion.button
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/30 hover:border-cyan-400 flex items-center justify-center text-white hover:text-cyan-400 transition-all duration-300 group"
                onClick={next}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: 'rgba(0, 217, 255, 0.1)',
                }}
              >
                <span className="text-xl">→</span>
              </motion.button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-1.5 mt-8">
            {collections.map((_, index) => (
              <motion.div
                key={index}
                className="h-1 bg-white/20 rounded-full flex-1"
                animate={{
                  backgroundColor:
                    activeIndex === index ? '#00d9ff' : 'rgba(255, 255, 255, 0.2)',
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

