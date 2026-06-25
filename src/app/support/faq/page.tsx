import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Plasma Atelier',
  description:
    'Luxury fashion support FAQs covering shipping, returns, sizing, orders, payments, care, and international delivery.',
};

const faqs = [
  {
    q: 'Shipping: How fast is delivery?',
    a: 'Delivery timelines depend on destination and availability. After shipment, tracking is provided so you can follow your order in real time.',
  },
  {
    q: 'Returns: Am I eligible to return?',
    a: 'Most items can be returned within the return window if they are unworn, unaltered, and in original condition. Final eligibility depends on item type.',
  },
  {
    q: 'Sizing: How do I choose the right fit?',
    a: 'Use our Size Guide for measurements and fit notes. If you’re between sizes, we recommend sizing based on your preferred garment feel.',
  },
  {
    q: 'Orders: Can I change or cancel?',
    a: 'If your order hasn’t shipped, changes may be possible. Contact support as early as possible for the best outcome.',
  },
  {
    q: 'Payments: Which payment methods are supported?',
    a: 'We support standard card payments and other payment options shown at checkout. Payment authorization occurs before shipment.',
  },
  {
    q: 'Product Care: How should I care for my pieces?',
    a: 'Follow care instructions on the product label. When in doubt, choose gentle handling to preserve structure and finish.',
  },
  {
    q: 'International Delivery: Do you ship worldwide?',
    a: 'International delivery availability depends on location. When available, duties/taxes are handled according to destination rules.',
  },
];

export default function FaqPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Frequently Asked Questions
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        Premium answers, straight to the point.
      </p>

      <section className="mt-10 space-y-4">
        {faqs.map((item) => (
          <div key={item.q} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-white font-semibold">{item.q}</h2>
            <p className="mt-3 text-zinc-400 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </section>
    </article>
  );
}

