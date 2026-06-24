'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import RobustImage from '@/components/RobustImage';
import { IMAGE_MAP } from '@/lib/images';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

import { GlassCard } from '@/components/GlassCard';
import Logo from '@/components/Logo';

import { useAuthStore } from '@/hooks/useAuth';
import { useAuthActions } from '@/hooks/useAuthActions';
import * as api from '@/lib/api';
import { cn } from '@/lib/utils';

const DynamicAuthFlow = dynamic(() => import('@/components/auth/DynamicAuthFlow'), {
  ssr: false,
});

type Mode = 'login' | 'register';

type ToastKind = 'success' | 'error' | 'info';

function strengthScore(pw: string) {
  const s = pw || '';
  let score = 0;
  if (s.length >= 8) score += 1;
  if (s.length >= 12) score += 1;
  if (/[A-Z]/.test(s)) score += 1;
  if (/[0-9]/.test(s)) score += 1;
  if (/[^A-Za-z0-9]/.test(s)) score += 1;
  return Math.min(5, score);
}

function strengthLabel(score: number) {
  if (score <= 1) return { label: 'Weak', color: 'from-red-500/70 to-red-300/40' };
  if (score === 2) return { label: 'Fair', color: 'from-amber-500/70 to-amber-300/40' };
  if (score === 3) return { label: 'Good', color: 'from-cyan-500/70 to-cyan-300/40' };
  if (score === 4) return { label: 'Strong', color: 'from-purple-500/70 to-purple-300/40' };
  return { label: 'Excellent', color: 'from-amber-300/70 to-amber-100/40' };
}

