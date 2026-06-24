'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShieldCheck, Heart, ShoppingBag, Truck, RotateCcw, AlertTriangle } from 'lucide-react';
import { getProductBySlug } from '@/lib/data/products';
import { useCartStore } from '@/lib/stores/useCartStore';
import { useWishlistStore } from '@/lib/stores/useWishlistStore';
import { useToastStore } from '@/lib/stores/useToastStore';
import { getLocalProductImage } from '@/lib/images';

interface VaultProductPageProps {
  params: {
    slug: string;
  };
}

export default function VaultProductDetailPage({ params }: VaultProductPageProps) {
  const product = getProductBySlug(params.slug);

  // If not found or is not a vault product, show 404
  if (!product || !product.isVault) {
    notFound();
  }

  const { addItem, openDrawer } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Default');
  const quantity = 1;
  const [isZoomed, setIsZoomed] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const images = useMemo(() => {
    if (product.gallery && product.gallery.length > 0) return product.gallery;
    if (product.images && product.images.length > 0) return product.images;
    return [getLocalProductImage(product.id)];
  }, [product]);

  const handleAddToBag = () => {
    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
      slug: product.slug,
      collection: product.collection,
    });
    openDrawer();
    addToast('success', 'Acquisition Added', product.name);
  };

  const handleWishlist = () => {
    toggleItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      slug: product.slug,
      collection: product.collection,
    });
    addToast(
      inWishlist ? 'info' : 'success',
      inWishlist ? 'Removed from Wishlist' : 'Added to Wishlist',
      product.name
    );
  };

  const isSoldOut = (product.inventory || 0) <= 0;

  return (
    <div className="relative min-h-screen pt-24 pb-24 px-4 md:px-8 z-20 text-white">
      {/* Background glow */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/vault" className="hover:text-amber-400 transition-colors">Vault</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Image Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-amber-500/20 bg-black/40 cursor-zoom-in"
              onClick={() => setIsZoomed(true)}
            >
              <Image
                src={images[activeImageIdx]}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

              {/* Limited Edition Stamp */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-black/60 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.2em] text-amber-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Certificate Included
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 aspect-[3/4] rounded-lg overflow-hidden border transition-all flex-shrink-0 ${
                      idx === activeImageIdx ? 'border-amber-400 scale-95' : 'border-white/10 hover:border-white/40'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Purchase Card Column */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-8 p-6 md:p-8 rounded-2xl border border-amber-500/10 bg-black/40 backdrop-blur-md">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-[0.2em]">
                  ✦ Vault Exclusive
                </span>
                <h1 className="text-3xl md:text-4xl font-light uppercase tracking-wider text-white mt-4">
                  {product.name}
                </h1>
                <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest">
                  SKU: {product.sku}
                </p>
              </div>

              {/* Price */}
              <div className="border-t border-b border-white/10 py-4 flex items-baseline gap-4">
                <span className="text-3xl font-black text-white">${product.price.toLocaleString()}</span>
                {product.compareAtPrice && (
                  <span className="text-base text-zinc-500 line-through">
                    ${product.compareAtPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                {product.description}
              </p>

              {/* Stock Warning */}
              {product.inventory && product.inventory <= 3 && (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs tracking-wider">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>CRITICAL ALERT: Only {product.inventory} pieces remain globally.</span>
                </div>
              )}

              {/* Selection Options */}
              <div className="space-y-6">
                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-semibold">Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[44px] h-11 border text-xs uppercase tracking-wider rounded-xl transition-all ${
                            selectedSize === size
                              ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-bold'
                              : 'border-white/10 text-zinc-400 hover:border-white/40 hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-semibold">Color</h3>
                    <div className="flex gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 border rounded-xl text-xs uppercase tracking-wider transition-all ${
                            selectedColor === color
                              ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-bold'
                              : 'border-white/10 text-zinc-400 hover:border-white/40 hover:text-white'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Buy Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToBag}
                  disabled={isSoldOut}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-xs uppercase tracking-widest font-black transition-all ${
                    isSoldOut
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-amber-400 text-black hover:bg-amber-300'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" /> {isSoldOut ? 'Sold Out' : 'Acquire Vault Piece'}
                </button>
                <button
                  onClick={handleWishlist}
                  className={`p-4 border rounded-xl hover:border-white transition-all ${
                    inWishlist ? 'border-red-500/40 bg-red-500/5' : 'border-white/10'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`h-4 w-4 ${inWishlist ? 'fill-red-400 text-red-400' : 'text-white'}`} />
                </button>
              </div>

              {/* Logistics/Trust items */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <Truck className="h-4 w-4 text-amber-400" />
                  <span>Complimentary Insured Courier Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <RotateCcw className="h-4 w-4 text-amber-400" />
                  <span>Secure 14-Day Returns & Exchanges</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description / Story / Materials */}
        <div className="mt-20 border-t border-white/10 pt-16 max-w-4xl">
          <h2 className="text-2xl font-light uppercase tracking-widest mb-8 text-white">The Piece Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm leading-relaxed text-zinc-400">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-amber-400 mb-2 font-bold">Materials & Craftsmanship</h3>
                <ul className="list-disc pl-4 space-y-1">
                  {product.materials?.map((material) => (
                    <li key={material}>{material}</li>
                  )) || <li>Premium archive fabric blend.</li>}
                </ul>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wider text-amber-400 mb-2 font-bold">Care Instructions</h3>
                <p>{product.careInstructions || 'Dry clean only. Store in garment cover.'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider text-amber-400 mb-2 font-bold">Provenance & Rarity</h3>
              <p className="font-light">
                Every piece from the Plasma Vault carries a distinct RFID serialization matching its certificate of authenticity. Handcrafted with high-frequency tailoring techniques, this garment is designed as a legacy artifact bridging computational structure and functional performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div className="relative max-w-4xl max-h-[90vh] aspect-[3/4]">
              <Image
                src={images[activeImageIdx]}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
