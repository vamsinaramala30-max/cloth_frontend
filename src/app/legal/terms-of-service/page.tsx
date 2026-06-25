import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Plasma Atelier',
  description: 'Official Terms of Service for using the Plasma Atelier website and purchasing.',
};

export default function TermsOfServicePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Terms of Service
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        Welcome to Plasma Atelier. By using our website, you agree to these Terms
        of Service.
      </p>

      <section className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-white font-semibold">Orders and availability</h2>
        <p className="text-zinc-400 leading-relaxed">
          Product availability, pricing, and delivery timelines may vary.
        </p>

        <h2 className="text-white font-semibold">Account & security</h2>
        <p className="text-zinc-400 leading-relaxed">
          You’re responsible for maintaining the confidentiality of your account
          credentials.
        </p>

        <h2 className="text-white font-semibold">Limitation of liability</h2>
        <p className="text-zinc-400 leading-relaxed">
          To the fullest extent permitted by law, Plasma Atelier is not liable for
          indirect or consequential damages.
        </p>
      </section>
    </article>
  );
}

