import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Tracking | Plasma Atelier',
  description: 'Track your order with premium support—find dispatch updates and shipment status information.',
};

export default function OrderTrackingPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Order Tracking
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        Once your order ships, you’ll receive tracking details. If you don’t
        see updates immediately, allow time for carrier scans.
      </p>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-white font-semibold">Need help?</h2>
        <p className="mt-3 text-zinc-400 leading-relaxed">
          Contact customer support and share your order ID.
        </p>
        <a
          href="/support/contact-us"
          className="mt-5 inline-flex rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 text-black font-bold tracking-widest uppercase text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          Contact Us
        </a>
      </section>
    </article>
  );
}

