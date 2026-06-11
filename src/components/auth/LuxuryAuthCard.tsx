'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { useAuthActions } from '@/hooks/useAuthActions';
import { useAuthStore } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import DynamicAuthFlow from '@/components/auth/DynamicAuthFlow';


export type AuthMode = 'login' | 'register';

type ToastKind = 'success' | 'error' | 'info';

type Toast = { kind: ToastKind; title: string; message?: string } | null;

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

function FieldError({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <motion.p
      id={id}
      role="alert"
      className="mt-2 text-xs text-red-300"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.p>
  );
}

export default function LuxuryAuthCard({ mode }: { mode: AuthMode }) {
  const router = useRouter();

  const { handleLogin, handleRegister, fetchUser } = useAuthActions();
  const { user } = useAuthStore();

  const [toast, setToast] = useState<Toast>(null);
  const [submitting, setSubmitting] = useState(false);

  // login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // register
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerShowPassword, setRegisterShowPassword] = useState(false);

  // errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const registerStrength = useMemo(() => strengthScore(registerPassword), [registerPassword]);
  const registerStrengthMeta = useMemo(() => strengthLabel(registerStrength), [registerStrength]);

  const setAndAutoClearToast = (next: Toast) => {
    setToast(next);
    if (next) {
      window.setTimeout(() => setToast(null), 3800);
    }
  };

  const validateRegister = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required.';
    if (!registerEmail.trim()) errs.registerEmail = 'Email is required.';
    if (!registerPassword) errs.registerPassword = 'Password is required.';
    if (registerPassword.length < 8) errs.registerPassword = 'Password must be at least 8 characters.';
    if (registerConfirmPassword !== registerPassword) errs.registerConfirmPassword = 'Passwords do not match.';
    return errs;
  };

  const [showOtpFlow, setShowOtpFlow] = React.useState(false);

  const handleGoogle = () => {
    // OAuth buttons are not implemented in backend; route into OTP flow instead.
    setShowOtpFlow(true);
  };

  const handleApple = () => {
    // OAuth buttons are not implemented in backend; route into OTP flow instead.
    setShowOtpFlow(true);
  };


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (mode === 'login') {
      const email = loginEmail.trim();
      if (!email) return setFieldErrors({ loginEmail: 'Email is required.' });
      if (!loginPassword) return setFieldErrors({ loginPassword: 'Password is required.' });

      setSubmitting(true);
      setToast(null);
      try {
        const ok = await handleLogin(email, loginPassword);
        if (!ok) {
          setAndAutoClearToast({ kind: 'error', title: 'Sign in failed', message: 'Check your credentials and try again.' });
          return;
        }
        setAndAutoClearToast({ kind: 'success', title: 'Welcome back.' });
        await fetchUser();
        router.replace('/account/orders');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // register
    const errs = validateRegister();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      setAndAutoClearToast({ kind: 'error', title: 'Please fix the highlighted fields.' });
      return;
    }

    setSubmitting(true);
    setToast(null);
    try {
      const ok = await handleRegister(registerEmail.trim(), registerPassword, fullName.trim());
      if (!ok) {
        setAndAutoClearToast({ kind: 'error', title: 'Registration failed', message: 'Try again with valid details.' });
        return;
      }
      setAndAutoClearToast({ kind: 'success', title: 'Account created.' });
      await fetchUser();
      router.replace('/account/orders');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="w-full rounded-[36px] border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-[0_0_120px_rgba(0,0,0,0.55)] p-6 sm:p-8"
      initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.42, ease: 'easeOut' }}
    >
      <div className="text-center">
        <div className="flex justify-center">
          <Logo showText />
        </div>

        <h1 className="mt-6 text-2xl sm:text-3xl font-light tracking-tight text-white">
          {mode === 'register' ? 'Create Your Account' : 'Sign In'}
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-zinc-300 mx-auto max-w-[38ch] leading-relaxed">
          {mode === 'register'
            ? 'Access exclusive collections, personalized recommendations, and luxury experiences.'
            : 'Welcome back. Sign in to manage your luxury orders and experiences.'}
        </p>
      </div>

      <div className="mt-6">
        {showOtpFlow ? (
          <div className="mt-5">
            {/* Inline OTP/verification UI (fixes missing verification code box) */}
            {/** Lazy import would be nicer, but keep it simple for now */}
            <DynamicAuthFlow />

            <button
              type="button"
              onClick={() => setShowOtpFlow(false)}
              className="mt-5 w-full rounded-[18px] px-5 py-3 bg-transparent border border-white/10 text-white font-bold tracking-widest uppercase hover:bg-white/10 transition"
            >
              Back to {mode === 'login' ? 'Sign In' : 'Register'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-widest text-white/90 hover:bg-white/10 transition"
              aria-label="Continue with Google"
            >
              <span aria-hidden>G</span>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleApple}
              className="w-full flex items-center justify-center gap-3 rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-widest text-white/90 hover:bg-white/10 transition"
              aria-label="Continue with Apple"
            >
              <span aria-hidden></span>
              Continue with Apple
            </button>

            <div className="pt-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white/[0.06] text-[11px] text-zinc-400 uppercase tracking-[0.18em]">
                    or continue with email
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.28 }}
            className="mt-5"
          >

            {toast ? (
              <motion.div
                className={cn(
                  'rounded-2xl border p-4 text-sm',
                  toast.kind === 'success' && 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
                  toast.kind === 'error' && 'border-red-500/30 bg-red-500/10 text-red-200',
                  toast.kind === 'info' && 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100'
                )}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
                aria-live="polite"
              >
                <div className="font-semibold tracking-wide">{toast.title}</div>
                {toast.message ? <div className="mt-1 text-xs text-zinc-300">{toast.message}</div> : null}
              </motion.div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
              {mode === 'register' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.2em] text-white/80 uppercase mb-2">Name</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-[18px] bg-white/5 border border-white/15 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                      placeholder="Your name"
                      aria-invalid={Boolean(fieldErrors.fullName)}
                    />
                    {fieldErrors.fullName ? <FieldError>{fieldErrors.fullName}</FieldError> : null}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.2em] text-white/80 uppercase mb-2">Email</label>
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full rounded-[18px] bg-white/5 border border-white/15 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                      placeholder="you@email.com"
                      aria-invalid={Boolean(fieldErrors.registerEmail)}
                    />
                    {fieldErrors.registerEmail ? <FieldError>{fieldErrors.registerEmail}</FieldError> : null}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.2em] text-white/80 uppercase mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={registerShowPassword ? 'text' : 'password'}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="w-full rounded-[18px] bg-white/5 border border-white/15 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                        placeholder="Create a password"
                        aria-invalid={Boolean(fieldErrors.registerPassword)}
                      />
                      <button
                        type="button"
                        onClick={() => setRegisterShowPassword((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-zinc-400 hover:text-white/90 transition"
                        aria-label={registerShowPassword ? 'Hide password' : 'Show password'}
                      >
                        {registerShowPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {fieldErrors.registerPassword ? <FieldError>{fieldErrors.registerPassword}</FieldError> : null}

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Password strength</span>
                        <span className="text-white/90 font-semibold">{registerStrengthMeta.label}</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className={cn('h-full rounded-full bg-gradient-to-r', registerStrengthMeta.color)}
                          initial={false}
                          animate={{ width: `${(registerStrength / 5) * 100}%` }}
                          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.2em] text-white/80 uppercase mb-2">Confirm Password</label>
                    <input
                      type={registerShowPassword ? 'text' : 'password'}
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="w-full rounded-[18px] bg-white/5 border border-white/15 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                      placeholder="Repeat password"
                      aria-invalid={Boolean(fieldErrors.registerConfirmPassword)}
                    />
                    {fieldErrors.registerConfirmPassword ? <FieldError>{fieldErrors.registerConfirmPassword}</FieldError> : null}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.2em] text-white/80 uppercase mb-2">Email</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full rounded-[18px] bg-white/5 border border-white/15 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                      placeholder="you@email.com"
                      aria-invalid={Boolean(fieldErrors.loginEmail)}
                    />
                    {fieldErrors.loginEmail ? <FieldError>{fieldErrors.loginEmail}</FieldError> : null}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.2em] text-white/80 uppercase mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={loginShowPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full rounded-[18px] bg-white/5 border border-white/15 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                        placeholder="••••••••"
                        aria-invalid={Boolean(fieldErrors.loginPassword)}
                      />
                      <button
                        type="button"
                        onClick={() => setLoginShowPassword((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-zinc-400 hover:text-white/90 transition"
                        aria-label={loginShowPassword ? 'Hide password' : 'Show password'}
                      >
                        {loginShowPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {fieldErrors.loginPassword ? <FieldError>{fieldErrors.loginPassword}</FieldError> : null}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-[11px] text-zinc-300">
                      <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-cyan-300" />
                      Remember Me
                    </label>

                    <button
                      type="button"
                      className="text-[11px] text-zinc-400 hover:text-white/90 transition"
                      onClick={() =>
                        setAndAutoClearToast({
                          kind: 'info',
                          title: 'Password reset unavailable',
                          message: 'Password reset endpoint is not wired in this build.',
                        })
                      }
                    >
                      Forgot Password
                    </button>
                  </div>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-[18px] bg-gradient-to-r from-amber-400/95 to-cyan-400/85 text-black font-bold tracking-widest uppercase transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                whileHover={submitting ? undefined : { scale: 1.02 }}
                whileTap={submitting ? undefined : { scale: 0.98 }}
              >
                {submitting ? (mode === 'login' ? 'Signing In…' : 'Creating Account…') : mode === 'login' ? 'Sign In' : 'Create Account'}
              </motion.button>

              <div className="text-center text-[11px] text-zinc-400 pt-1">
                {mode === 'login' ? (
                  <span>
                    New here?{' '}
                    <button type="button" onClick={() => router.replace('/register')} className="text-cyan-300 hover:text-cyan-200 font-semibold transition">
                      Create account
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{' '}
                    <button type="button" onClick={() => router.replace('/login')} className="text-cyan-300 hover:text-cyan-200 font-semibold transition">
                      Sign In
                    </button>
                  </span>
                )}
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

