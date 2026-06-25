import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Plasma Atelier',
  description: 'Learn how Plasma Atelier uses cookies to enhance your experience and measure performance.',
};

export default function CookiePolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Cookie Policy
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        Cookies are small files stored on your device. They help us deliver
        features, remember preferences, and analyze how the site is used.
      </p>

      <section className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-white font-semibold">Types of cookies</h2>
        <p className="text-zinc-400 leading-relaxed">
          We may use essential cookies, analytics cookies, and preference
          cookies depending on your settings.
        </p>
      </section>
    </article>
  );
}

