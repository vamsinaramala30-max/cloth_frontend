import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story | Plasma Atelier',
  description:
    'Discover the genesis of Plasma Atelier—luxury fashion crafted with technology, precision, and soul.',
  openGraph: {
    title: 'Our Story | Plasma Atelier',
    description:
      'Discover the genesis of Plasma Atelier—luxury fashion crafted with technology, precision, and soul.',
    type: 'website',
  },
};

export default function OurStoryPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Our Story
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        Plasma Atelier was born from a simple conviction: luxury should feel both
        timeless and inevitable—like craftsmanship you can wear, and innovation
        you can trust.
      </p>

      <p className="mt-5 text-zinc-400 leading-relaxed">
        We design in layers: silhouette, material behavior, movement, and the
        emotional temperature of the garment—so each piece carries a cinematic
        presence while staying unmistakably human.
      </p>

      <p className="mt-5 text-zinc-400 leading-relaxed">
        From atelier-level tailoring to smart production workflows, every stage
        is guided by precision and restraint. The result is a wardrobe that
        doesn’t chase trends—it defines them.
      </p>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Plasma Atelier, in one line</h2>
        <p className="mt-3 text-zinc-400 leading-relaxed">
          Luxury fashion crafted where premium craftsmanship meets fashion-tech
          imagination.
        </p>
      </section>
    </article>
  );
}

