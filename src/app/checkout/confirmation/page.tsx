'use client';

import React, { Suspense } from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

function CheckoutConfirmationPageInner() {
  const params = useSearchParams();
  const router = useRouter();

  // NOTE: keep this component client-only, but Next requires suspense for
  // useSearchParams during static prerender.
  const orderId = params.get('orderId');
  const clientSecret = params.get('clientSecret');

  return (
    <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl md:text-6xl font-light tracking-[0.1em] text-white uppercase mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Order Confirmation
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="p-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-4 tracking-[0.1em]">Thank you</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Your order has been placed. Below details are shown as confirmation metadata.
              A real production implementation should reconcile Stripe webhook → order status.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Order ID</span>
                <span className="text-white font-medium">{orderId || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Payment Intent</span>
                <span className="text-white font-medium">{clientSecret ? 'Created' : '—'}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold tracking-widest uppercase rounded-lg hover:shadow-lg hover:shadow-cyan-400/50 transition-all"
                onClick={() => router.push('/account/orders')}
              >
                Track Order
              </button>

              <Link href="/shop">
                <button className="px-6 py-3 border border-white/30 text-white font-bold tracking-widest uppercase rounded-lg hover:border-white/60 transition-all">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </section>

          <aside className="p-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
            <h3 className="text-sm font-bold tracking-[0.2em] text-white uppercase mb-4">Next Steps</h3>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li>✓ Payment intent created</li>
              <li>✓ Order confirmation page shown</li>
              <li>✓ Tracking will show when backend updates statuses</li>
            </ul>

            <div className="mt-8">
              <p className="text-xs text-zinc-500 leading-relaxed">
                If tracking does not update, ensure backend order status transitions are wired to Stripe webhooks.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutConfirmationPage() {
  return (
    <Suspense fallback={<div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20" />}> 
      <CheckoutConfirmationPageInner />
    </Suspense>
  );
}

