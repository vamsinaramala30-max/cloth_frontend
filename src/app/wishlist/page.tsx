'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { useWishlist } from '@/hooks/useWishlist';

import { fetchProducts } from '@/lib/api';

export default function WishlistPage() {
  const { fetchWishlist, wishlistItems, removeFromWishlist, isInWishlist, isLoading } = useWishlist();
  const [products, setProducts] = React.useState<any[]>([]);

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Backend returns populated wishlist items, but the current hook only stores IDs.
      // Additive workaround: fetch recent product list and rely on overlap; if your backend
      // returns populated products in a later hook revision, this can be simplified.
      if (!wishlistItems.length) {
        if (!cancelled) setProducts([]);
        return;
      }

      // Fetch a large batch and filter by wishlist ids.
      // Keeps this page functional without changing existing hooks.
      const resp = await fetchProducts({ limit: 60, page: 1 });
      const list = (resp as any).data?.data ?? (resp as any).data ?? [];
      const byId = new Set(wishlistItems);
      const filtered = (list || []).filter((p: any) => byId.has(p._id));

      if (!cancelled) setProducts(filtered);
    })();

    return () => {
      cancelled = true;
    };
  }, [wishlistItems]);

  const hasWishlist = wishlistItems.length > 0;

  const itemsView = useMemo(() => {
    return (products || []).map((p: any) => ({
      id: p._id,
      name: p.name,
      price: p.salePrice ?? p.basePrice,
      image: p.variants?.[0]?.images?.[0] ?? '/images/vk/placeholder.txt',
    }));
  }, [products]);

  if (!hasWishlist && !isLoading) {
    return (
      <div className="relative min-h-screen pt-40 pb-20 px-4 md:px-8 z-20 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-light text-white mb-6 tracking-[0.1em] uppercase">Wishlist Empty</h1>
          <p className="text-zinc-400 mb-8">Save pieces you love. They’ll appear here.</p>
          <Link href="/shop">
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold tracking-widest uppercase rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Shop
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl md:text-6xl font-light tracking-[0.1em] text-white uppercase mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Wishlist
        </motion.h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {itemsView.length === 0 && isLoading ? (
            <div className="col-span-full text-zinc-400">Loading...</div>
          ) : null}

          {itemsView.map((item: any, idx: number) => (
            <motion.div
              key={item.id}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>

              <h3 className="mt-4 text-sm font-medium text-white truncate">{item.name}</h3>
              <p className="text-cyan-400 font-bold">${Number(item.price).toLocaleString()}</p>

              <div className="mt-4 flex gap-2">
                <Link href={`/product/${item.id}`} className="flex-1">
                  <button className="w-full px-3 py-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold tracking-widest uppercase rounded-lg text-[11px]">
                    View
                  </button>
                </Link>

                <button
                  className="px-3 py-2 border border-white/20 text-white rounded-lg hover:border-white/40 transition-all"
                  onClick={async () => {
                    await removeFromWishlist(item.id);
                  }}
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

