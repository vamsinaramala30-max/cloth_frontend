'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';


export const HeroSection: React.FC = () => {
  return (
    <header className="relative w-full h-screen overflow-hidden flex items-center justify-center text-center text-white">

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-8 flex flex-col items-center">
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter !leading-[1.1] text-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        >
          The Future of Fabric
        </motion.h1>

        <motion.p
          className="mt-6 max-w-xl text-sm md:text-base text-zinc-300 tracking-widest leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
        >
          Explore AI-generated textiles and digital couture. A new era of luxury fashion, crafted for the modern visionary.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: 'easeOut' }}
        >
          <Link href="/products" passHref>
            <motion.button
              className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold tracking-widest uppercase text-sm rounded-full hover:bg-opacity-90 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Collection
            </motion.button>
          </Link>
          <Link href="/magazine" passHref>
            <motion.button
              className="w-full sm:w-auto px-10 py-4 border border-white/20 bg-white/5 backdrop-blur-md text-white font-medium tracking-widest uppercase text-sm rounded-full hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Read Editorial
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5, ease: 'easeOut' }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </header>
  );
};