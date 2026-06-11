'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/hooks/useAuth';

import { getCartLines } from '@/lib/services/cartService';
import { fetchAPI, API_ENDPOINTS } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [customerInfo, setCustomerInfo] = useState({ fullName: '', email: '', phone: '' });
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<'stripe'>('stripe');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const lines = await getCartLines();
        if (mounted) setItems(lines);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : 'Failed to load cart');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const subtotal = items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
  const tax = Math.round(subtotal * 0.1);
  const shipping = items.length ? 100 : 0;
  const total = subtotal + tax + shipping;

  const canSubmit =
    customerInfo.fullName &&
    customerInfo.email &&
    shippingAddress.street &&
    shippingAddress.city &&
    shippingAddress.state &&
    shippingAddress.postalCode;

  const createOrderWithPayment = async () => {
    // Backend in this repo currently exposes a Stripe payment-intent creator
    // at POST /api/payment/stripe.
    // Order creation + persistence is handled elsewhere in the modular router,
    // but this page is built to be additive and resilient.
    const paymentResponse = await fetchAPI<any>(`${API_ENDPOINTS.PAYMENT ?? '/api/payment/stripe'}`, {
      method: 'POST',
      body: JSON.stringify({ totalAmount: total }),
    });

    if (paymentResponse.error) {
      throw new Error(paymentResponse.error);
    }

    // Redirect to confirmation with lightweight payload.
    // If your modular backend returns orderId/clientSecret, we will display them in confirmation.
    const orderId = paymentResponse.data?.orderId ?? null;
    const clientSecret = paymentResponse.data?.clientSecret ?? null;

    router.push(`/checkout/confirmation?orderId=${orderId ?? ''}&clientSecret=${encodeURIComponent(clientSecret ?? '')}`);
  };

  const onPlaceOrder = async () => {

    try {
      setSubmitting(true);
      setError(null);

      if (!canSubmit) {
        setError('Please complete customer information and shipping address.');
        return;
      }

      if (!items.length) {
        setError('Your cart is empty.');
        return;
      }

      if (paymentMethod === 'stripe') {
        await createOrderWithPayment();
        return;
      }

      setError('Unsupported payment method in this environment.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-400">Loading checkout…</motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl md:text-6xl font-light tracking-[0.1em] text-white uppercase mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Checkout
        </motion.h1>

        {error ? <div className="mb-8 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">{error}</div> : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="p-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-6 tracking-[0.1em]">Customer Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-2 block">Full Name</label>
                  <input
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo((s) => ({ ...s, fullName: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-2 block">Email</label>
                  <input
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo((s) => ({ ...s, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    placeholder="john@email.com"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-2 block">Phone</label>
                <input
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo((s) => ({ ...s, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  placeholder="Optional"
                />
              </div>
            </section>

            <section className="p-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-6 tracking-[0.1em]">Shipping Address</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-2 block">Street</label>
                  <input
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress((s) => ({ ...s, street: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    placeholder="221B Baker Street"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-2 block">City</label>
                  <input
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress((s) => ({ ...s, city: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-2 block">State</label>
                  <input
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress((s) => ({ ...s, state: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-2 block">Postal Code</label>
                  <input
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress((s) => ({ ...s, postalCode: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-2 block">Country</label>
                  <input
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress((s) => ({ ...s, country: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    placeholder="United States"
                  />
                </div>
              </div>
            </section>

            <section className="p-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-6 tracking-[0.1em]">Payment Method</h2>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`px-4 py-3 rounded-lg border transition-all ${
                    paymentMethod === 'stripe' ? 'border-cyan-400 bg-cyan-400/10 text-white' : 'border-white/20 text-zinc-300 hover:border-white/40'
                  }`}
                >
                  Stripe
                </button>
              </div>
            </section>
          </div>

          <aside className="h-fit p-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm sticky top-40">
            <h2 className="text-lg font-bold text-white mb-6 tracking-[0.1em]">Order Review</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
              <div className="text-sm flex justify-between">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-white">${subtotal.toLocaleString()}</span>
              </div>
              <div className="text-sm flex justify-between">
                <span className="text-zinc-400">Tax</span>
                <span className="text-white">${tax.toLocaleString()}</span>
              </div>
              <div className="text-sm flex justify-between">
                <span className="text-zinc-400">Shipping</span>
                <span className="text-white">${shipping.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-2xl font-bold text-cyan-400">${total.toLocaleString()}</span>
            </div>

            <motion.button
              onClick={onPlaceOrder}
              disabled={submitting || !items.length}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold tracking-widest uppercase rounded-lg mb-4 hover:shadow-lg hover:shadow-cyan-400/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={submitting ? undefined : { scale: 1.02 }}
              whileTap={submitting ? undefined : { scale: 0.98 }}
            >
              {submitting ? 'Processing…' : 'Place Order'}
            </motion.button>

            <Link href="/cart">
              <motion.button
                className="w-full px-6 py-3 border border-white/30 text-white font-bold tracking-widest uppercase rounded-lg hover:border-white/60 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back to Bag
              </motion.button>
            </Link>

            <div className="mt-8 space-y-2 text-[10px] text-zinc-500 text-center">
              <p>✓ Secure payment intent</p>
              <p>✓ Order confirmation page</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

