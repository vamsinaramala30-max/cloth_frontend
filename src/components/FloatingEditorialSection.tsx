
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IMAGE_MAP } from '../lib/images';
import ManagedImage from './ManagedImage';

import { useAuthStore } from '@/hooks/useAuth';

export const FloatingEditorialSection: React.FC = () => {
  const { user } = useAuthStore();
  if (user) return null;

  return (
    <motion.section
      className="relative z-10 w-full max-w-7xl mx-auto -mt-36 mb-24 px-4 md:px-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
    >
      <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-2xl shadow-2xl shadow-cyan-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,217,255,0.1),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(179,102,255,0.1),_transparent_28%)]" />

        <ManagedImage
          src={IMAGE_MAP.editorial}
          fallbackSrc={IMAGE_MAP.placeholder}
          alt="Plasma Atelier Editorial"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover brightness-75 contrast-125"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-2xl">
          <motion.h2
            className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Digital Couture
          </motion.h2>
          <motion.p
            className="mt-4 text-sm md:text-base text-zinc-300 tracking-widest leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            Experience the intersection of technology and luxury fashion. Our latest collection explores the boundaries of digital craftsmanship and avant-garde design.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
};