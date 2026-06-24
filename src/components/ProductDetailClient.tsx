'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import RobustImage from './RobustImage';



import { Product } from '@/lib/api';
import { useCartActions } from '@/hooks/useCartActions';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuthStore } from '@/hooks/useAuth';

interface ProductDetailClientProps {
  product: Product;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.size ?? 'M');
  const [selectedColor, setSelectedColor] = useState(product.variants?.[0]?.colorName ?? 'Classic');
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCartActions();

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuthStore();
  const isWishlisted = isInWishlist(product._id);

  const images = useMemo(() => {
    const imageList = product.variants?.flatMap((variant) => variant.images || []) ?? [];
    return Array.from(new Set(imageList)).slice(0, 4);
  }, [product.variants]);

  const sizes = useMemo(
    () => Array.from(new Set(product.variants?.map((variant) => variant.size) ?? [])).sort(),
    [product.variants]
  );

  const colors = useMemo(
    () => Array.from(new Set(product.variants?.map((variant) => variant.colorName) ?? [])),
    [product.variants]
  );

  const handleAddToCart = async () => {
    if (!user) {
      // In a real app, you'd want to show a modal or redirect to login
      console.log('User not logged in, redirecting to login');
      window.location.href = '/login';
      return;
    }

    const variant = product.variants?.find((v) => v.size === selectedSize && v.colorName === selectedColor);
    if (!variant) {
      console.error('Variant not found');
      return;
    }

    const success = await addToCart(product._id, variant.sku, quantity, selectedSize, selectedColor);
    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      // In a real app, you'd want to show a modal or redirect to login
      console.log('User not logged in, redirecting to login');
      window.location.href = '/login';
      return;
    }

    if (isWishlisted) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  const displayPrice = product.salePrice ?? product.basePrice;
  const rating = product.averageRating || 0;
  const totalReviews = product.reviews?.length ?? 0;

  return (
    <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-8 text-xs text-zinc-500 tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="hover:text-white transition-colors">
            HOME
          </Link>{' '}
          / <Link href="/shop" className="hover:text-white transition-colors">
            SHOP
          </Link>{' '}
          / <span className="text-white">{product.name.toUpperCase()}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 mb-6">
              <RobustImage
                src={images[0]}
                fallbackSrc={'/images/placeholder.webp'}
                alt={product.name}
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-500"
                loading="eager"
                sizes="100vw"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:border-cyan-400 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  <RobustImage src={img} alt={`View ${index + 1}`} fill className="object-cover" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-light tracking-[0.1em] text-white uppercase mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < Math.floor(rating) ? 'text-cyan-400' : 'text-zinc-600'}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-zinc-400">
                  {rating.toFixed(1)} ({totalReviews} reviews)
                </span>
              </div>
              <p className="text-3xl font-bold text-cyan-400">${displayPrice.toLocaleString()}</p>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed">{product.description}</p>

            <div>
              <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-4">
                Size
              </label>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <motion.button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg font-medium text-sm transition-all ${
                      selectedSize === size
                        ? 'bg-cyan-500 text-black border-2 border-cyan-400'
                        : 'border-2 border-white/20 text-white hover:border-white/40'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-4">
                Color
              </label>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <motion.button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                      selectedColor === color
                        ? 'border-cyan-400 bg-cyan-400/10 text-white'
                        : 'border-white/20 text-zinc-300 hover:border-white/40 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {color}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-4 border border-white/20 rounded-lg p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-white hover:bg-white/10 rounded"
                >
                  −
                </button>
                <span className="px-4 text-white font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-white hover:bg-white/10 rounded"
                >
                  +
                </button>
              </div>

              <motion.button
                onClick={handleAddToCart}
                className={`flex-1 px-8 py-3 font-bold tracking-widest uppercase rounded-lg transition-all ${
                  isAdded
                    ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                    : 'bg-gradient-to-r from-cyan-400 to-purple-400 text-black hover:shadow-lg hover:shadow-cyan-400/50'
                }`}
                whileHover={!isAdded ? { scale: 1.02 } : {}}
                whileTap={!isAdded ? { scale: 0.98 } : {}}
              >
                {isAdded ? '✓ Added' : 'Add to Bag'}
              </motion.button>

              <motion.button
                onClick={handleWishlist}
                className={`px-6 py-3 border-2 rounded-lg font-bold transition-all ${
                  isWishlisted
                    ? 'border-red-500 text-red-400 bg-red-500/10'
                    : 'border-white/20 text-white hover:border-white/40'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isWishlisted ? '❤' : '♡'}
              </motion.button>
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-4">
                Highlights
              </h3>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>Category: {product.category}</li>
                <li>Collections: {product.collections.join(', ') || 'Standard'}</li>
                <li>Availability: {product.isActive ? 'In Stock' : 'Unavailable'}</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};