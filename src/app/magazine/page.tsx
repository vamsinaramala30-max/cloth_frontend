import type { Metadata } from 'next';
import { MagazineClient } from '@/components/magazine/MagazineClient';

export const metadata: Metadata = {
  title: 'Magazine | Plasma Atelier',
  description: 'Editorial fashion articles, style guides, and featured collections from Plasma Atelier.',
  keywords: ['Plasma Atelier', 'fashion magazine', 'style guide', 'editorial', 'luxury fashion'],
  openGraph: {
    title: 'Magazine | Plasma Atelier',
    description: 'Editorial fashion articles, style guides, and featured collections from Plasma Atelier.',
    type: 'website',
  },
};

export default function MagazinePage() {
  return (
    <div className="relative">
      <section className="pt-28 md:pt-32 px-4 md:px-10 lg:px-14 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-cyan-400 tracking-[0.25em] uppercase text-xs md:text-sm">Editorial</p>
            <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-gradient">MAGAZINE</h1>
            <p className="mt-5 text-zinc-300/90 max-w-2xl mx-auto">
              Fashion articles, style guides, and curated collections—designed to help you dress with intention.
            </p>
          </div>

          <div className="mt-12">
            <MagazineClient />
          </div>
        </div>
      </section>
    </div>
  );
}

