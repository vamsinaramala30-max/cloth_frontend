'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { CATEGORIES } from '@/lib/constants';
import { fetchProducts, Product } from '@/lib/api';
import { getLocalProductImage } from '@/lib/images';

const sortOptions = [
  { label: 'Latest', value: 'latest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Most Popular', value: 'popular' },
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      setLoading(true);
      setError('');

      const apiSort =
        sortBy === 'price-low'
          ? 'price-low-high'
          : sortBy === 'price-high'
          ? 'price-high-low'
          : undefined;

      const categoryValue = selectedCategory === 'All Items' ? undefined : selectedCategory;
      const response = await fetchProducts({
        category: categoryValue,
        sort: apiSort,
        search: searchQuery || undefined,
        limit: 24,
      });
      console.log("Response:",response);
    if(!response){
      setError("no response recieved");
      setProducts([]);
    }
      else if (response.error) {
        setError(response.error);
        setProducts([]);
      } else {
        setProducts(response.data?.data ?? []);
      }

      if (!controller.signal.aborted) {
        setLoading(false);
      }
    };

    loadProducts();
    return () => controller.abort();
  }, [selectedCategory, sortBy, searchQuery]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-light tracking-[0.1em] text-white uppercase mb-4">
            The Vault
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 tracking-[0.2em]">
            EXPLORE OUR COMPLETE COLLECTION OF FUTURISTIC LUXURY FASHION
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </motion.div>

        <motion.div
          className="mb-12 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-4">
              Category
            </p>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`px-6 py-2 rounded-full text-xs font-medium tracking-widest uppercase transition-all duration-300 ${
                    selectedCategory === cat.label
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-black border border-transparent shadow-2xl shadow-cyan-500/20'
                      : 'border border-white/20 text-white hover:border-white/40 bg-white/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-2 text-cyan-300">{cat.icon}</span>
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-4">
              Sort By
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400 transition-all"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-black text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <motion.p
            className="text-xs text-zinc-500 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {loading ? 'Loading products…' : `${products.length} Items`}
          </motion.p>
        </motion.div>

        {error && (
          <div className="text-center text-sm text-red-400 mb-8">{error}</div>
        )}

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-96 rounded-xl bg-white/5 animate-pulse"
                />
              ))
            : products.map((product, index) => {
                const rawImg = product.variants?.[0]?.images?.[0];
                const normalized = (() => {
                  const v = typeof rawImg === 'string' ? rawImg.trim() : '';
                  if (!v) return '';
                  if (v.startsWith('/images/') || v.startsWith('images/')) {
                    return v.startsWith('/') ? v : `/${v}`;
                  }
                  return '';
                })();

                return (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={product.salePrice ?? product.basePrice}
                    image={normalized || getLocalProductImage(product.name || product._id, index)}
                    category={product.category}
                    isFeatured={product.isFeatured}
                    delay={index * 0.05}
                  />
                );
              })}
        </motion.div>

        {!loading && products.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xl text-zinc-400 mb-4">No products found in this category</p>
            <motion.button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-6 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all"
              whileHover={{ scale: 1.05 }}
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
