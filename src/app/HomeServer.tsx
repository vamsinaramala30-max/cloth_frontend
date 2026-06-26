import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { FloatingEditorialSection } from '@/components/FloatingEditorialSection';
import { CampaignVideoSection } from '@/components/CampaignVideoSection';
import { ProductSpotlight } from '@/components/ProductSpotlight';
import { LuxuryLookbook } from '@/components/LuxuryLookbook';
import { ScrollStorySection } from '@/components/ScrollStorySection';
import { ThreeProductScene } from '@/components/ThreeProductScene';
import { FeaturedCollections } from '@/components/FeaturedCollections';
import { CircularCategories } from '@/components/CircularCategories';
import HomeProductsClient from './HomeProductsClient';
import { fetchCollections } from '@/lib/api';
import { IMAGE_MAP } from '@/lib/images';

async function getHomepageCollections() {
  try {
    const response = await fetchCollections();
    if (response.data?.data && response.data.data.length > 0) {
      return response.data.data.slice(0, 3).map((c) => ({
        id: c.id || c._id || c.slug,
        title: c.title,
        description: c.description,
        image: c.bannerImage || c.image || IMAGE_MAP.collection,
        color: c.accentColor || 'from-cyan-500 to-purple-600',
        slug: c.slug,
      }));
    }
  } catch {
    // Silently fail — component will show neutral skeleton slides
  }
  return [];
}

export default async function HomeServer() {
  const collections = await getHomepageCollections();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent">
      <HeroSection />
      <FloatingEditorialSection />

      {/* Campaign Video Showcase */}
      <CampaignVideoSection />

      {/* Product Spotlight */}
      <ProductSpotlight />

      {/* Editorial Lookbook */}
      <LuxuryLookbook />

      {/* 3D Product Showcase */}
      <section className="relative w-full py-24 md:py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <ThreeProductScene />
        </div>
      </section>

      {/* Scroll Story Section */}
      <ScrollStorySection />

      {/* Featured Collections — populated from backend */}
      <FeaturedCollections collections={collections} />

      {/* Circular Categories */}
      <CircularCategories />

      {/* New Arrivals Section (hydrated client-side) */}
      <HomeProductsClient />

      {/* Promotional Banner */}
      <section className="relative w-full py-16 md:py-20 px-4 md:px-8 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl p-8 md:p-16">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl" />
            <div className="absolute inset-0 rounded-2xl border-2 border-gradient-to-r from-cyan-400 to-purple-400 opacity-60" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-3xl md:text-4xl font-light tracking-[0.1em] text-white uppercase mb-4">
                  Exclusive Preview
                </h3>
                <p className="text-sm md:text-base text-zinc-300 mb-6">
                  Join our VIP community for early access to limited collections and exclusive
                  events.
                </p>
              </div>

              <a
                href="/collections"
                className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold tracking-widest uppercase rounded-lg whitespace-nowrap"
              >
                Join Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
