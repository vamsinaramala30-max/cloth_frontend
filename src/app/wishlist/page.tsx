'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '@/lib/stores/useWishlistStore';
import { useAuthStore } from '@/hooks/useAuth';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';

export default function WishlistPage() {
  const { items, syncFromBackend, isLoading } = useWishlistStore();
  const { user } = useAuthStore();

  // Sync wishlist from backend for authenticated users
  useEffect(() => {
    if (user) {
      syncFromBackend();
    }
  }, [user, syncFromBackend]);

  if (!isLoading && items.length === 0) {
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
          {items.length > 0 && (
            <span className="ml-4 text-2xl text-zinc-500 font-light">({items.length})</span>
          )}
        </motion.h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
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
                  category="Wishlist"
                  collection={item.collection}
                  isVault={item.isVault}
                  delay={index * 0.1}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}