'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/supabaseTypes';
import ProfileImageManager from '@/components/account/ProfileImageManager';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="mt-2 text-white font-semibold tracking-wide">{value}</div>
    </div>
  );
}

export default function AccountDashboardPage() {
  const { user, isLoading } = useSupabaseAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    let mounted = true;
    (async () => {
      try {
        setBusy(true);
        setError(null);

        const { data, error: dbError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (dbError) throw dbError;

        if (mounted) setProfile(data as Profile);
      } catch (e: any) {
        // If the profiles row doesn't exist yet, still allow UI skeleton.
        if (mounted) setError(e?.message || 'Failed to load profile');
      } finally {
        if (mounted) setBusy(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const headerStats = useMemo(() => {
    return [
      { label: 'Loyalty Tier', value: profile?.loyalty_tier ? String(profile.loyalty_tier) : '—' },
      { label: 'Reward Points', value: profile?.reward_points != null ? String(profile.reward_points) : '—' },
      { label: 'Member Since', value: profile?.member_since ? String(profile.member_since) : '—' },
      { label: 'Total Orders', value: profile?.total_orders != null ? String(profile.total_orders) : '—' },
      { label: 'Total Spend', value: profile?.total_spend != null ? `$${Number(profile.total_spend).toLocaleString()}` : '—' },
    ];
  }, [profile]);

  if (isLoading) {
    return (
      <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-400">
            Loading your profile…
          </motion.div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-4xl md:text-6xl font-light tracking-[0.1em] text-white uppercase mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Your Account
          </motion.h1>
          <div className="text-zinc-400">Please sign in to access your luxury dashboard.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-8 z-20">
      {/* Luxury glass header */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="p-6 md:p-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden relative"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-cyan-400/40 to-purple-400/30 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-purple-500/25 to-cyan-400/20 blur-3xl" />
          </div>

          <div className="relative">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-start lg:justify-between">
              <div>
                <motion.h1
                  className="text-4xl md:text-6xl font-light tracking-[0.1em] text-white uppercase"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Profile
                </motion.h1>
                <div className="mt-3 text-zinc-300/90 text-sm md:text-base tracking-wide">
                  Rare Rab It — luxury customer dashboard
                </div>

                {error ? (
                  <div className="mt-4 text-sm text-red-200 bg-red-500/10 border border-red-400/20 rounded-lg px-4 py-2">
                    {error}
                  </div>
                ) : null}
              </div>

              <div className="w-full lg:max-w-md">
                <ProfileImageManager
                  userId={userId}
                  avatarUrl={profile?.avatar_url ?? null}
                  onAvatarUpdated={(url) => {
                    setProfile((p) => (p ? { ...p, avatar_url: url } : p));
                  }}
                />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {headerStats.map((s) => (
                <Stat key={s.label} label={s.label} value={busy ? '—' : s.value} />
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
              <div className="text-xs text-zinc-400">Navigation</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  'Orders',
                  'Wishlist',
                  'Rewards',
                  'Coupons',
                  'Notifications',
                  'Addresses',
                  'Settings',
                  'Payment Methods',
                ].map((t) => (
                  <button
                    key={t}
                    className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition-all text-xs md:text-sm text-white"
                    onClick={() => {
                      // Placeholder navigation until modules are wired.
                      // UI stays premium; routing for each module will be added next.
                      console.info('Navigate:', t);
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-xs text-zinc-500">
                Next step: implement each module connected to Supabase (realtime where applicable).
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

