'use client';

import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProductStore } from '@/lib/stores/useProductStore';
import { getSafeProductImage } from '@/lib/images';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

function getProductImage(product: { images?: string[]; variants?: { images?: string[] }[]; id: string; name?: string }, index: number): string {
  const directImg = product.images?.[0];
  const variantImg = product.variants?.[0]?.images?.[0];
  const candidate = directImg || variantImg;
  return getSafeProductImage(candidate, product.name || product.id, index);
}

export default function HomeProductsClient() {
  const { products, isLoadingProducts, productsError, fetchProducts } = useProductStore();

  useEffect(() => {
    // Only fetch if we don't have products cached
    if (products.length === 0 && !isLoadingProducts) {
      fetchProducts({ limit: 8, sort: 'latest' });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gridProducts = useMemo(() => products.slice(0, 8), [products]);

  return (
    <section className="relative w-full py-20 md:py-32 px-4 md:px-8 z-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-[0.1em] text-white uppercase mb-4">
            New Arrivals
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 tracking-[0.2em]">
            LATEST FUTURISTIC DESIGNS
          </p>
        </motion.div>

        {productsError && (
          <div className="mb-12 rounded-3xl border border-red-500/10 bg-red-500/10 p-8 text-center text-sm text-red-200">
            {productsError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {isLoadingProducts
            ? Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : gridProducts.length > 0
            ? gridProducts.map((product, index) => (
                <ProductCard
                  key={product._id || product.id}
                  id={product._id || product.id}
                  slug={product.slug}
                  name={product.name}
                  price={product.salePrice ?? product.basePrice ?? product.price}
                  compareAtPrice={product.compareAtPrice}
                  image={getProductImage(product, index)}
                  category={product.category}
                  collection={product.collection}
                  isFeatured={product.isFeatured}
                  isVault={product.isVault}
                  sizes={product.sizes}
                  delay={index * 0.1}
                />
              ))
            : !productsError && (
                <div className="col-span-full">
                  <EmptyState
                    variant="products"
                    title="No Products Found"
                    message="Products are being loaded. Please check back shortly."
                    cta="Browse Collections"
                    href="/collections"
                  />
                </div>
              )}
        </div>

        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.a
            href="/products"
            className="px-12 py-4 border-2 border-cyan-400 text-cyan-400 font-bold tracking-[0.3em] uppercase text-sm hover:bg-cyan-400/10 transition-all duration-300 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Products
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}