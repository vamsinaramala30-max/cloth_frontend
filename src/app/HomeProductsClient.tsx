'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchProducts, Product } from '@/lib/api';
import { IMAGE_MAP, getLocalProductImage } from '@/lib/images';
import { ProductCard } from '@/components/ProductCard';

const fallbackProducts: Product[] = [
  {
    _id: 'fallback-1',
    name: 'Nebula Frame Coat',
    slug: 'nebula-frame-coat',
    description: 'A cinematic coat engineered for motion and glow.',
    basePrice: 189,
    salePrice: 149,
    category: 'Outerwear',
    collections: ['Neural Silk'],
    tags: ['nebula', 'coat', 'editorial'],
    variants: [
      {
        sku: 'NFC-OS',
        color: '#00d9ff',
        colorName: 'Cyan Haze',
        size: 'S',
        stock: 12,
        images: [IMAGE_MAP.background],
      },
    ],
    averageRating: 4.8,
    isFeatured: true,
    isActive: true,
    reviews: [{ rating: 5 }],
  },
  {
    _id: 'fallback-2',
    name: 'Quantum Weave Shirt',
    slug: 'quantum-weave-shirt',
    description: 'Breathable luxury fabric with a futuristic drape.',
    basePrice: 96,
    salePrice: 79,
    category: 'Tops',
    collections: ['Quantum Weave'],
    tags: ['quantum', 'weave', 'shirt'],
    variants: [
      {
        sku: 'QWS-MD',
        color: '#b366ff',
        colorName: 'Violet Pulse',
        size: 'M',
        stock: 20,
        images: [IMAGE_MAP.background],
      },
    ],
    averageRating: 4.6,
    isFeatured: false,
    isActive: true,
    reviews: [{ rating: 4 }],
  },
  {
    _id: 'fallback-3',
    name: 'Ethereal Form Dress',
    slug: 'ethereal-form-dress',
    description: 'A silhouette built for soft light and bold presence.',
    basePrice: 210,
    salePrice: 175,
    category: 'Dresses',
    collections: ['Ethereal Form'],
    tags: ['ethereal', 'dress', 'luxury'],
    variants: [
      {
        sku: 'EFD-LG',
        color: '#ff4fd8',
        colorName: 'Pink Aurora',
        size: 'L',
        stock: 8,
        images: [IMAGE_MAP.background],
      },
    ],
    averageRating: 4.9,
    isFeatured: true,
    isActive: true,
    reviews: [{ rating: 5 }],
  },
  {
    _id: 'fallback-4',
    name: 'Digital Thread Pants',
    slug: 'digital-thread-pants',
    description: 'Tailored comfort with a luminous edge.',
    basePrice: 128,
    salePrice: 99,
    category: 'Bottoms',
    collections: ['Digital Thread'],
    tags: ['thread', 'pants', 'tailored'],
    variants: [
      {
        sku: 'DTP-SML',
        color: '#ffd24a',
        colorName: 'Amber Signal',
        size: 'S',
        stock: 15,
        images: [IMAGE_MAP.background],
      },
    ],
    averageRating: 4.4,
    isFeatured: false,
    isActive: true,
    reviews: [{ rating: 4 }],
  },
];

function normalizedProductImage(product: Product, index: number) {
  const rawImg = product.variants?.[0]?.images?.[0];
  const normalized = (() => {
    const v = typeof rawImg === 'string' ? rawImg.trim() : '';
    if (!v) return '';
    if (v.startsWith('/images/') || v.startsWith('images/')) {
      return v.startsWith('/') ? v : `/${v}`;
    }
    return '';
  })();

  return normalized || getLocalProductImage(product.name || product._id, index);
}

export default function HomeProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetchProducts({ limit: 8, sort: 'latest' });
        if (response.error) {
          setError(response.error);
          setProducts([]);
        } else {
          setProducts((response.data?.data as Product[]) || []);
        }
      } catch {
        setError('Unable to load premium products.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const gridProducts = useMemo(() => {
    return products.length ? products : fallbackProducts;
  }, [products]);

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

        {error ? (
          <div className="mb-12 rounded-3xl border border-red-500/10 bg-red-500/10 p-8 text-center text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {/* Reserve grid space to reduce CLS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-96 rounded-xl bg-white/5 animate-pulse" />
              ))
            : gridProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.salePrice ?? product.basePrice}
                  image={normalizedProductImage(product, index)}
                  category={product.category}
                  isFeatured={product.isFeatured}
                  delay={index * 0.1}
                />
              ))}
        </div>

        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.a
            href="/shop"
            className="px-12 py-4 border-2 border-cyan-400 text-cyan-400 font-bold tracking-[0.3em] uppercase text-sm hover:bg-cyan-400/10 transition-all duration-300 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Collections
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

