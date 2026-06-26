'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ArrowUpDown, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchProducts, fetchFilters } from '@/lib/api';
import { Product } from '@/types';
import { getLocalProductImage } from '@/lib/images';

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low-high' },
  { label: 'Price: High to Low', value: 'price-high-low' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'Featured', value: 'featured' },
];

function getProductImage(product: Product, index: number): string {
  const directImg = product.images?.[0];
  if (directImg && (directImg.startsWith('http') || directImg.startsWith('/'))) return directImg;
  const variantImg = product.variants?.[0]?.images?.[0];
  if (variantImg && (variantImg.startsWith('http') || variantImg.startsWith('/'))) return variantImg;
  return getLocalProductImage(product.name || product.id, index);
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter definitions from API
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableCollections, setAvailableCollections] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // UI state
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState(searchParams?.get('search') || '');
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Read current filters from URL search params
  const category = searchParams?.get('category') || 'All';
  const collection = searchParams?.get('collection') || 'All';
  const color = searchParams?.get('color') || 'All';
  const size = searchParams?.get('size') || 'All';
  const minPrice = searchParams?.get('minPrice') || '';
  const maxPrice = searchParams?.get('maxPrice') || '';
  const availability = searchParams?.get('availability') || 'All';
  const featured = searchParams?.get('featured') || '';
  const newArrivals = searchParams?.get('newArrivals') || '';
  const bestSellers = searchParams?.get('bestSellers') || '';
  const sort = searchParams?.get('sort') || 'newest';
  const search = searchParams?.get('search') || '';
  const page = parseInt(searchParams?.get('page') || '1', 10);

  // Fetch filter configurations from API
  useEffect(() => {
    const loadFilters = async () => {
      const res = await fetchFilters();
      if (res.data?.success && res.data?.data) {
        setAvailableCategories(res.data.data.categories || []);
        setAvailableCollections(res.data.data.collections || []);
        setAvailableColors(res.data.data.colors || []);
        setAvailableSizes(res.data.data.sizes || []);
      }
    };
    loadFilters();
  }, []);

  // Fetch filtered products from backend API
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetchProducts({
          category: category !== 'All' ? category : undefined,
          collection: collection !== 'All' ? collection : undefined,
          sort,
          search: search || undefined,
          page,
          limit: 12,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          color: color !== 'All' ? color : undefined,
          size: size !== 'All' ? size : undefined,
          availability: availability === 'in-stock' ? 'true' : undefined,
          featured: featured === 'true' ? true : undefined,
          newArrivals: newArrivals === 'true' ? true : undefined,
          bestSellers: bestSellers === 'true' ? true : undefined,
        });

        if (response.error) {
          setError(response.error);
          setProducts([]);
        } else if (response.data?.data) {
          setProducts(response.data.data);
          setTotalCount(response.data.pagination?.total || 0);
          setTotalPages(response.data.pagination?.pages || 1);
        }
      } catch {
        setError('Failed to connect to catalog service.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [
    category,
    collection,
    color,
    size,
    minPrice,
    maxPrice,
    availability,
    featured,
    newArrivals,
    bestSellers,
    sort,
    search,
    page,
  ]);

  // Helper to update query parameters
  const updateQueryParam = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(window.location.search);
      if (value === undefined || value === 'All' || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      // Reset page back to 1 for non-page parameter changes
      if (key !== 'page') {
        params.delete('page');
      }
      router.push('/products?' + params.toString());
    },
    [router]
  );

  // Debounced search input handler
  const handleSearchInputChange = (val: string) => {
    setSearchInputValue(val);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      updateQueryParam('search', val.trim() || undefined);
    }, 400);
  };

  const handleClearSearch = () => {
    setSearchInputValue('');
    updateQueryParam('search', undefined);
  };

  const resetAllFilters = () => {
    setSearchInputValue('');
    router.push('/products');
  };

  // Prepend "All" to filters lists
  const categoriesList = ['All', ...availableCategories];
  const collectionsList = ['All', ...availableCollections];
  const colorsList = ['All', ...availableColors];
  const sizesList = ['All', ...availableSizes];

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

        {/* Global Search Bar */}
        <div className="max-w-md mx-auto mb-12 relative flex items-center">
          <Search className="absolute left-4 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchInputValue}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            placeholder="Search products, collections, tags…"
            className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-11 pr-10 text-sm placeholder-zinc-500 text-white focus:outline-none focus:border-cyan-400 focus:bg-white/[0.07] transition-all"
          />
          {searchInputValue && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 p-1 rounded-full text-zinc-400 hover:text-white"
              aria-label="Clear Search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-6 p-6 rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </h2>
                <button
                  onClick={resetAllFilters}
                  className="text-[10px] uppercase tracking-widest text-cyan-400 hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-semibold">Category</h3>
                <div className="space-y-1">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateQueryParam('category', cat)}
                      className={`w-full text-left text-xs py-2 px-3 rounded-lg uppercase tracking-wider transition-all border ${
                        category === cat
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
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-semibold">Collection</h3>
                <div className="space-y-1">
                  {collectionsList.map((col) => (
                    <button
                      key={col}
                      onClick={() => updateQueryParam('collection', col)}
                      className={`w-full text-left text-xs py-2 px-3 rounded-lg uppercase tracking-wider transition-all border ${
                        collection === col
                          ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300'
                          : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      {col.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-semibold">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizesList.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => updateQueryParam('size', sz)}
                      className={`text-xs py-1.5 px-3 rounded-lg uppercase tracking-wider transition-all border ${
                        size === sz
                          ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300'
                          : 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-semibold">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colorsList.map((cl) => (
                    <button
                      key={cl}
                      onClick={() => updateQueryParam('color', cl)}
                      className={`text-xs py-1.5 px-3 rounded-lg uppercase tracking-wider transition-all border ${
                        color === cl
                          ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300'
                          : 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      {cl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter Inputs */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-semibold">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => updateQueryParam('minPrice', e.target.value || undefined)}
                    className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-cyan-400"
                  />
                  <span className="text-zinc-600">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => updateQueryParam('maxPrice', e.target.value || undefined)}
                    className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Badges / Status Attributes */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-zinc-400 hover:text-white">
                  <input
                    type="checkbox"
                    checked={availability === 'in-stock'}
                    onChange={(e) => updateQueryParam('availability', e.target.checked ? 'in-stock' : undefined)}
                    className="h-4 w-4 accent-cyan-400 cursor-pointer"
                  />
                  <span>In Stock Only</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-zinc-400 hover:text-white">
                  <input
                    type="checkbox"
                    checked={featured === 'true'}
                    onChange={(e) => updateQueryParam('featured', e.target.checked ? 'true' : undefined)}
                    className="h-4 w-4 accent-cyan-400 cursor-pointer"
                  />
                  <span>Featured Items</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-zinc-400 hover:text-white">
                  <input
                    type="checkbox"
                    checked={newArrivals === 'true'}
                    onChange={(e) => updateQueryParam('newArrivals', e.target.checked ? 'true' : undefined)}
                    className="h-4 w-4 accent-cyan-400 cursor-pointer"
                  />
                  <span>New Arrivals</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-zinc-400 hover:text-white">
                  <input
                    type="checkbox"
                    checked={bestSellers === 'true'}
                    onChange={(e) => updateQueryParam('bestSellers', e.target.checked ? 'true' : undefined)}
                    className="h-4 w-4 accent-cyan-400 cursor-pointer"
                  />
                  <span>Best Sellers</span>
                </label>
              </div>

              {/* Sorting */}
              <div className="pt-2 border-t border-white/10">
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-semibold flex items-center gap-2">
                  <ArrowUpDown className="h-3 w-3" /> Sort By
                </h3>
                <select
                  value={sort}
                  onChange={(e) => updateQueryParam('sort', e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white uppercase tracking-widest outline-none focus:border-cyan-400 transition-colors cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-zinc-950">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Catalog grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-xs text-zinc-400 uppercase tracking-widest">
                Showing {products.length} of {totalCount} pieces
              </p>

              {/* Mobile filter button */}
              <button
                onClick={() => setShowFiltersMobile(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-xs uppercase tracking-widest bg-black/40 hover:bg-white/[0.04] transition-all"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-12">{error}</div>
            ) : products.length > 0 ? (
              <div className="space-y-12">
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id || product._id}
                      id={product.id || product._id || ''}
                      slug={product.slug}
                      name={product.name}
                      price={product.salePrice ?? product.basePrice ?? product.price ?? 0}
                      compareAtPrice={product.compareAtPrice}
                      image={getProductImage(product, index)}
                      category={product.category}
                      collection={product.collection || (product.collections && product.collections[0])}
                      isFeatured={product.isFeatured}
                      sizes={product.sizes}
                      delay={index * 0.04}
                    />
                  ))}
                </motion.div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 pt-8 border-t border-white/5">
                    <button
                      onClick={() => updateQueryParam('page', String(page - 1))}
                      disabled={page <= 1}
                      className="p-2 border border-white/10 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs uppercase tracking-widest text-zinc-400">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => updateQueryParam('page', String(page + 1))}
                      disabled={page >= totalPages}
                      className="p-2 border border-white/10 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                variant="products"
                title="No couture pieces matched"
                message="Refine your filter options to discover our other silhouettes."
                actionLabel="Reset Catalog"
                onAction={resetAllFilters}
              />
            )}
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

              <div className="space-y-6 flex-1">
                {/* Categories */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-semibold">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => updateQueryParam('category', cat)}
                        className={`text-xs py-2 px-3 rounded-lg uppercase tracking-wider transition-all border ${
                          category === cat
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
                  <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-semibold">Collection</h3>
                  <div className="flex flex-wrap gap-2">
                    {collectionsList.map((col) => (
                      <button
                        key={col}
                        onClick={() => updateQueryParam('collection', col)}
                        className={`text-xs py-2 px-3 rounded-lg uppercase tracking-wider transition-all border ${
                          collection === col
                            ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300'
                            : 'border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {col.replace(/-/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-semibold">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizesList.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => updateQueryParam('size', sz)}
                        className={`text-xs py-1.5 px-3 rounded-lg uppercase tracking-wider transition-all border ${
                          size === sz
                            ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300'
                            : 'border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-semibold">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {colorsList.map((cl) => (
                      <button
                        key={cl}
                        onClick={() => updateQueryParam('color', cl)}
                        className={`text-xs py-1.5 px-3 rounded-lg uppercase tracking-wider transition-all border ${
                          color === cl
                            ? 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300'
                            : 'border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {cl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter Inputs */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-semibold">Price Range</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => updateQueryParam('minPrice', e.target.value || undefined)}
                      className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-cyan-400"
                    />
                    <span className="text-zinc-600">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => updateQueryParam('maxPrice', e.target.value || undefined)}
                      className="w-1/2 bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Badges / Status Attributes */}
                <div className="pt-2 border-t border-white/10 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-zinc-400 hover:text-white">
                    <input
                      type="checkbox"
                      checked={availability === 'in-stock'}
                      onChange={(e) => updateQueryParam('availability', e.target.checked ? 'in-stock' : undefined)}
                      className="h-4 w-4 accent-cyan-400 cursor-pointer"
                    />
                    <span>In Stock Only</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-zinc-400 hover:text-white">
                    <input
                      type="checkbox"
                      checked={featured === 'true'}
                      onChange={(e) => updateQueryParam('featured', e.target.checked ? 'true' : undefined)}
                      className="h-4 w-4 accent-cyan-400 cursor-pointer"
                    />
                    <span>Featured Items</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-zinc-400 hover:text-white">
                    <input
                      type="checkbox"
                      checked={newArrivals === 'true'}
                      onChange={(e) => updateQueryParam('newArrivals', e.target.checked ? 'true' : undefined)}
                      className="h-4 w-4 accent-cyan-400 cursor-pointer"
                    />
                    <span>New Arrivals</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-zinc-400 hover:text-white">
                    <input
                      type="checkbox"
                      checked={bestSellers === 'true'}
                      onChange={(e) => updateQueryParam('bestSellers', e.target.checked ? 'true' : undefined)}
                      className="h-4 w-4 accent-cyan-400 cursor-pointer"
                    />
                    <span>Best Sellers</span>
                  </label>
                </div>

                {/* Sorting */}
                <div className="pt-2 border-t border-white/10">
                  <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-semibold flex items-center gap-2">
                    <ArrowUpDown className="h-3 w-3" /> Sort By
                  </h3>
                  <select
                    value={sort}
                    onChange={(e) => updateQueryParam('sort', e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white uppercase tracking-widest outline-none focus:border-cyan-400 transition-colors cursor-pointer"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-zinc-950">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mt-6 flex gap-4">
                <button
                  onClick={resetAllFilters}
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