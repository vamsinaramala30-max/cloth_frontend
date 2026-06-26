'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Search, Package } from 'lucide-react';

type EmptyStateVariant = 'cart' | 'wishlist' | 'search' | 'products' | 'orders' | 'custom';

const presets: Record<EmptyStateVariant, { icon: React.ElementType; title: string; message: string; cta: string; href: string }> = {
  cart: {
    icon: ShoppingBag,
    title: 'Your Bag is Empty',
    message: 'Explore our collections to find your next favourite piece.',
    cta: 'Browse Collections',
    href: '/collections',
  },
  wishlist: {
    icon: Heart,
    title: 'Your Wishlist is Empty',
    message: 'Save pieces you love. They\'ll appear here.',
    cta: 'Start Browsing',
    href: '/collections',
  },
  search: {
    icon: Search,
    title: 'No Results Found',
    message: 'Try a different search term or browse our collections.',
    cta: 'Browse Collections',
    href: '/collections',
  },
  products: {
    icon: Package,
    title: 'No Products Yet',
    message: 'This collection is being curated. Check back soon.',
    cta: 'View All Collections',
    href: '/collections',
  },
  orders: {
    icon: Package,
    title: 'No Orders Yet',
    message: 'Your order history will appear here after your first purchase.',
    cta: 'Start Shopping',
    href: '/collections',
  },
  custom: {
    icon: Package,
    title: 'Nothing Here Yet',
    message: 'Check back later.',
    cta: 'Go Home',
    href: '/',
  },
};

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  icon?: React.ElementType;
  title?: string;
  message?: string;
  cta?: string;
  href?: string;
  actionLabel?: string;
  onAction?: () => void;
  // onClick is an alias for onAction (kept for call-site compatibility)
  onClick?: () => void;
}

export function EmptyState({
  variant = 'custom',
  icon,
  title,
  message,
  cta,
  href,
  actionLabel,
  onAction,
  onClick,
}: EmptyStateProps) {
  const resolvedAction = onAction || onClick;
  const preset = presets[variant];
  const Icon = icon || preset.icon;
  const displayTitle = title || preset.title;
  const displayMessage = message || preset.message;
  const displayCta = cta || preset.cta;
  const displayHref = href || preset.href;

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-24 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm flex items-center justify-center">
          <Icon className="h-10 w-10 text-zinc-500" />
        </div>
        <div className="absolute inset-0 rounded-full bg-cyan-400/5 blur-2xl" />
      </div>

      <h2 className="text-2xl font-light tracking-[0.1em] text-white uppercase mb-3">
        {displayTitle}
      </h2>
      <p className="text-sm text-zinc-400 max-w-xs leading-relaxed mb-8">
        {displayMessage}
      </p>

      {resolvedAction ? (
        <motion.button
          onClick={resolvedAction}
          className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold tracking-widest uppercase rounded-xl text-sm hover:shadow-lg hover:shadow-cyan-400/20 transition-all"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {actionLabel || displayCta}
        </motion.button>
      ) : (
        <Link href={displayHref}>
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold tracking-widest uppercase rounded-xl text-sm hover:shadow-lg hover:shadow-cyan-400/20 transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {displayCta}
          </motion.button>
        </Link>
      )}
    </motion.div>
  );
}
