'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/stores/useCartStore';
import { useToastStore } from '@/lib/stores/useToastStore';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const { addToast } = useToastStore();

  const cartSubtotal = subtotal();
  const tax = Math.round(cartSubtotal * 0.1);
  const shipping = cartSubtotal >= 5000 || cartSubtotal === 0 ? 0 : 150;
  const total = cartSubtotal + tax + shipping;

  const handleRemove = (id: string, name: string) => {
    removeItem(id);
    addToast('info', 'Removed from Bag', name);
  };

  if (items.length === 0) {
    return (
      <div className="relative min-h-screen pt-40 pb-20 px-4 md:px-8 z-20 flex items-center justify-center">
        <EmptyState
          variant="cart"
          title="Your Bag is Empty"
          message="Acquire computational digital couture or browse the archive catalog."
          cta="Explore Catalog"
          href="/products"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20 text-white">
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
                  key={item.id}
                  className="flex gap-6 p-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || '/images/placeholder.webp'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-1 hover:text-cyan-300 transition-colors">
                      <Link href={item.slug ? `/products/${item.slug}` : '/products'}>
                        {item.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-zinc-400 mb-3">
                      {item.color} • Size {item.size}
                    </p>
                    <p className="text-cyan-400 font-bold">${item.price.toLocaleString()}</p>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>

                    <div className="flex items-center gap-2 border border-white/20 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-white hover:bg-white/10 rounded"
                      >
                        −
                      </button>
                      <span className="px-2 text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                <span className="text-white">${cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Tax (10%)</span>
                <span className="text-white">${tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Shipping</span>
                <span className="text-white">
                  {shipping === 0 ? 'Free' : `$${shipping.toLocaleString()}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between mb-8">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-2xl font-bold text-cyan-400">${total.toLocaleString()}</span>
            </div>

            <motion.button
              onClick={() => router.push('/checkout')}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold tracking-widest uppercase rounded-lg mb-4 hover:shadow-lg hover:shadow-cyan-400/50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Checkout
            </motion.button>

            <Link href="/products">
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
              <p>✓ Secured Checkout & Authentication</p>
              <p>✓ Insured Express Logistics</p>
              <p>✓ Free Shipping on Orders $5,000+</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}