'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { getCollectionBySlug } from '@/lib/data/collections';
import { getProductsByCollection } from '@/lib/data/products';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';

export default function CollectionDetailPage({ params }: CollectionPageProps) {
  const collection = getCollectionBySlug(params.slug);
  if (!collection) {
    notFound();
  }

  const allProducts = useMemo(() => getProductsByCollection(params.slug), [params.slug]);

  // States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(20000);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Extract categories for filters
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    allProducts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [allProducts]);

  // Max price calculation
  const maxProductPrice = useMemo(() => {
    if (allProducts.length === 0) return 1000;
    return Math.max(...allProducts.map((p) => p.price));
  }, [allProducts]);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Price
    result = result.filter((p) => p.price <= priceRange);

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.reviews && typeof b.reviews === 'number' ? b.reviews : 0) - (a.reviews && typeof a.reviews === 'number' ? a.reviews : 0));
    }

    return result;
  }, [allProducts, selectedCategory, priceRange, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setPriceRange(maxProductPrice);
    setSortBy('newest');
  };

  return (
    <div className="relative min-h-screen pt-20 pb-24 px-4 md:px-8 z-20 text-white">
      {/* Editorial Banner */}
      <div className="relative w-full h-[50vh] md:h-[60vh] rounded-3xl overflow-hidden mb-12 border border-white/[0.08]">
        <Image
          src={collection.bannerImage || collection.image}
          alt={collection.title}
          fill
          priority
          className="object-cover object-center brightness-75 scale-105"
        />
        {/* Subtle color highlight background glow */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent`} />
        <div className={`absolute inset-0 bg-gradient-to-tr ${collection.accentColor} opacity-20 mix-blend-color-dodge`} />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-4xl">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/collections" className="hover:text-cyan-400 transition-colors">Collections</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{collection.title}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-light tracking-[0.08em] uppercase mb-4 text-white">
            {collection.title}
          </h1>
          <p className="text-sm md:text-base text-zinc-300 tracking-wide font-light max-w-2xl leading-relaxed">
            {collection.longDescription || collection.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-8 p-6 rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </h2>
                {(selectedCategory !== 'All' || sortBy !== 'newest') && (
                  <button
                    onClick={resetFilters}
                    className="text-[10px] uppercase tracking-widest text-cyan-400 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left text-xs py-2 px-3 rounded-lg uppercase tracking-wider transition-all border ${
                        selectedCategory === cat
                          ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300'
                          : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">Max Price</h3>
                  <span className="text-xs font-bold text-cyan-400">${priceRange.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxProductPrice}
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-2">
                  <span>$0</span>
                  <span>${maxProductPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Sorting */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold flex items-center gap-2">
                  <ArrowUpDown className="h-3 w-3" /> Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white uppercase tracking-widest outline-none focus:border-cyan-400 transition-colors cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popular">Popularity</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Product Grid Container */}
          <div className="flex-1">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-xs text-zinc-400 uppercase tracking-widest">
                Showing {filteredProducts.length} of {allProducts.length} pieces
              </p>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFiltersMobile(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-xs uppercase tracking-widest bg-black/40 hover:bg-white/[0.04] transition-all"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
              </button>
            </div>

            {/* Products Grid */}
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      productId={product.id}
                      slug={product.slug}
                      name={product.name}
                      price={product.price}
                      compareAtPrice={product.compareAtPrice}
                      image={product.images[0]}
                      hoverImage={product.gallery && product.gallery[1]}
                      category={product.category}
                      collection={product.collection}
                      isFeatured={product.isFeatured}
                      isVault={product.isVault}
                      sizes={product.sizes}
                      delay={index * 0.05}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EmptyState
                    variant="products"
                    title="No Matching Pieces"
                    message="Adjust your filters to discover other pieces from this collection."
                    actionLabel="Reset Filters"
                    onAction={resetFilters}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showFiltersMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersMobile(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-zinc-950 border-l border-white/10 z-50 p-6 lg:hidden flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <h2 className="text-sm font-semibold uppercase tracking-widest flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </h2>
                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-8 flex-1">
                {/* Categories */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs py-2 px-3 rounded-lg uppercase tracking-wider transition-all border ${
                          selectedCategory === cat
                            ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300'
                            : 'border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">Max Price</h3>
                    <span className="text-xs font-bold text-cyan-400">${priceRange.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxProductPrice}
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 mt-2">
                    <span>$0</span>
                    <span>${maxProductPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Sorting */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold flex items-center gap-2">
                    <ArrowUpDown className="h-3 w-3" /> Sort By
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white uppercase tracking-widest outline-none focus:border-cyan-400 transition-colors"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="popular">Popularity</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-white/10 pt-6 mt-6 flex gap-4">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 border border-white/10 rounded-xl text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="flex-1 py-3 bg-white text-black font-semibold rounded-xl text-xs uppercase tracking-widest hover:bg-cyan-300 transition-all"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
