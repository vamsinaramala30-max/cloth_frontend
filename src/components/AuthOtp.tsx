'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function AuthOtp({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [phase, setPhase] = useState<'send'|'verify'>('send');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function sendOtp() {
    try {
      setLoading(true);
      const res = await axios.post('/auth/otp/send', { email });
      setMessage('OTP sent to your email (check spam)');
      setPhase('verify');
    } catch (err) {
      const e = err as any;
      setMessage(e?.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  }


  async function verifyOtp() {
    try {
      setLoading(true);
      const res = await axios.post('/auth/otp/verify', { email, otp });
      setMessage('Verified — signing in');
      onSuccess?.();
    } catch (err) {
      const e = err as any;
      setMessage(e?.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  }


  return (
    <div className="space-y-3">
      {phase === 'send' ? (
        <>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="input" />
          <button onClick={sendOtp} disabled={loading} className="btn">Send OTP</button>
        </>
      ) : (
        <>
          <p className="text-sm text-zinc-400">Enter the 6-digit code sent to {email}</p>
          <input value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="123456" className="input" />
          <div className="flex gap-2">
            <button onClick={verifyOtp} className="btn">Verify</button>
            <button onClick={()=>setPhase('send')} className="btn-ghost">Change email</button>
          </div>
        </>
      )}
      {message && <p className="text-sm text-zinc-300">{message}</p>}
    </div>
  );
}
