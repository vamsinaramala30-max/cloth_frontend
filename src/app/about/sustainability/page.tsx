import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sustainability | RARE RAB IT',
  description:
    'Sustainability initiatives—designing for longevity, waste-aware production, and responsible material choices.',
  openGraph: {
    title: 'Sustainability | RARE RAB IT',
    description:
      'Sustainability initiatives—designing for longevity, waste-aware production, and responsible material choices.',
    type: 'website',
  },
};

export default function SustainabilityPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Sustainability
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        Sustainability at RARE RAB IT means designing for a longer life. We
        prioritize durable materials, minimize waste in production planning,
        and aim for practices that reduce unnecessary turnover.
      </p>

      <p className="mt-5 text-zinc-400 leading-relaxed">
        We treat responsibility as a design constraint: if it can’t be made
        thoughtfully, it won’t be part of the collection.
      </p>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Our initiatives</h2>
        <ul className="mt-4 space-y-3 text-zinc-400">
          <li>• Waste-aware production planning</li>
          <li>• Longevity-first design philosophy</li>
          <li>• Responsible material sourcing mindset</li>
          <li>• Transparency in brand standards</li>
        </ul>
      </section>
    </article>
  );
}

