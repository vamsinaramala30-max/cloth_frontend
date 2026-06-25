import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Intellectual Property Notice | Plasma Atelier',
  description: 'Legal notice regarding trademarks, copyrights, and intellectual property rights.',
};

export default function IntellectualPropertyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Intellectual Property Notice
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        All content on this website, including trademarks, designs, text, graphics,
        and logos, is owned by Plasma Atelier or used with permission.
      </p>

      <section className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-white font-semibold">Copyright</h2>
        <p className="text-zinc-400 leading-relaxed">
          Unauthorized reproduction or distribution of materials is prohibited.
        </p>

        <h2 className="text-white font-semibold">Trademarks</h2>
        <p className="text-zinc-400 leading-relaxed">
          Plasma Atelier marks may not be used without express written permission.
        </p>
      </section>
    </article>
  );
}

