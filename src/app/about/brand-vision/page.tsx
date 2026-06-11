import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brand Vision | RARE RAB IT',
  description:
    'Explore the RARE RAB IT brand vision—precision luxury, fashion-tech creativity, and a future-first atelier mindset.',
  openGraph: {
    title: 'Brand Vision | RARE RAB IT',
    description:
      'Explore the RARE RAB IT brand vision—precision luxury, fashion-tech creativity, and a future-first atelier mindset.',
    type: 'website',
  },
};

export default function BrandVisionPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Brand Vision
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        Our vision is to make luxury more intentional. We combine atelier
        discipline with fashion-tech experimentation so every collection is
        both emotionally expressive and operationally precise.
      </p>

      <p className="mt-5 text-zinc-400 leading-relaxed">
        We believe the future of apparel is not just faster—it’s more
        precise, more transparent, and more respectful of resources.
      </p>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">What we optimize for</h2>
        <ul className="mt-4 space-y-3 text-zinc-400">
          <li>• Premium feel & fit</li>
          <li>• Durable, purposeful materials</li>
          <li>• Traceable, responsible production</li>
          <li>• Design that looks alive in motion</li>
        </ul>
      </section>
    </article>
  );
}

