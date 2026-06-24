'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative min-h-screen pt-40 pb-20 px-4 md:px-8 z-20 flex items-center justify-center">
      <motion.div
        className="text-center max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* 404 Text */}
        <motion.h1
          className="text-9xl md:text-[200px] font-bold text-gradient mb-8 tracking-tighter"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          404
        </motion.h1>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-[0.1em] uppercase">
            Page Not Found
          </h2>
          <p className="text-zinc-400 mb-8 text-base md:text-lg">
            {"The luxury collection you're looking for doesn't exist. Let's get you back on track."}
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link href="/">
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold tracking-widest uppercase rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Home
            </motion.button>
          </Link>

          <Link href="/shop">
            <motion.button
              className="px-8 py-3 border-2 border-cyan-400 text-cyan-400 font-bold tracking-widest uppercase rounded-lg hover:bg-cyan-400/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Now
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="mt-16 space-y-3 text-sm text-zinc-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p>✦ ERROR: COLLECTION NEXUS OFFLINE ✦</p>
Redirecting to Plasma Atelier database...
        </motion.div>
      </motion.div>
    </div>
  );
}