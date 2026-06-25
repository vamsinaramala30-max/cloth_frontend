import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility Statement | Plasma Atelier',
  description: 'Plasma Atelier accessibility statement—our commitment to inclusive design.',
};

export default function AccessibilityStatementPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Accessibility Statement
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        Plasma Atelier is committed to making our website accessible to all users,
        including people with disabilities.
      </p>

      <section className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-white font-semibold">How we support accessibility</h2>
        <p className="text-zinc-400 leading-relaxed">
          We apply accessible design practices, keyboard navigation support, and
          semantic markup to improve usability.
        </p>
      </section>
    </article>
  );
}

