'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import config from '@/config/env';
import { type Product } from '@/lib/api';

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_API_TOKEN || '';

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');

      try {
        if (!ADMIN_TOKEN) {
          throw new Error('Missing NEXT_PUBLIC_ADMIN_API_TOKEN in frontend env');
        }

        const res = await fetch(`${config.apiUrl}/admin/products?limit=50&page=1`, {
          method: 'GET',
          headers: { 'x-admin-token': ADMIN_TOKEN },
          credentials: 'include',
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(body?.message || body?.error || 'Failed to load products');
        }

        setItems(body?.data || []);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Failed to load products');
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const rows = useMemo(() => items || [], [items]);

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6 gap-4">
          <div>
            <h1 className="text-white text-3xl md:text-4xl font-light tracking-wider">Products</h1>
            <p className="text-zinc-500 text-sm mt-2">Owner-only list via /api/admin/products</p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-200 hover:bg-cyan-400/15 transition"
          >
            + Add Product
          </Link>
        </div>

        {error ? <div className="mb-4 text-red-400 text-sm">{error}</div> : null}

        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs text-zinc-400 uppercase tracking-wider border-b border-white/10">
            <div className="col-span-5">Name</div>
            <div className="col-span-3">Category</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {loading ? (
            <div className="px-4 py-10 text-zinc-500 text-sm">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="px-4 py-10 text-zinc-500 text-sm">No products found.</div>
          ) : (
            <div className="divide-y divide-white/10">
              {rows.map((p) => {
                const price = (p.salePrice ?? p.basePrice) as number;
                return (
                  <div
                    key={p._id}
                    className="grid grid-cols-12 gap-2 px-4 py-4 items-center text-sm"
                  >
                    <div className="col-span-5">
                      <div className="text-white font-medium">{p.name}</div>
                      <div className="text-zinc-500 text-xs">{p.slug}</div>
                    </div>
                    <div className="col-span-3 text-zinc-300">{p.category}</div>
                    <div className="col-span-2 text-white">${Number(price || 0).toLocaleString()}</div>
                    <div className="col-span-2 text-right">
                      {/* Edit/Delete not implemented (backend endpoints missing) */}
                      <span className="text-zinc-500 text-xs">Edit coming soon</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}