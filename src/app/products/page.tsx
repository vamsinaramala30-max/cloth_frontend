'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(20000);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);
  const [showVault, setShowVault] = useState<boolean>(false);

  // Categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    MOCK_PRODUCTS.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, []);

  // Collections
  const collections = useMemo(() => {
    const cols = new Set<string>();
    cols.add('All');
    MOCK_PRODUCTS.forEach((p) => {
      if (p.collection) cols.add(p.collection);
      if (Array.isArray(p.collections)) {
        p.collections.forEach(c => cols.add(c));
      }
    });
    return Array.from(cols);
  }, []);

  // Max price
  const maxPrice = useMemo(() => {
    return Math.max(...MOCK_PRODUCTS.map((p) => p.price), 1000);
  }, []);

  // Filtered products
  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedCollection !== 'All') {
      result = result.filter(
        (p) => p.collection === selectedCollection || (Array.isArray(p.collections) && p.collections.includes(selectedCollection))
      );
    }

    if (showVault) {
      result = result.filter((p) => p.isVault);
    }

    result = result.filter((p) => p.price <= priceRange);

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
  }, [selectedCategory, selectedCollection, showVault, priceRange, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedCollection('All');
    setPriceRange(maxPrice);
    setSortBy('newest');
    setShowVault(false);
  };

  return (
    <div className="relative min-h-screen pt-28 pb-24 px-4 md:px-8 z-20 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-cyan-400 mb-4">
            Plasma Atelier
          </p>
          <h1 className="text-4xl md:text-6xl font-light tracking-[0.08em] text-white uppercase mb-5">
            Couture Catalog
          </h1>
          <p className="text-sm text-zinc-400 tracking-[0.15em] max-w-lg mx-auto leading-relaxed">
            Acquire unique structures, computational silhouettes, and custom-weave outer shells.
          </p>
          <div className="mt-8 w-24 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto" />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-8 p-6 rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </h2>
                <button
                  onClick={resetFilters}
                  className="text-[10px] uppercase tracking-widest text-cyan-400 hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Vault Switch */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">Vault Pieces Only</span>
                <button
                  onClick={() => setShowVault(!showVault)}
                  className={`w-10 h-6 rounded-full transition-all ${
                    showVault ? 'bg-amber-400' : 'bg-zinc-800'
                  } relative flex items-center p-1`}
                >
                  <motion.div
                    layout
                    className="w-4 h-4 bg-black rounded-full"
                    animate={{ x: showVault ? 16 : 0 }}
                  />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold">Category</h3>
                <div className="space-y-1">
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

              {/* Collections */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold">Collection</h3>
                <div className="space-y-1">
                  {collections.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedCollection(col)}
                      className={`w-full text-left text-xs py-2 px-3 rounded-lg uppercase tracking-wider transition-all border ${
                        selectedCollection === col
                          ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300'
                          : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      {col.replace(/-/g, ' ')}
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
                  max={maxPrice}
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-2">
                  <span>$0</span>
                  <span>${maxPrice.toLocaleString()}</span>
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

          {/* Catalog grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-xs text-zinc-400 uppercase tracking-widest">
                Showing {filteredProducts.length} of {MOCK_PRODUCTS.length} pieces
              </p>

              {/* Mobile filter button */}
              <button
                onClick={() => setShowFiltersMobile(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-xs uppercase tracking-widest bg-black/40 hover:bg-white/[0.04] transition-all"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
              </button>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
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
                      delay={index * 0.04}
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
                    title="No couture pieces matched"
                    message="Refine your filter options to discover our other silhouettes."
                    actionLabel="Reset Catalog"
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersMobile(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
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
                {/* Vault Switch */}
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">Vault Only</span>
                  <button
                    onClick={() => setShowVault(!showVault)}
                    className={`w-10 h-6 rounded-full transition-all ${
                      showVault ? 'bg-amber-400' : 'bg-zinc-800'
                    } relative flex items-center p-1`}
                  >
                    <motion.div
                      layout
                      className="w-4 h-4 bg-black rounded-full"
                      animate={{ x: showVault ? 16 : 0 }}
                    />
                  </button>
                </div>

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

                {/* Collections */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold">Collection</h3>
                  <div className="flex flex-wrap gap-2">
                    {collections.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedCollection(col)}
                        className={`text-xs py-2 px-3 rounded-lg uppercase tracking-wider transition-all border ${
                          selectedCollection === col
                            ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300'
                            : 'border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {col.replace(/-/g, ' ')}
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
                    max={maxPrice}
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 mt-2">
                    <span>$0</span>
                    <span>${maxPrice.toLocaleString()}</span>
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
