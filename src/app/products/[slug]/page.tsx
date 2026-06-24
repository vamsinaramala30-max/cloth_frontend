'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Heart, ShoppingBag, Truck, RotateCcw } from 'lucide-react';
import { getProductBySlug, getProductsByCollection } from '@/lib/data/products';
import { useCartStore } from '@/lib/stores/useCartStore';
import { useWishlistStore } from '@/lib/stores/useWishlistStore';
import { useToastStore } from '@/lib/stores/useToastStore';
import { getLocalProductImage } from '@/lib/images';
import { ProductCard } from '@/components/ProductCard';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProductSlugDetailPage({ params }: ProductDetailPageProps) {
  const product = getProductBySlug(params.slug);

  // If not found, show 404
  if (!product) {
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

  const relatedProducts = useMemo(() => {
    if (!product.collection) return [];
    return getProductsByCollection(product.collection)
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
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
    addToast('success', 'Added to Bag', product.name);
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
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-cyan-400 transition-colors">Catalog</Link>
          {product.collection && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/collections/${product.collection}`} className="hover:text-cyan-400 transition-colors">
                {product.collection.replace(/-/g, ' ')}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-black/40 cursor-zoom-in"
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
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 aspect-[3/4] rounded-lg overflow-hidden border transition-all flex-shrink-0 ${
                      idx === activeImageIdx ? 'border-cyan-400 scale-95' : 'border-white/10 hover:border-white/40'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Checkout/Description Options */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-8 p-6 md:p-8 rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-md">
              <div>
                {product.collection && (
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-[0.2em]">
                    {product.collection.replace(/-/g, ' ')} Collection
                  </span>
                )}
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
                            ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300 font-bold'
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
                            ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300 font-bold'
                            : 'border-white/10 text-zinc-400 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToBag}
                  disabled={isSoldOut}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-xs uppercase tracking-widest font-black transition-all ${
                    isSoldOut
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-cyan-300'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" /> {isSoldOut ? 'Sold Out' : 'Add to Bag'}
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

              {/* Logistics */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <Truck className="h-4 w-4 text-cyan-400" />
                  <span>Complimentary Shipping Worldwide</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <RotateCcw className="h-4 w-4 text-cyan-400" />
                  <span>Flexible Returns Within 14 Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed description */}
        <div className="mt-20 border-t border-white/10 pt-16 max-w-4xl">
          <h2 className="text-2xl font-light uppercase tracking-widest mb-8 text-white">Identity & Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm leading-relaxed text-zinc-400">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-cyan-400 mb-2 font-bold">Materials</h3>
                <ul className="list-disc pl-4 space-y-1">
                  {product.materials?.map((material) => (
                    <li key={material}>{material}</li>
                  )) || <li>Premium textile blend.</li>}
                </ul>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wider text-cyan-400 mb-2 font-bold">Care Instructions</h3>
                <p>{product.careInstructions || 'Dry clean recommended.'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider text-cyan-400 mb-2 font-bold">Editorial Story</h3>
              <p className="font-light">
                This piece represents Plasma Atelier&apos;s structural approach to modern silhouette drafting. The design relies on high-grade materials and careful pattern-alignment to generate comfortable yet visually striking volume.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-white/10 pt-16">
            <h2 className="text-xl md:text-2xl font-light uppercase tracking-widest mb-8 text-white">Related Pieces</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  productId={p.id}
                  slug={p.slug}
                  name={p.name}
                  price={p.price}
                  compareAtPrice={p.compareAtPrice}
                  image={p.images[0]}
                  hoverImage={p.gallery && p.gallery[1]}
                  category={p.category}
                  collection={p.collection}
                  isFeatured={p.isFeatured}
                  isVault={p.isVault}
                  sizes={p.sizes}
                />
              ))}
            </div>
          </div>
        )}
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
