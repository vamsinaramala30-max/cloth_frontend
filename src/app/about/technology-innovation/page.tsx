import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technology & Innovation | Plasma Atelier',
  description:
    'Explore how fashion-tech supports precision design, improved production workflows, and the future of luxury.',
  openGraph: {
    title: 'Technology & Innovation | Plasma Atelier',
    description:
      'Explore how fashion-tech supports precision design, improved production workflows, and the future of luxury.',
    type: 'website',
  },
};

export default function TechnologyInnovationPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Technology & Innovation
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        Our technology is not replacing craftsmanship—it amplifies it. We use
        data-informed design exploration and smarter production planning to
        reduce rework, improve consistency, and unlock new creative forms.
      </p>

      <p className="mt-5 text-zinc-400 leading-relaxed">
        Innovation becomes meaningful when it makes the garment better: more
        precise fit, more stable materials, and a smoother path from concept
        to couture.
      </p>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Where it helps</h2>
        <ul className="mt-4 space-y-3 text-zinc-400">
          <li>• Precision design iteration</li>
          <li>• Consistency in production workflows</li>
          <li>• Smarter planning to reduce waste</li>
          <li>• Creative exploration for editorial impact</li>
        </ul>
      </section>
    </article>
  );
}

