'use client';

import React, { useState } from 'react';
import axios from 'axios';
import config from '@/config/env';


export default function AuthOtp({ onSuccess }: { onSuccess?: () => void }) {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [phase, setPhase] = useState<'send' | 'verify'>('send');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function sendOtp() {
    try {
      setLoading(true);
      if (method === 'email') {
        await axios.post(`${config.apiUrl}/auth/otp/send`, { email });

        setMessage('OTP sent to your email (check spam)');
      } else {
        await axios.post(`${config.apiUrl}/auth/otp/send`, { phone });

        setMessage('OTP sent to your phone');
      }
      setPhase('verify');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || 'Failed to send OTP');
      } else {
        setMessage('Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    try {
      setLoading(true);
      if (method === 'email') {
        await axios.post(`${config.apiUrl}/auth/otp/verify`, { email, otp });

        setMessage('Verified — signing in');
      } else {
        await axios.post(`${config.apiUrl}/auth/otp/verify`, { phone, otp });

        setMessage('Verified — signing in');
      }
      onSuccess?.();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || 'Invalid OTP');
      } else {
        setMessage('Invalid OTP');
      }
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setMethod('email');
            setMessage('');
            setPhase('send');
            setOtp('');
          }}
          className={method === 'email' ? 'btn' : 'btn-ghost'}
        >
          Email OTP
        </button>
        <button
          type="button"
          onClick={() => {
            setMethod('phone');
            setMessage('');
            setPhase('send');
            setOtp('');
          }}
          className={method === 'phone' ? 'btn' : 'btn-ghost'}
        >
          Phone OTP
        </button>
      </div>

      {phase === 'send' ? (
        <>
          {method === 'email' ? (
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input"
            />
          ) : (
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (E.164 recommended)"
              className="input"
            />
          )}
          <button onClick={sendOtp} disabled={loading} className="btn">
            Send OTP
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-zinc-400">
            Enter the 6-digit code sent to {method === 'email' ? email : phone}
          </p>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            className="input"
          />
          <div className="flex gap-2">
            <button onClick={verifyOtp} className="btn">
              Verify
            </button>
            <button
              onClick={() => {
                setPhase('send');
                setOtp('');
              }}
              className="btn-ghost"
            >
              Change {method === 'email' ? 'email' : 'phone'}
            </button>
          </div>
        </>
      )}

      {message && <p className="text-sm text-zinc-300">{message}</p>}
    </div>
  );
}