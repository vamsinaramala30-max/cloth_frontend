import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Craftsmanship | RARE RAB IT',
  description:
    'Premium craftsmanship details—tailoring discipline, finishing precision, and couture-level attention in every seam.',
  openGraph: {
    title: 'Craftsmanship | RARE RAB IT',
    description:
      'Premium craftsmanship details—tailoring discipline, finishing precision, and couture-level attention in every seam.',
    type: 'website',
  },
};

export default function CraftsmanshipPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Craftsmanship
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        Luxury is the sum of invisible decisions. RARE RAB IT garments are
        shaped by refined pattern logic, controlled construction, and finishing
        techniques designed to last.
      </p>

      <p className="mt-5 text-zinc-400 leading-relaxed">
        From seam tension to drape behavior, we treat each piece like a
        micro-architecture—crafted to hold form, movement, and presence.
      </p>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Couture-level details</h2>
        <ul className="mt-4 space-y-3 text-zinc-400">
          <li>• Precision stitching for clean, durable structure</li>
          <li>• Premium finishing for a refined surface feel</li>
          <li>• Fit mapping designed around real-world motion</li>
          <li>• Responsible material selection and waste-aware planning</li>
        </ul>
      </section>
    </article>
  );
}

