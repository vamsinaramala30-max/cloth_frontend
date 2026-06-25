import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Information | Plasma Atelier',
  description:
    'Delivery methods, timelines, international shipping, tracking, and shipping costs for Plasma Atelier.',
};

export default function ShippingInformationPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Shipping Information
      </h1>

      <section className="mt-8 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-white font-semibold">Delivery methods</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Orders are dispatched using secure carriers with tracking. Delivery
            options shown at checkout reflect the fastest available service for
            your region.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-white font-semibold">Timelines</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Processing times vary by item availability. After shipment, you’ll
            receive a tracking update so you can monitor progress.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-white font-semibold">International shipping</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            We ship internationally where available. Duties and taxes (if
            applicable) depend on destination rules.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-white font-semibold">Tracking information</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Tracking is provided after dispatch. If tracking updates are delayed,
            allow additional time for carrier scans.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-white font-semibold">Shipping costs</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Shipping costs are calculated at checkout based on destination and
            order details.
          </p>
        </div>
      </section>
    </article>
  );
}

