import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Press & Media | RARE RAB IT',
  description:
    'Latest press notes, editorial features, and brand media highlights from RARE RAB IT.',
  openGraph: {
    title: 'Press & Media | RARE RAB IT',
    description:
      'Latest press notes, editorial features, and brand media highlights from RARE RAB IT.',
    type: 'website',
  },
};

export default function PressMediaPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Press & Media
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        RARE RAB IT appears where fashion meets future-thinking—editorials,
        interviews, and showcases built for audiences who value precision and
        originality.
      </p>

      <section className="mt-10 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Media kit</h2>
          <p className="mt-2 text-zinc-400 leading-relaxed">
            Request brand assets, images, and official copy for editorial use.
            (Hook this up to your PR workflow when ready.)
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Featured stories</h2>
          <p className="mt-2 text-zinc-400 leading-relaxed">
            Coming soon: press highlights and publication references.
          </p>
        </div>
      </section>
    </article>
  );
}

