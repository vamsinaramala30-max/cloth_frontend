import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Size Guide | Plasma Atelier',
  description:
    'Find the perfect fit. A premium size guide designed for luxury fashion comfort and silhouette accuracy.',
};

export default function SizeGuidePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Size Guide
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        Use measurements as your reference. If you’re between sizes, choose
        based on your preferred fit (close vs. relaxed).
      </p>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-white font-semibold">Measurement tips</h2>
        <ul className="mt-4 space-y-3 text-zinc-400">
          <li>• Measure over your base layer</li>
          <li>• Keep tape level for accurate results</li>
          <li>• Compare with product-specific fit notes</li>
        </ul>
      </div>
    </article>
  );
}

