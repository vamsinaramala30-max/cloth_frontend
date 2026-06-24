'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldAlert, Eye, ShoppingBag } from 'lucide-react';
import { VAULT_PRODUCTS } from '@/lib/data/products';
import { useCartStore } from '@/lib/stores/useCartStore';
import { useToastStore } from '@/lib/stores/useToastStore';
import { getLocalProductImage } from '@/lib/images';

// Simple countdown timer component
const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Generate a fixed target time in the future for simulation
    const target = new Date();
    target.setHours(target.getHours() + 14);
    target.setMinutes(target.getMinutes() + 32);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      const hrs = Math.floor(difference / (1000 * 60 * 60));
      const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours: hrs, minutes: mins, seconds: secs });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-2 text-center text-xs font-mono tracking-widest text-amber-400">
      <div className="bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded">
        {String(timeLeft.hours).padStart(2, '0')}h
      </div>
      <div>:</div>
      <div className="bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded">
        {String(timeLeft.minutes).padStart(2, '0')}m
      </div>
      <div>:</div>
      <div className="bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded">
        {String(timeLeft.seconds).padStart(2, '0')}s
      </div>
    </div>
  );
};

export default function VaultPage() {
  const { addItem, openDrawer } = useCartStore();
  const { addToast } = useToastStore();

  const handleQuickAdd = (product: typeof VAULT_PRODUCTS[0]) => {
    addItem({
      id: `${product.id}-M-default-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || getLocalProductImage(product.id),
      size: 'M',
      color: 'Default',
      quantity: 1,
      slug: product.slug,
      collection: product.collection,
    });
    openDrawer();
    addToast('success', 'Vault Access Granted', product.name);
  };

  return (
    <div className="relative min-h-screen pt-28 pb-24 px-4 md:px-8 z-20 text-white overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Editorial Hero */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-b from-amber-950/20 via-black/40 to-black p-8 md:p-16 mb-16 text-center backdrop-blur-md">
          {/* Glassmorphic border glow line */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0 h-px" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-400 text-[9px] font-black uppercase tracking-[0.25em] mb-6">
              <ShieldAlert className="h-3 w-3" /> Secure Access Only
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-[0.1em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 mb-6">
              Plasma Vault
            </h1>

            <p className="text-sm md:text-base text-zinc-400 tracking-[0.15em] max-w-xl mx-auto leading-relaxed mb-8">
              Extremely rare digital couture and physical runway archive pieces. Produced in single-digit quantities. Once exhausted, they will never be reproduced.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-xs text-zinc-500 uppercase tracking-widest">Next Release In:</span>
              <CountdownTimer />
            </div>
          </motion.div>
        </div>

        {/* Vault Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {VAULT_PRODUCTS.map((product, index) => {
            const isSoldOut = (product.inventory || 0) <= 0;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative rounded-2xl border border-white/[0.08] hover:border-amber-500/30 bg-black/60 backdrop-blur-md overflow-hidden flex flex-col md:flex-row transition-all duration-500"
              >
                {/* Image */}
                <div className="relative w-full md:w-1/2 aspect-[4/5] md:aspect-auto overflow-hidden">
                  <Image
                    src={product.images[0] || getLocalProductImage(product.id)}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/10 to-transparent" />
                  
                  {/* Rare indicator */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest">
                      Rare — {product.inventory} Unit{product.inventory !== 1 ? 's' : ''} Left
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-amber-400 uppercase tracking-widest font-bold">
                      {product.category}
                    </span>
                    <h2 className="text-xl md:text-2xl font-light uppercase tracking-wider text-white mt-2 group-hover:text-amber-300 transition-colors">
                      {product.name}
                    </h2>
                    <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest">
                      SKU: {product.sku}
                    </p>
                    <p className="text-zinc-400 text-xs mt-4 leading-relaxed font-light line-clamp-3">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-white">${product.price.toLocaleString()}</span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-zinc-600 line-through">
                          ${product.compareAtPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Link href={`/vault/${product.slug}`} className="flex-1">
                        <button className="w-full flex items-center justify-center gap-2 py-3 border border-white/20 hover:border-amber-400/50 hover:text-amber-400 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all">
                          <Eye className="h-4 w-4" /> View Details
                        </button>
                      </Link>
                      <button
                        onClick={() => handleQuickAdd(product)}
                        disabled={isSoldOut}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs uppercase tracking-widest font-black transition-all ${
                          isSoldOut
                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                            : 'bg-amber-400 text-black hover:bg-amber-300'
                        }`}
                      >
                        <ShoppingBag className="h-4 w-4" /> {isSoldOut ? 'Sold Out' : 'Acquire'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
