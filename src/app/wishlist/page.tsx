'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '@/lib/stores/useWishlistStore';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default function WishlistPage() {
  const { items } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="relative min-h-screen pt-40 pb-20 px-4 md:px-8 z-20 flex items-center justify-center">
        <EmptyState
          variant="wishlist"
          title="Wishlist Empty"
          message="Keep track of pieces you love. Save items to view them here later."
          cta="Browse Catalog"
          href="/products"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20 text-white">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl md:text-6xl font-light tracking-[0.1em] text-white uppercase mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          My Wishlist
        </motion.h1>

        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {items.map((item, index) => (
              <ProductCard
                key={item.productId}
                id={item.productId}
                productId={item.productId}
                slug={item.slug}
                name={item.name}
                price={item.price}
                image={item.image}
                category="Couture"
                collection={item.collection}
                isVault={item.isVault}
                delay={index * 0.05}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}