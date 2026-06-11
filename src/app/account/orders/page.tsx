'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { fetchAPI } from '@/lib/api';
import { useAuthStore } from '@/hooks/useAuth';


export default function AccountOrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  const [orders, setOrders] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // Backend: GET /api/orders/history (auth required)
        const resp = await fetchAPI<any>('/api/orders/history', { method: 'GET' });
        const data = resp.data?.data ?? resp.data?.success ? resp.data : resp.data;
        const list = data?.data ?? data?.orders ?? resp.data?.data ?? [];

        if (mounted) setOrders(Array.isArray(list) ? list : []);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : 'Failed to load orders');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl md:text-6xl font-light tracking-[0.1em] text-white uppercase mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Your Orders
        </motion.h1>

        {error ? (
          <div className="mb-8 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">{error}</div>
        ) : null}

        {loading ? (
          <div className="text-zinc-400">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="text-zinc-400">No orders yet.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((o: any) => {
              const id = o._id || o.orderId;
              const status = o.orderStatus || o.status || 'pending';
              const total = o.financials?.total ?? o.total ?? 0;
              return (
                <motion.div
                  key={id}
                  className="p-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="text-sm text-zinc-400">Order</div>
                      <div className="text-white font-medium">{id}</div>
                    </div>

                    <div>
                      <div className="text-sm text-zinc-400">Status</div>
                      <div className="text-white font-medium">{status}</div>
                    </div>

                    <div>
                      <div className="text-sm text-zinc-400">Total</div>
                      <div className="text-white font-medium">${Number(total).toLocaleString()}</div>
                    </div>

                    <div>
                      <Link href={`/account/orders/${id}`}>
                        <button className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold tracking-widest uppercase rounded-lg text-xs hover:shadow-lg hover:shadow-cyan-400/50 transition-all">
                          View & Track
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

