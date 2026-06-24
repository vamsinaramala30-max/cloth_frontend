'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/lib/stores/useCartStore';
import { getLocalProductImage } from '@/lib/images';

export function CartDrawer() {
  const { items, isOpen, closeDrawer, removeItem, updateQuantity, itemCount, subtotal } =
    useCartStore();

  const count = itemCount();
  const total = subtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[120] w-full max-w-md flex flex-col border-l border-white/10 bg-black/90 backdrop-blur-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-cyan-400" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                  Shopping Bag
                </h2>
                {count > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-black">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={closeDrawer}
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingBag className="h-12 w-12 text-zinc-700 mb-4" />
                  <p className="text-zinc-400 text-sm">Your bag is empty</p>
                  <Link href="/collections" onClick={closeDrawer}>
                    <button className="mt-6 px-6 py-2 border border-white/20 text-white text-xs uppercase tracking-widest rounded-lg hover:border-white/50 transition-all">
                      Browse Collections
                    </button>
                  </Link>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                        <Image
                          src={item.image || getLocalProductImage(item.productId)}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                          onError={() => {}}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white leading-tight line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-zinc-500 mb-2">
                          {item.color && `${item.color} · `}Size {item.size}
                        </p>
                        <p className="text-cyan-400 font-bold text-sm">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>

                        {/* Quantity */}
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex items-center gap-1 border border-white/20 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-white text-xs w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-zinc-600 hover:text-red-400 transition-colors"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400 uppercase tracking-widest">Subtotal</span>
                  <span className="text-xl font-bold text-white">${total.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-zinc-500">Taxes and shipping calculated at checkout.</p>

                <Link href="/cart" onClick={closeDrawer}>
                  <motion.button
                    className="w-full py-3.5 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:border-white/50 transition-all mb-2"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    View Full Cart
                  </motion.button>
                </Link>

                <Link href="/checkout" onClick={closeDrawer}>
                  <motion.button
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-purple-500 text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-cyan-400/20 transition-all"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Checkout
                  </motion.button>
                </Link>

                <div className="flex items-center justify-center gap-6 text-[10px] text-zinc-600">
                  <span>✓ Secure</span>
                  <span>✓ 30-Day Returns</span>
                  <span>✓ Free Shipping $5k+</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
