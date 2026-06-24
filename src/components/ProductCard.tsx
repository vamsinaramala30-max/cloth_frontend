'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useWishlistStore } from '@/lib/stores/useWishlistStore';
import { useCartStore } from '@/lib/stores/useCartStore';
import { useToastStore } from '@/lib/stores/useToastStore';
import { getLocalProductImage } from '@/lib/images';

interface ProductCardProps {
  id: string;
  productId?: string;
  slug?: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  hoverImage?: string;
  category: string;
  collection?: string;
  isFeatured?: boolean;
  isVault?: boolean;
  delay?: number;
  sizes?: string[];
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  productId,
  slug,
  name,
  price,
  compareAtPrice,
  image,
  hoverImage,
  category,
  collection,
  isFeatured = false,
  isVault = false,
  delay = 0,
  sizes = [],
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const pid = productId || id;
  const productSlug = slug || id;
  const href = `/products/${productSlug}`;

  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addItem, openDrawer } = useCartStore();
  const { addToast } = useToastStore();

  const inWishlist = isInWishlist(pid);

  const safeImage = imgError ? getLocalProductImage(pid) : (image || getLocalProductImage(pid));
  const safeHoverImage = hoverImage || getLocalProductImage(pid, 1);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: pid,
      productId: pid,
      name,
      price,
      image: safeImage,
      slug: productSlug,
      collection,
    });
    addToast(
      inWishlist ? 'info' : 'success',
      inWishlist ? 'Removed from Wishlist' : 'Added to Wishlist',
      name
    );
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = sizes[0] || 'M';
    addItem({
      id: `${pid}-${defaultSize}-default-${Date.now()}`,
      productId: pid,
      name,
      price,
      image: safeImage,
      size: defaultSize,
      color: 'Default',
      quantity: 1,
      slug: productSlug,
      collection,
    });
    openDrawer();
    addToast('success', 'Added to Bag', name);
  };

  const discount = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group relative"
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <Link href={href}>
          <div className="relative aspect-[3/4] overflow-hidden cursor-pointer">
            {/* Primary Image */}
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: isHovered && safeHoverImage ? 0 : 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={safeImage}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onError={() => setImgError(true)}
              />
            </motion.div>

            {/* Hover Image */}
            {safeHoverImage && (
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={safeHoverImage}
                  alt={`${name} alternate view`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </motion.div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Scale on hover */}
            <motion.div
              className="absolute inset-0"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />

            {/* Badges — top left */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {isVault && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest text-black">
                  ✦ Vault
                </span>
              )}
              {isFeatured && !isVault && (
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-[9px] font-bold uppercase tracking-widest text-white">
                  Featured
                </span>
              )}
              {discount > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-red-500/90 backdrop-blur-sm text-[9px] font-bold uppercase tracking-widest text-white">
                  −{discount}%
                </span>
              )}
            </div>

            {/* Collection badge — top right */}
            {collection && (
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute top-3 right-10 z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="px-2.5 py-1 rounded-full bg-cyan-500/80 backdrop-blur-sm text-[9px] font-semibold uppercase tracking-widest text-white">
                      {collection.replace(/-/g, ' ')}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              className="absolute top-3 right-3 z-10 p-2 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm hover:border-white/50 transition-all"
            >
              <Heart
                className={`h-3.5 w-3.5 transition-colors ${inWishlist ? 'fill-red-400 text-red-400' : 'text-white'}`}
              />
            </button>

            {/* Quick Actions on Hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute bottom-4 left-4 right-4 z-10 flex gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={handleQuickAdd}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-cyan-300 transition-all"
                    aria-label={`Quick add ${name} to cart`}
                  >
                    <ShoppingBag className="h-3 w-3" />
                    Quick Add
                  </button>
                  <Link href={href}>
                    <button
                      className="p-2.5 border border-white/40 bg-black/40 backdrop-blur-sm text-white rounded-xl hover:border-white transition-all"
                      aria-label={`View ${name}`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>

        {/* Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1">{category}</p>

          {/* Name */}
          <Link href={href}>
            <h3 className="text-sm font-medium text-white leading-tight line-clamp-2 hover:text-cyan-300 transition-colors mb-2">
              {name}
            </h3>
          </Link>

          {/* Price Row */}
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold text-sm">${price.toLocaleString()}</span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-zinc-500 text-xs line-through">${compareAtPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
