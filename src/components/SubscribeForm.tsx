'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function SubscribeForm({ onDone }: { onDone?: () => void }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('/api/subscriber/subscribe', { email, phone, source: 'site' });
      setMessage('Thanks — you are subscribed.');
      onDone?.();
    } catch (err) {
      const e = err as any;
      setMessage(e?.response?.data?.message || 'Subscription failed');
    } finally { setLoading(false); }

  }

  return (
    <form onSubmit={submit} className="flex gap-2 items-center">
      <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input className="input w-36" placeholder="Phone (optional)" value={phone} onChange={(e)=>setPhone(e.target.value)} />
      <button className="btn" disabled={loading} type="submit">Subscribe</button>
      {message && <p className="text-sm text-zinc-300">{message}</p>}
    </form>
  );
}
