'use client';

import React, { useMemo } from 'react';
import { useAuthStore } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/account/DashboardLayout';
import { User, ShoppingBag, Heart, MapPin } from 'lucide-react';

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:border-cyan-400/20 hover:bg-white/[0.05] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{label}</span>
        <Icon className="h-4 w-4 text-zinc-600 group-hover:text-cyan-400/60 transition-colors" />
      </div>
      <div className="text-white text-xl font-light tracking-wider">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</span>
      <span className="text-white text-sm font-light">{value || '—'}</span>
    </div>
  );
}

export default function AccountDashboardClient() {
  const { user, isLoading } = useAuthStore();

  const stats = useMemo(() => [
    { label: 'Account Role', value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—', icon: User },
    { label: 'Saved Items', value: user?.wishlist ? String(user.wishlist.length) : '0', icon: Heart },
    { label: 'Saved Addresses', value: user?.addresses ? String(user.addresses.length) : '0', icon: MapPin },
    { label: 'Orders', value: '—', icon: ShoppingBag },
  ], [user]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <DashboardLayout title="Profile" subtitle="Manage your account profile and statistics">
      <div className="space-y-10">

        {/* Avatar + Personal Details */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="shrink-0 flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-400/10" />
              <User className="h-10 w-10 text-zinc-400 relative z-10" />
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Avatar</span>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-5">
            <div>
              <h3 className="text-sm font-light text-white uppercase tracking-widest mb-4 pb-2 border-b border-white/10">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InfoRow label="Full Name" value={user?.name} />
                <InfoRow label="Email Address" value={user?.email} />
                <InfoRow label="Account Role" value={user?.role} />
                <InfoRow label="Verified" value={user?.isVerified ? 'Yes' : 'No'} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="border-t border-white/10 pt-8">
          <h3 className="text-sm font-light text-white uppercase tracking-widest mb-5">
            Account Overview
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
            ))}
          </div>
        </div>

        {/* Addresses */}
        {user?.addresses && user.addresses.length > 0 && (
          <div className="border-t border-white/10 pt-8">
            <h3 className="text-sm font-light text-white uppercase tracking-widest mb-5">
              Saved Addresses
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.addresses.map((addr, i) => (
                <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-semibold">{addr.label}</span>
                  <p className="text-sm text-zinc-300 font-light">{addr.street}</p>
                  <p className="text-xs text-zinc-500">{addr.city}, {addr.country}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
