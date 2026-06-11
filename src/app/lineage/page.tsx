import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { LineageTimeline } from '@/components/lineage/LineageTimeline';
import { FounderStory } from '@/components/lineage/FounderStory';
import { BrandVision } from '@/components/lineage/BrandVision';
import { ManufacturingJourney } from '@/components/lineage/ManufacturingJourney';
import { SustainabilitySection } from '@/components/lineage/SustainabilitySection';

export const metadata: Metadata = {
  title: 'Lineage | Rare Rabbit',
  description: 'A luxury heritage timeline: founder story, manufacturing journey, and sustainability from Rare Rabbit.',
  keywords: ['rare rabbit', 'luxury brand heritage', 'manufacturing', 'sustainability', 'fashion story'],
  openGraph: {
    title: 'Lineage | Rare Rabbit',
    description: 'A luxury heritage timeline: founder story, manufacturing journey, and sustainability from Rare Rabbit.',
    type: 'website',
  },
};

export default function LineagePage() {
  // Route-level guard (keeps the page safe even if a future data source is added)
  const isClientRenderable = true;
  if (!isClientRenderable) notFound();

  return (
    <div className="relative">
      <section className="pt-28 md:pt-32 px-4 md:px-10 lg:px-14 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-cyan-400 tracking-[0.25em] uppercase text-xs md:text-sm">Luxury Heritage</p>
            <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-gradient">LINEAGE</h1>
            <p className="mt-5 text-zinc-300/90 max-w-2xl mx-auto">
              A premium timeline of craft, vision, and intention—from the founder’s first sketch to the journey
              behind every stitch.
            </p>
          </div>

          <div className="mt-12">
            <Suspense fallback={<div className="h-24" />}> 
              <LineageTimeline />
            </Suspense>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-6">
              <FounderStory />
            </div>
            <div className="lg:col-span-6">
              <BrandVision />
            </div>
          </div>

          <div className="mt-16">
            <ManufacturingJourney />
          </div>

          <div className="mt-16">
            <SustainabilitySection />
          </div>

          <div className="mt-16 text-center">
            <p className="text-zinc-400 text-sm md:text-base max-w-3xl mx-auto">
              Built for the future of luxury fashion—where premium design meets responsible production.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

