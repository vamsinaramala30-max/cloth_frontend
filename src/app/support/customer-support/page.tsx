import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Support | RARE RAB IT',
  description: 'Premium customer support designed for order help, returns guidance, and sizing assistance.',
};

export default function CustomerSupportPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Customer Support
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        For orders, returns, and product questions, our team helps you with
        fast, premium guidance.
      </p>

      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          ['Order help', '/support/order-tracking'],
          ['Returns & exchanges', '/support/returns-exchanges'],
          ['Sizing assistance', '/support/size-guide'],
          ['Shipping questions', '/support/shipping-information'],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <p className="text-white font-semibold">{label}</p>
            <p className="mt-2 text-zinc-400 text-sm">View details</p>
          </a>
        ))}
      </section>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-white font-semibold">Contact</h2>
        <p className="mt-3 text-zinc-400 leading-relaxed">
          Use the Contact Us page to send a message. We’ll respond with the
          fastest available assistance.
        </p>
        <a
          href="/support/contact-us"
          className="mt-5 inline-flex rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 text-black font-bold tracking-widest uppercase text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          Contact Us
        </a>
      </div>
    </article>
  );
}