export default function PremiumAuthPage() {
  const router = useRouter();

  const { user } = useAuthStore();
  const { handleLogin, handleRegister } = useAuthActions();

  const [mode, setMode] = useState<Mode>('login');

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginRemember, setLoginRemember] = useState(true);

  // Register
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerShowPassword, setRegisterShowPassword] = useState(false);
  const [registerShowConfirmPassword, setRegisterShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // OTP / Google selection
  const [loginSubView, setLoginSubView] = useState<'email' | 'otp' | 'google'>('email');

  // UI state
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ kind: ToastKind; title: string; message?: string } | null>(
    null
  );

  const registerStrength = useMemo(() => strengthScore(registerPassword), [registerPassword]);
  const registerStrengthMeta = useMemo(
    () => strengthLabel(registerStrength),
    [registerStrength]
  );

  const redirectAuthenticated = useCallback(() => {
    // Keep it safe: dashboard route may be /dashboard; fallback to /
    const target = '/dashboard';
    router.replace(target);
  }, [router]);

  useEffect(() => {
    // Preserve current session after refresh by fetching /account/me (cookie-based)
    // We avoid new/dummy endpoints and use the existing api.getMe().
    if (user) {
      redirectAuthenticated();
      return;
    }

    (async () => {
      try {
        const res = await api.getMe();
        if (res.data?.user) {
          redirectAuthenticated();
          return;
        }
      } catch {
        // ignore; unauthenticated user stays on /auth
      }
    })();
  }, [router, redirectAuthenticated, user]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const validateRegister = () => {
    if (!fullName.trim()) return 'Full name is required.';
    if (!registerEmail.trim()) return 'Email is required.';
    if (!phoneNumber.trim()) return 'Phone number is required.';

    // Backend only needs email/password/name, but we enforce the UI fields.
    if (registerPassword.length < 8) return 'Password must be at least 8 characters.';
    if (registerPassword !== registerConfirmPassword) return 'Passwords do not match.';
    if (!agreeTerms) return 'You must accept the Terms & Conditions.';
    if (!agreePrivacy) return 'You must accept the Privacy Policy.';
    return null;
  };

  const handleEmailLogin = async () => {
    if (!loginEmail.trim()) {
      setToast({ kind: 'error', title: 'Email is required' });
      return;
    }
    if (!loginPassword) {
      setToast({ kind: 'error', title: 'Password is required' });
      return;
    }

    setLoading(true);
    try {
      const ok = await handleLogin(loginEmail.trim(), loginPassword);
      if (!ok) {
        setToast({ kind: 'error', title: 'Login failed', message: 'Check your credentials and try again.' });
        return;
      }
      setToast({ kind: 'success', title: 'Welcome back.' });
      router.replace('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async () => {
    const v = validateRegister();
    if (v) {
      setToast({ kind: 'error', title: v });
      return;
    }

    setLoading(true);
    try {
      // Backend/register currently expects: (email, password, name)
      const ok = await handleRegister(registerEmail.trim(), registerPassword, fullName.trim());
      if (!ok) {
        setToast({ kind: 'error', title: 'Registration failed', message: 'Try again with valid details.' });
        return;
      }

      setToast({ kind: 'success', title: 'Account created.' });
      router.replace('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] md:min-h-screen flex">
      {/* Background */}
      <div className="absolute inset-0 bg-luxury-darker" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:42px_42px]" />

      {/* Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left banner */}
          <div className="hidden lg:flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Logo showText />
              </div>

              <h1 className="mt-6 text-4xl md:text-5xl font-light leading-[1.05] tracking-tight text-white">
                A darker kind of luxury.
              </h1>
              <p className="mt-4 text-zinc-400 max-w-lg">
                Glassmorphism comfort. Gold-accent precision. One session that keeps your momentum from
                refresh to checkout.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  { title: 'Secure Session', desc: 'Cookie-based auth stays alive across refresh.' },
                  { title: 'Multi-Method Login', desc: 'Email + OTP, with Google-ready flow UI.' },
                  { title: 'Premium UX', desc: 'Validation, loading states, and smooth animations.' },
                ].map((f) => (
                  <div key={f.title} className="flex gap-3 items-start">
                    <div className="mt-1 h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_22px_rgba(251,191,36,0.65)]" />
                    <div>
                      <p className="text-white/90 font-semibold tracking-wide">{f.title}</p>
                      <p className="text-xs text-zinc-400 mt-1">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_60px_rgba(0,217,255,0.12)] h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-amber-400/10" />
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-300">Maison Slogan</p>
                <p className="mt-3 text-white/95 text-xl font-light leading-relaxed">
                  “RARE by design. RAB by instinct. Luxury, secured.”
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-xs text-zinc-400">Next</p>
                    <p className="text-white font-semibold tracking-wide">Dashboard →</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-xs text-zinc-400">Then</p>
                    <p className="text-white font-semibold tracking-wide">Checkout</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl" />
              <RobustImage
                alt="Fashion editorial background"
                src={IMAGE_MAP.editorial}
                fill
                className="object-cover opacity-15"
                sizes="(max-width: 1024px) 100vw, 50vw"
              /><div className="absolute inset-0 bg-black/40" />
            </div>
          </div>

          {/* Right card */}
          <div className="flex items-center">
            <motion.div
              className="w-full rounded-3xl border border-white/10 bg-white/5 p-5 md:p-8 shadow-[0_0_90px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Top switch */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-300">Authentification</p>
                  <h2 className="mt-2 text-2xl md:text-3xl font-light text-white">
                    {mode === 'login' ? 'Login' : 'Register'}
                  </h2>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-1 flex">
                  <button
                    onClick={() => {
                      setMode('login');
                      setLoginSubView('email');
                    }}
                    className={cn(
                      'px-4 py-2 text-xs uppercase tracking-widest rounded-xl transition',
                      mode === 'login'
                        ? 'bg-gradient-to-r from-amber-400/25 to-cyan-400/20 text-white'
                        : 'text-zinc-400 hover:text-white/90'
                    )}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setMode('register')}
                    className={cn(
                      'px-4 py-2 text-xs uppercase tracking-widest rounded-xl transition',
                      mode === 'register'
                        ? 'bg-gradient-to-r from-amber-400/25 to-cyan-400/20 text-white'
                        : 'text-zinc-400 hover:text-white/90'
                    )}
                  >
                    Register
                  </button>
                </div>
              </div>

              <div className="mt-5">
                {toast && (
                  <motion.div
                    className={cn(
                      'rounded-2xl border p-4 text-sm mb-4',
                      toast.kind === 'success' && 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
                      toast.kind === 'error' && 'border-red-500/30 bg-red-500/10 text-red-200',
                      toast.kind === 'info' && 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100'
                    )}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="font-semibold tracking-wide">{toast.title}</div>
                    {toast.message ? <div className="mt-1 text-xs text-zinc-300">{toast.message}</div> : null}
                  </motion.div>
                )}

                {/* LOGIN */}
                {mode === 'login' ? (
                  <div className="space-y-5">
                    {/* Sub-view selectors */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setLoginSubView('email')}
                        className={cn(
                          'rounded-2xl border px-4 py-3 text-xs uppercase tracking-widest transition',
                          loginSubView === 'email'
                            ? 'border-amber-400/30 bg-amber-400/15 text-white'
                            : 'border-white/10 bg-black/20 text-zinc-400 hover:text-white/90'
                        )}
                      >
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginSubView('otp')}
                        className={cn(
                          'rounded-2xl border px-4 py-3 text-xs uppercase tracking-widest transition',
                          loginSubView === 'otp'
                            ? 'border-amber-400/30 bg-amber-400/15 text-white'
                            : 'border-white/10 bg-black/20 text-zinc-400 hover:text-white/90'
                        )}
                      >
                        OTP
                      </button>
                    </div>

                    {/* Continue with Google */}
                    <button
                      type="button"
                      onClick={() => setLoginSubView('google')}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-widest text-white/90 hover:bg-white/10 transition"
                    >
                      Continue with Google
                    </button>

                    <AnimatePresence mode="wait">
                      {loginSubView === 'email' && (
                        <motion.div
                          key="email"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <GlassCard glow="gold" className="p-5">
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleEmailLogin();
                              }}
                              className="space-y-4"
                            >
                              <div>
                                <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  value={loginEmail}
                                  onChange={(e) => setLoginEmail(e.target.value)}
                                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60"
                                  placeholder="you@email.com"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                                  Password
                                </label>
                                <div className="relative">
                                  <input
                                    type={loginShowPassword ? 'text' : 'password'}
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60"
                                    placeholder="••••••••"
                                    required
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setLoginShowPassword((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white/90"
                                  >
                                    {loginShowPassword ? 'Hide' : 'Show'}
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-3">
                                <label className="flex items-center gap-2 text-xs text-zinc-300">
                                  <input
                                    type="checkbox"
                                    checked={loginRemember}
                                    onChange={(e) => setLoginRemember(e.target.checked)}
                                    className="accent-amber-300"
                                  />
                                  Remember Me
                                </label>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setToast({
                                      kind: 'info',
                                      title: 'Forgot password',
                                      message: 'No password reset endpoint is wired in this build.',
                                    })
                                  }
                                  className="text-xs text-zinc-400 hover:text-white/90"
                                >
                                  Forgot Password
                                </button>
                              </div>

                              <motion.button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-amber-400/90 to-cyan-400/80 text-black font-bold tracking-widest uppercase rounded-lg transition-all disabled:opacity-50"
                                whileHover={!loading ? { scale: 1.02 } : undefined}
                                whileTap={!loading ? { scale: 0.98 } : undefined}
                              >
                                {loading ? 'Signing In…' : 'Login'}
                              </motion.button>
                            </form>
                          </GlassCard>
                        </motion.div>
                      )}

                      {loginSubView === 'otp' && (
                        <motion.div
                          key="otp"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <GlassCard glow="cyan" className="p-5">
                            <div className="mb-4">
                              <div className="text-white/90 font-semibold tracking-wide text-sm">Continue with OTP</div>
                              <div className="text-xs text-zinc-400 mt-1">
                                Choose email or phone OTP. After verification, you’ll be redirected.
                              </div>
                            </div>
                            <DynamicAuthFlow />
                          </GlassCard>
                        </motion.div>
                      )}

                      {loginSubView === 'google' && (
                        <motion.div
                          key="google"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <GlassCard glow="gold" className="p-5">
                            <div className="text-white/90 font-semibold tracking-wide text-sm">
                              Continue with Google
                            </div>
                            <div className="text-xs text-zinc-400 mt-2">
                              Google OAuth endpoints are not configured in the current backend build.
                              Use Email/OTP to sign in.
                            </div>
                            <div className="mt-4 flex gap-3">
                              <button
                                type="button"
                                onClick={() => setLoginSubView('email')}
                                className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs uppercase tracking-widest text-white/90 hover:bg-white/10 transition"
                              >
                                Use Email
                              </button>
                              <button
                                type="button"
                                onClick={() => setLoginSubView('otp')}
                                className="flex-1 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-xs uppercase tracking-widest text-cyan-200 hover:bg-cyan-400/15 transition"
                              >
                                Use OTP
                              </button>
                            </div>
                          </GlassCard>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => router.replace('/')}
                        className="text-xs text-zinc-400 hover:text-white/90 transition"
                      >
                        Back to Home
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                        }}
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition font-semibold"
                      >
                        New here? Register
                      </button>
                    </div>
                  </div>
                ) : (
                  // REGISTER
                  <div className="space-y-5">
                    <GlassCard glow="gold" className="p-5">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleRegisterSubmit();
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60"
                              placeholder="Your name"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60"
                              placeholder="+1 555 123 4567"
                              required
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              value={registerEmail}
                              onChange={(e) => setRegisterEmail(e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60"
                              placeholder="you@email.com"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={registerShowPassword ? 'text' : 'password'}
                              value={registerPassword}
                              onChange={(e) => setRegisterPassword(e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60"
                              placeholder="Create a password"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setRegisterShowPassword((s) => !s)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white/90"
                            >
                              {registerShowPassword ? 'Hide' : 'Show'}
                            </button>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-zinc-400">
                              <span>Password Strength</span>
                              <span className="text-white/90 font-semibold">{registerStrengthMeta.label}</span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                              <motion.div
                                className={cn(
                                  'h-full rounded-full bg-gradient-to-r',
                                  `bg-gradient-to-r ${registerStrengthMeta.color}`
                                )}
                                initial={false}
                                animate={{ width: `${(registerStrength / 5) * 100}%` }}
                                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              type={registerShowConfirmPassword ? 'text' : 'password'}
                              value={registerConfirmPassword}
                              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/60"
                              placeholder="Repeat password"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setRegisterShowConfirmPassword((s) => !s)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white/90"
                            >
                              {registerShowConfirmPassword ? 'Hide' : 'Show'}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="flex items-center gap-3 text-xs text-zinc-300">
                            <input
                              type="checkbox"
                              checked={agreeTerms}
                              onChange={(e) => setAgreeTerms(e.target.checked)}
                              className="accent-amber-300"
                            />
                            <span>
                              I agree to the <button type="button" className="text-cyan-400 hover:text-cyan-300" onClick={() => router.push('/terms')}>Terms & Conditions</button>
                            </span>
                          </label>
                          <label className="flex items-center gap-3 text-xs text-zinc-300">
                            <input
                              type="checkbox"
                              checked={agreePrivacy}
                              onChange={(e) => setAgreePrivacy(e.target.checked)}
                              className="accent-amber-300"
                            />
                            <span>
                              I agree to the <button type="button" className="text-cyan-400 hover:text-cyan-300" onClick={() => router.push('/privacy')}>Privacy Policy</button>
                            </span>
                          </label>
                        </div>

                        <motion.button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 bg-gradient-to-r from-amber-400/90 to-cyan-400/80 text-black font-bold tracking-widest uppercase rounded-lg transition-all disabled:opacity-50"
                          whileHover={!loading ? { scale: 1.02 } : undefined}
                          whileTap={!loading ? { scale: 0.98 } : undefined}
                        >
                          {loading ? 'Creating Account…' : 'Register'}
                        </motion.button>
                      </form>
                    </GlassCard>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => router.replace('/')}
                        className="text-xs text-zinc-400 hover:text-white/90 transition"
                      >
                        Back to Home
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition font-semibold"
                      >
                        Have an account? Login
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile CTAs */}
              <div className="mt-6 text-center text-xs text-zinc-500">
                By continuing, you confirm you’re ready for a premium session experience.
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}