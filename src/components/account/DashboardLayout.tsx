'use client';

import React, { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuth';
import { useAuthActions } from '@/hooks/useAuthActions';
import { ChevronRight, LogOut, Package, User, Heart, Settings } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
}

export function DashboardLayout({ children, title, subtitle, headerAction }: DashboardLayoutProps) {
  const { user, isLoading } = useAuthStore();
  const { handleLogout } = useAuthActions();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const NAV_ITEMS = [
    { label: 'Profile', href: '/account', icon: User },
    { label: 'Settings', href: '/account/settings', icon: Settings },
    { label: 'Orders', href: '/account/orders', icon: Package },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
  ];

  return (
    <div className="min-h-[85vh] bg-transparent text-white pt-24 pb-16">
      <main className="container-luxe px-4 md:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs text-zinc-400 mb-8 overflow-x-auto whitespace-nowrap uppercase tracking-widest">
          <Link href="/" className="hover:text-cyan-400 transition-colors font-medium">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 mx-2 opacity-50 shrink-0" />
          {pathname !== '/account' ? (
            <>
              <Link href="/account" className="hover:text-cyan-400 transition-colors font-medium">
                Account
              </Link>
              <ChevronRight className="h-3 w-3 mx-2 opacity-50 shrink-0" />
              <span className="text-white font-semibold">{title}</span>
            </>
          ) : (
            <span className="text-white font-semibold">Account</span>
          )}
        </nav>

        {/* Dashboard Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <div className="p-6 border border-white/10 rounded-2xl bg-white/[0.03] backdrop-blur-md mb-4">
              <div className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Welcome back,</div>
              <div className="text-lg font-light text-white truncate">{user.name || user.email}</div>
            </div>

            <div className="flex flex-col space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs uppercase tracking-widest font-medium transition-all ${
                      active
                        ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-400'
                        : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}

              <button
                onClick={async () => {
                  await handleLogout();
                  router.push('/login');
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent text-xs uppercase tracking-widest font-medium text-red-400 hover:bg-red-500/10 transition-all text-left w-full"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-3">
            <div className="p-6 md:p-8 border border-white/10 rounded-2xl bg-white/[0.04] backdrop-blur-md relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-400/30 to-purple-400/20 blur-3xl" />
              </div>

              <div className="relative">
                {title && (
                  <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                      <h1 className="text-3xl font-light tracking-wider text-white">{title}</h1>
                      {subtitle && <p className="text-xs text-zinc-400 tracking-wider mt-2">{subtitle}</p>}
                    </div>
                    {headerAction && <div className="shrink-0">{headerAction}</div>}
                  </div>
                )}
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
