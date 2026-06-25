import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Exchanges | Plasma Atelier',
  description:
    'Return eligibility, process, refund timelines, and exchange policy for Plasma Atelier.',
};

export default function ReturnsExchangesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Returns & Exchanges
      </h1>

      <section className="mt-8 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-white font-semibold">Return eligibility</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Returns are accepted within the return window for eligible items.
            Items must be unworn, unaltered, and in original condition.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-white font-semibold">Return process</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Start your return request with customer support. We’ll provide
            instructions and confirm shipping details.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-white font-semibold">Refund timeline</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Refunds are processed after the return is received and inspected.
            Timing depends on payment method and destination.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-white font-semibold">Exchange policy</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Exchanges are subject to stock availability. If an item is not
            available, a refund may be offered.
          </p>
        </div>
      </section>
    </article>
  );
}

