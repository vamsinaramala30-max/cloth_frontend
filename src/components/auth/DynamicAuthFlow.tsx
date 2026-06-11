'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { sendOtp, verifyOtp } from '@/lib/api';

type Method = 'google' | 'emailOtp' | 'phoneOtp';

type Stage =
  | 'pick'
  | 'googleNotice'
  | 'emailInput'
  | 'phoneInput'
  | 'otpSend'
  | 'otpVerify'
  | 'success';

export default function DynamicAuthFlow() {
  const router = useRouter();

  const [method, setMethod] = useState<Method>('emailOtp');
  const [stage, setStage] = useState<Stage>('pick');

  const [identifier, setIdentifier] = useState(''); // email OR phone
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const modeKey = useMemo(() => {
    if (method === 'emailOtp') return 'email';
    if (method === 'phoneOtp') return 'phone';
    return null;
  }, [method]);

  function resetOtpState(nextStage: Stage) {
    setOtp('');
    setError(null);
    setMessage(null);
    setStage(nextStage);
  }

  async function handleSendOtp() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (method === 'emailOtp') {
        const email = identifier.trim();
        if (!email) throw new Error('Email is required');

        const res = await sendOtp({ email, action: 'login' });
        if (res.error) throw new Error(res.error);

        setMessage('Verification code sent. Check your email.');
        resetOtpState('otpVerify');
        return;
      }

      if (method === 'phoneOtp') {
        const phone = identifier.trim();
        if (!phone) throw new Error('Phone is required');

        const res = await sendOtp({ phone, action: 'login' });
        if (res.error) throw new Error(res.error);

        setMessage(
          'Verification code sent (if SMS delivery is configured). Enter the code below.'
        );
        resetOtpState('otpVerify');
        return;
      }

      throw new Error('Select Email OTP or Phone OTP');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (!otp.trim()) throw new Error('OTP is required');

      if (method === 'emailOtp') {
        const email = identifier.trim();
        if (!email) throw new Error('Email is required');

        const res = await verifyOtp({ email, otp: otp.trim() });
        if (res.error) throw new Error(res.error);

        setMessage('Email verified. Login successful.');
        setStage('success');
        router.refresh();
        router.push('/');
        return;
      }

      if (method === 'phoneOtp') {
        const phone = identifier.trim();
        if (!phone) throw new Error('Phone is required');

        const res = await verifyOtp({ phone, otp: otp.trim() });
        if (res.error) throw new Error(res.error);

        setMessage('Phone verified. Login successful.');
        setStage('success');
        router.refresh();
        router.push('/');
        return;
      }

      throw new Error('Select Email OTP or Phone OTP');
    } catch (e) {
      // Phone flows may fail depending on whether phone OTP is persisted in backend user records.
      setError(
        e instanceof Error
          ? e.message
          : 'OTP verification failed. Phone OTP may require phone to be persisted on the user.'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleMethodPick(next: Method) {
    setMethod(next);
    setIdentifier('');
    setOtp('');
    setError(null);
    setMessage(null);

    if (next === 'google') {
      setStage('googleNotice');
      return;
    }

    if (next === 'emailOtp') {
      setStage('emailInput');
      return;
    }

    setStage('phoneInput');
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10 shadow-[0_0_60px_rgba(0,217,255,0.10)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="text-center">
          <h1 className="text-white text-3xl font-light tracking-[0.08em] uppercase">Login</h1>
          <p className="mt-2 text-zinc-400 text-sm">Choose Google, Email OTP, or Phone OTP.</p>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
            {message}
          </div>
        ) : null}

        {stage === 'pick' ? (
          <div className="mt-8 grid gap-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              onClick={() => handleMethodPick('google')}
              className="w-full rounded-xl px-5 py-4 bg-white/5 border border-white/10 text-white font-bold tracking-widest uppercase hover:bg-white/10 transition"
            >
              Continue with Google
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              onClick={() => handleMethodPick('emailOtp')}
              className="w-full rounded-xl px-5 py-4 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 text-cyan-200 font-bold tracking-widest uppercase hover:from-cyan-400/30 hover:to-purple-400/30 transition"
            >
              Login with Email OTP
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              onClick={() => handleMethodPick('phoneOtp')}
              className="w-full rounded-xl px-5 py-4 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 text-cyan-200 font-bold tracking-widest uppercase hover:from-cyan-400/30 hover:to-purple-400/30 transition"
            >
              Login with Phone OTP
            </motion.button>
          </div>
        ) : null}

        {stage === 'googleNotice' ? (
          <div className="mt-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-white font-semibold tracking-wide">Google OAuth not configured</div>
              <p className="mt-2 text-zinc-400 text-sm">
                This UI is present, but the backend OAuth endpoints were not detected. Use Email OTP or
                Phone OTP to log in.
              </p>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setStage('pick')}
                className="flex-1 rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-white font-bold tracking-widest uppercase hover:bg-white/10 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => handleMethodPick('emailOtp')}
                className="flex-1 rounded-xl px-4 py-3 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 text-cyan-200 font-bold tracking-widest uppercase hover:from-cyan-400/30 hover:to-purple-400/30 transition"
              >
                Use Email OTP
              </button>
            </div>
          </div>
        ) : null}

        {stage === 'emailInput' || stage === 'phoneInput' ? (
          <div className="mt-8">
            <label className="block text-zinc-200 text-sm tracking-wide uppercase">
              {modeKey === 'email' ? 'Email' : 'Phone'}
            </label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={modeKey === 'email' ? 'you@example.com' : '+1 555 123 4567'}
              className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none focus:border-cyan-400/50"
            />

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="mt-5 w-full rounded-xl px-5 py-4 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 text-cyan-200 font-bold tracking-widest uppercase hover:from-cyan-400/30 hover:to-purple-400/30 transition disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            <button
              type="button"
              onClick={() => setStage('pick')}
              className="mt-3 w-full rounded-xl px-5 py-3 bg-transparent border border-white/10 text-white font-bold tracking-widest uppercase hover:bg-white/10 transition"
            >
              Back
            </button>
          </div>
        ) : null}

        {stage === 'otpVerify' ? (
          <div className="mt-8">
            <label className="block text-zinc-200 text-sm tracking-wide uppercase">OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputMode="numeric"
              placeholder="Enter the code"
              className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none focus:border-cyan-400/50"
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="mt-5 w-full rounded-xl px-5 py-4 bg-cyan-400/20 border border-cyan-400/40 text-cyan-200 font-bold tracking-widest uppercase hover:bg-cyan-400/25 transition disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStage(method === 'emailOtp' ? 'emailInput' : 'phoneInput');
                setOtp('');
                setError(null);
                setMessage(null);
              }}
              className="mt-3 w-full rounded-xl px-5 py-3 bg-transparent border border-white/10 text-white font-bold tracking-widest uppercase hover:bg-white/10 transition"
            >
              Change {modeKey === 'email' ? 'Email' : 'Phone'}
            </button>
          </div>
        ) : null}

        {stage === 'success' ? (
          <div className="mt-8 text-center text-zinc-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-white font-semibold">Login successful</div>
              <p className="mt-2 text-zinc-400 text-sm">Redirecting…</p>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}

