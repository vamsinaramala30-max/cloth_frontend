'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { getCartLines, removeCartLine, setCartLineQuantity } from '@/lib/services/cartService';

type CartViewItem = {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
};

export default function CartPage() {
  const [items, setItems] = React.useState<CartViewItem[]>([]);
  const [isCheckout, setIsCheckout] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const lines = await getCartLines();
        if (mounted) setItems(lines);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : 'Failed to load cart');
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const shipping = 100;
  const total = subtotal + tax + shipping;

  const removeItem = async (itemId: string) => {
    // Optimistic UI
    setItems((prev) => prev.filter((item) => item._id !== itemId));
    try {
      await removeCartLine(itemId);
    } catch (e) {
      // Re-sync on failure
      const lines = await getCartLines().catch(() => []);
      setItems(lines);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    // Optimistic UI
    setItems((prev) => prev.map((item) => (item._id === itemId ? { ...item, quantity } : item)));
    try {
      await setCartLineQuantity(itemId, quantity);
    } catch {
      const lines = await getCartLines().catch(() => []);
      setItems(lines);
    }
  };


  if (items.length === 0 && !isCheckout) {
    return (
      <div className="relative min-h-screen pt-40 pb-20 px-4 md:px-8 z-20 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-light text-white mb-6 tracking-[0.1em] uppercase">
            Your Bag is Empty
          </h1>
          <p className="text-zinc-400 mb-8">Explore our collections to find your next favorite
            piece</p>
          <Link href="/shop">
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold tracking-widest uppercase rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Shopping
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.h1
          className="text-4xl md:text-6xl font-light tracking-[0.1em] text-white uppercase mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Shopping Bag
        </motion.h1>

        {/* Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, staggerChildren: 0.1 }}
            >
              {items.map((item, index) => (
                <motion.div
                  key={item._id}

                  className="flex gap-6 p-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image || '/images/vk/placeholder.txt'} alt={item.name} fill className="object-cover" />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-1">{item.name}</h3>
                    <p className="text-sm text-zinc-400 mb-3">
                      {item.color} • Size {item.size}
                    </p>
                    <p className="text-cyan-400 font-bold">${item.price.toLocaleString()}</p>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <motion.button
                      onClick={() => removeItem(item._id)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Remove
                    </motion.button>

                    <div className="flex items-center gap-2 border border-white/20 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-2 py-1 text-white hover:bg-white/10 rounded"
                      >
                        −
                      </button>
                      <span className="px-2 text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-2 py-1 text-white hover:bg-white/10 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            className="h-fit p-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm sticky top-40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-white mb-6 tracking-[0.1em]">ORDER SUMMARY</h3>

            <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-white">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Tax (10%)</span>
                <span className="text-white">${tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Shipping</span>
                <span className="text-white">${shipping}</span>
              </div>
            </div>

            <div className="flex justify-between mb-8">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-2xl font-bold text-cyan-400">${total.toLocaleString()}</span>
            </div>

            <motion.button
              onClick={() => setIsCheckout(true)}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold tracking-widest uppercase rounded-lg mb-4 hover:shadow-lg hover:shadow-cyan-400/50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Checkout
            </motion.button>

            <Link href="/shop">
              <motion.button
                className="w-full px-6 py-3 border border-white/30 text-white font-bold tracking-widest uppercase rounded-lg hover:border-white/60 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue Shopping
              </motion.button>
            </Link>

            {/* Trust Badges */}
            <div className="mt-8 space-y-2 text-[10px] text-zinc-500 text-center">
              <p>✓ Secure Checkout</p>
              <p>✓ 30-Day Returns</p>
              <p>✓ Free Shipping on $5000+</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
