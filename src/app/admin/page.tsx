'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import config from '@/config/env';

type AnalyticsResponse = {
  success: boolean;
  analytics?: {
    revenue?: number;
    salesCount?: number;
    catalogSize?: number;
  };
  message?: string;
};

type NavKey =
  | 'dashboard'
  | 'users'
  | 'products'
  | 'orders'
  | 'analytics'
  | 'messages'
  | 'careers'
  | 'settings';

export default function AdminDashboardPage() {
  const router = useRouter();

  const [active, setActive] = useState<NavKey>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse['analytics'] | null>(null);

  const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_API_TOKEN || '';

  const nav = useMemo(
    () =>
      [
        { key: 'dashboard' as const, label: 'Dashboard' },
        { key: 'users' as const, label: 'Users' },
        { key: 'products' as const, label: 'Products' },
        { key: 'orders' as const, label: 'Orders' },
        { key: 'analytics' as const, label: 'Analytics' },
        { key: 'messages' as const, label: 'Messages' },
        { key: 'careers' as const, label: 'Careers' },
        { key: 'settings' as const, label: 'Settings' },
      ] as const,
    []
  );

  useEffect(() => {
    const load = async () => {

      setLoading(true);
      setError(null);
      try {
        if (!ADMIN_TOKEN) {
          throw new Error('Missing NEXT_PUBLIC_ADMIN_API_TOKEN (frontend env).');
        }

        // Backend admin analytics endpoint is expected under /api/admin/analytics
        // (If backend uses a different path in your build, update it here.)
        const url = `${config.apiUrl}/admin/analytics`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'x-admin-token': ADMIN_TOKEN,
          },
          credentials: 'include',
        });

        const body = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(body?.message || body?.error || 'Failed to load analytics');
        }

        setAnalytics(body?.analytics || null);
      } catch (e: any) {
        setError(e?.message || 'Unauthorized or analytics unavailable');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [ADMIN_TOKEN]);

  const logout = () => {
    // Admin token auth is server-token based, not cookie-based in this repo.
    // Send user back to home.
    router.replace('/');
  };

  const Metric = ({ label, value }: { label: string; value: string }) => {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs uppercase tracking-widest text-zinc-400">{label}</div>
        <div className="mt-2 text-white text-2xl font-light">{value}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-72">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="mb-4">
                <div className="text-white font-semibold tracking-wide">Admin</div>
                <div className="text-xs text-zinc-500 mt-1">Secure enterprise control panel</div>
              </div>

              <nav className="space-y-2">
                <button
                  type="button"
                  onClick={() => router.push('/admin/dashboard')}
                  className={
                    'w-full text-left rounded-xl px-3 py-2 text-sm border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/15 transition'
                  }
                >
                  admin dashboard
                </button>

                {nav.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActive(item.key)}
                    className={
                      active === item.key
                        ? 'w-full text-left rounded-xl px-3 py-2 text-sm border border-cyan-400/30 bg-cyan-400/10 text-cyan-200'
                        : 'w-full text-left rounded-xl px-3 py-2 text-sm border border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
                    }
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full rounded-xl px-3 py-2 text-sm border border-white/10 bg-black/20 text-zinc-200 hover:bg-white/5 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <section className="flex-1 min-w-0">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-zinc-400">Dashboard</div>
                  <h1 className="mt-2 text-white text-3xl font-light tracking-wide">
                    {active === 'dashboard' ? 'Overview' : nav.find((n) => n.key === active)?.label}
                  </h1>
                  <p className="text-zinc-400 text-sm mt-2">
                    Real analytics from backend orders/products. Admin access requires NEXT_PUBLIC_ADMIN_API_TOKEN.
                  </p>
                </div>

                {/* Mobile quick nav */}
                <div className="md:hidden">
                  <div className="flex flex-wrap gap-2">
                    {nav.slice(0, 4).map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setActive(item.key)}
                        className={
                          active === item.key
                            ? 'rounded-xl px-3 py-2 text-xs border border-cyan-400/30 bg-cyan-400/10 text-cyan-200'
                            : 'rounded-xl px-3 py-2 text-xs border border-white/10 bg-black/20 text-zinc-300 hover:text-white'
                        }
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="mt-8 text-zinc-400 text-sm">Loading analytics…</div>
              ) : error ? (
                <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-200 text-sm">
                  {error}
                </div>
              ) : (
                <div className="mt-8">
                  {analytics ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Metric
                        label="Revenue (paid)"
                        value={`$${Number(analytics.revenue || 0).toLocaleString()}`}
                      />
                      <Metric
                        label="Sales (paid orders)"
                        value={`${Number(analytics.salesCount || 0).toLocaleString()}`}
                      />
                      <Metric
                        label="Catalog size"
                        value={`${Number(analytics.catalogSize || 0).toLocaleString()}`}
                      />
                    </div>
                  ) : (
                    <div className="mt-2 text-zinc-400 text-sm">No analytics data available.</div>
                  )}

                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-zinc-300 text-sm font-semibold">Quick actions</div>
                      <div className="mt-3 flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => router.push('/admin/products')}
                          className="rounded-xl px-4 py-2 text-sm border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/15 transition"
                        >
                          Manage Products
                        </button>
                        <button
                          type="button"
                          onClick={() => setActive('analytics')}
                          className="rounded-xl px-4 py-2 text-sm border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 transition"
                        >
                          View Analytics
                        </button>
                      </div>
                      <div className="mt-3 text-xs text-zinc-500">
                        Additional sections (Users/Orders/Messages/etc.) require backend endpoints that are not wired in this repo build.
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-zinc-300 text-sm font-semibold">Security</div>
                      <div className="mt-2 text-xs text-zinc-500">
                        Admin access uses backend token header: <code className="text-zinc-300">x-admin-token</code>.
                        If unauthorized, check <code className="text-zinc-300">NEXT_PUBLIC_ADMIN_API_TOKEN</code> in frontend env.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

