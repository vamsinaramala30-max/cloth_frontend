import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Plasma Atelier',
  description: 'Learn how Plasma Atelier collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Privacy Policy
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        This Privacy Policy explains how Plasma Atelier collects, uses, and
        protects personal information when you visit our website and interact
        with our services.
      </p>

      <section className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-white font-semibold">What we collect</h2>
        <p className="text-zinc-400 leading-relaxed">
          Information you provide (such as contact details), and usage data (such
          as pages viewed) to improve the shopping experience.
        </p>

        <h2 className="text-white font-semibold">How we use it</h2>
        <p className="text-zinc-400 leading-relaxed">
          To process orders, provide customer support, and operate the site.
        </p>

        <h2 className="text-white font-semibold">Your choices</h2>
        <p className="text-zinc-400 leading-relaxed">
          You can request updates or corrections to your information where
          applicable, and manage certain preferences.
        </p>
      </section>
    </article>
  );
}

