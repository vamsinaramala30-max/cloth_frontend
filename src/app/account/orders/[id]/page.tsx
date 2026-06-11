'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

import { fetchAPI } from '@/lib/api';

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Backend only has /api/orders/history right now.
        // This additive UI therefore attempts to find the order within history.
        const resp = await fetchAPI<any>('/api/orders/history', { method: 'GET' });
        const data = resp.data?.data ?? resp.data;
        const list = Array.isArray(data) ? data : data?.data ?? [];

        const found = (list || []).find((o: any) => String(o._id || o.orderId) === String(id));
        if (mounted) setOrder(found || null);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : 'Failed to load order');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20">
        <div className="max-w-7xl mx-auto text-zinc-400">Loading order…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20">
        <div className="max-w-7xl mx-auto text-red-300">{error}</div>
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
          Order Tracking
        </motion.h1>

        {order ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="p-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-6 tracking-[0.1em]">Order Info</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Order ID</span>
                  <span className="text-white font-medium">{order._id || order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status</span>
                  <span className="text-white font-medium">{order.orderStatus || order.status || 'pending'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total</span>
                  <span className="text-white font-medium">
                    ${Number(order.financials?.total ?? order.total ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-bold tracking-[0.2em] text-white uppercase mb-4">Timeline</h3>

                <ol className="space-y-3">
                  {[
                    'Order Received',
                    'Order Confirmed',
                    'Packed',
                    'Ready To Dispatch',
                    'Dispatched',
                    'In Transit',
                    'Out For Delivery',
                    'Delivered',
                  ].map((label, idx) => {
                    const status = idx <= 1 ? 'active' : 'inactive';
                    return (
                      <li key={label} className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-400/70" />
                        <div className="text-sm text-zinc-300">{label}</div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </section>

            <aside className="p-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-6 tracking-[0.1em]">Shipping & Tracking</h2>

              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-zinc-400">Tracking Number</div>
                  <div className="text-white font-medium">{order.trackingNumber || '—'}</div>
                </div>
                <div>
                  <div className="text-zinc-400">Estimated Delivery</div>
                  <div className="text-white font-medium">
                    {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : '—'}
                  </div>
                </div>

                <div>
                  <div className="text-zinc-400">Courier</div>
                  <div className="text-white font-medium">{order.courier || '—'}</div>
                </div>
              </div>

              <div className="mt-8 text-xs text-zinc-500 leading-relaxed">
                Timeline rendering currently uses static labels; production should map backend
                order status transitions to each step.
              </div>
            </aside>
          </div>
        ) : (
          <div className="text-zinc-400">Order not found in history.</div>
        )}
      </div>
    </div>
  );
}

