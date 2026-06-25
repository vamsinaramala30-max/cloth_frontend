import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center | Plasma Atelier',
  description:
    'Find fast answers for orders, sizing, returns, and delivery. Designed for a premium customer experience.',
};

export default function HelpCenterPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Help Center
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        Everything you need—clearly organized. Choose a topic below to get
        premium support, quickly.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          ['FAQ', '/support/faq'],
          ['Shipping Information', '/support/shipping-information'],
          ['Returns & Exchanges', '/support/returns-exchanges'],
          ['Size Guide', '/support/size-guide'],
          ['Order Tracking', '/support/order-tracking'],
          ['Customer Support', '/support/customer-support'],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <p className="text-white font-semibold">{label}</p>
            <p className="mt-2 text-zinc-400 text-sm">Open the details</p>
          </a>
        ))}
      </div>
    </article>
  );
}

