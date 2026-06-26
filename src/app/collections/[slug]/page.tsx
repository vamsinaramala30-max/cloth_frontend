'use client';

import React, { useState, useMemo, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { fetchCollectionBySlug, fetchCollectionProducts } from '@/lib/api';
import type { Collection, Product } from '@/types';
import { getLocalProductImage } from '@/lib/images';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular';

function getProductImage(product: Product, index: number): string {
  const directImg = product.images?.[0];
  if (directImg && (directImg.startsWith('http') || directImg.startsWith('/'))) return directImg;
  const variantImg = product.variants?.[0]?.images?.[0];
  if (variantImg && (variantImg.startsWith('http') || variantImg.startsWith('/'))) return variantImg;
  return getLocalProductImage(product.name || product.id, index);
}

export default function CollectionDetailPage({ params }: CollectionPageProps) {
  const { slug } = use(params);

  const [collection, setCollection] = useState<Collection | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(20000);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [collectionRes, productsRes] = await Promise.all([
          fetchCollectionBySlug(slug),
          fetchCollectionProducts(slug),
        ]);

        if (!mounted) return;

        if (collectionRes.error || !collectionRes.data?.data) {
          notFound();
          return;
        }
        setCollection(collectionRes.data.data);

        const products = (productsRes.data?.data ?? []) as Product[];
        setAllProducts(products);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load collection');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [slug]);

  // Extract categories for filters
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    allProducts.forEach((p) => { if (p.category) cats.add(p.category); });
    return Array.from(cats);
  }, [allProducts]);

  const maxProductPrice = useMemo(() => {
    if (allProducts.length === 0) return 1000;
    return Math.max(...allProducts.map((p) => p.salePrice ?? p.basePrice ?? p.price ?? 0), 1000);
  }, [allProducts]);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result = result.filter((p) => (p.salePrice ?? p.basePrice ?? p.price ?? 0) <= priceRange);

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.salePrice ?? a.price ?? 0) - (b.salePrice ?? b.price ?? 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.salePrice ?? b.price ?? 0) - (a.salePrice ?? a.price ?? 0));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => {
        const aRating = Array.isArray(a.reviews) ? a.reviews.length : 0;
        const bRating = Array.isArray(b.reviews) ? b.reviews.length : 0;
        return bRating - aRating;
      });
    }

    return result;
  }, [allProducts, selectedCategory, priceRange, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setPriceRange(maxProductPrice);
    setSortBy('newest');
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen pt-40 pb-24 px-4 md:px-8 z-20 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse h-[50vh] rounded-3xl bg-white/5 mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="relative min-h-screen pt-40 pb-24 flex items-center justify-center">
        <EmptyState
          variant="products"
          title="Collection Not Found"
          message={error || 'This collection does not exist.'}
          cta="Browse Collections"
          href="/collections"
        />
      </div>
    );
  }

  const collectionImage = collection.bannerImage || collection.image;

  return (
    <div className="relative min-h-screen pt-20 pb-24 px-4 md:px-8 z-20 text-white">
      {/* Editorial Banner */}
      <div className="relative w-full h-[50vh] md:h-[60vh] rounded-3xl overflow-hidden mb-12 border border-white/[0.08]">
        <Image
          src={collectionImage}
          alt={collection.title}
          fill
          priority
          className="object-cover object-center brightness-75 scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

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
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-4 font-semibold">Sort By</h3>
                <div className="space-y-2">
                  {(['newest', 'price-asc', 'price-desc', 'popular'] as SortOption[]).map((opt) => {
                    const labels: Record<SortOption, string> = {
                      newest: 'Newest First',
                      'price-asc': 'Price: Low to High',
                      'price-desc': 'Price: High to Low',
                      popular: 'Most Popular',
                    };
                    return (
                      <button
                        key={opt}
                        onClick={() => setSortBy(opt)}
                        className={`w-full text-left text-xs py-2 px-3 rounded-lg uppercase tracking-wider transition-all border ${
                          sortBy === opt
                            ? 'bg-purple-500/10 border-purple-400/30 text-purple-300'
                            : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                        }`}
                      >
                        {labels[opt]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center justify-between mb-6 gap-4">
              <button
                onClick={() => setShowFiltersMobile(true)}
                className="flex items-center gap-2 px-4 py-2.5 border border-white/20 text-white text-xs uppercase tracking-widest rounded-xl hover:border-white/50 transition-all"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
              <button
                onClick={() => setSortBy(sortBy === 'newest' ? 'price-asc' : 'newest')}
                className="flex items-center gap-2 px-4 py-2.5 border border-white/20 text-white text-xs uppercase tracking-widest rounded-xl hover:border-white/50 transition-all"
              >
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-xs text-zinc-500 uppercase tracking-widest">
                {filteredProducts.length} piece{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product._id || product.id}
                    id={product._id || product.id}
                    slug={product.slug}
                    name={product.name}
                    price={product.salePrice ?? product.basePrice ?? product.price}
                    compareAtPrice={product.compareAtPrice}
                    image={getProductImage(product, index)}
                    category={product.category}
                    collection={collection.title}
                    isFeatured={product.isFeatured}
                    isVault={product.isVault}
                    sizes={product.sizes}
                    delay={index * 0.05}
                  />
                ))}
              </motion.div>
            ) : (
              <EmptyState
                variant="products"
                title="No Pieces Found"
                message="Try adjusting your filters to find products in this collection."
                cta="Clear Filters"
                onClick={resetFilters}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showFiltersMobile && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowFiltersMobile(false)}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-zinc-950 border-t border-white/10 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Filters</h2>
                <button onClick={() => setShowFiltersMobile(false)} className="text-zinc-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider border transition-all ${
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
                <button
                  onClick={() => { resetFilters(); setShowFiltersMobile(false); }}
                  className="w-full py-3 border border-white/20 text-white text-xs uppercase tracking-widest rounded-xl hover:border-white/50 transition-all"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="w-full py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-black text-xs uppercase tracking-widest rounded-xl font-bold"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
