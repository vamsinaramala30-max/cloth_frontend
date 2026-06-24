'use client';

import React, { useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';
import config from '@/config/env';

export const Footer: React.FC = () => {
  const footerLinks = useMemo(
    () => ({
      About: [
        { label: 'Our Story', href: '/about/our-story' },
        { label: 'Brand Vision', href: '/about/brand-vision' },
        { label: 'Craftsmanship', href: '/about/craftsmanship' },
        { label: 'Sustainability', href: '/about/sustainability' },
        { label: 'Technology & Innovation', href: '/about/technology-innovation' },
        { label: 'Press & Media', href: '/about/press-media' },
      ],
      Support: [
        { label: 'Contact Us', href: '/support/contact-us' },
        { label: 'Help Center', href: '/support/help-center' },
        { label: 'Frequently Asked Questions', href: '/support/faq' },
        { label: 'Shipping Information', href: '/support/shipping-information' },
        { label: 'Returns & Exchanges', href: '/support/returns-exchanges' },
        { label: 'Order Tracking', href: '/support/order-tracking' },
        { label: 'Size Guide', href: '/support/size-guide' },
        { label: 'Customer Support', href: '/support/customer-support' },
      ],
      Legal: [
        { label: 'Privacy Policy', href: '/legal/privacy-policy' },
        { label: 'Terms of Service', href: '/legal/terms-of-service' },
        { label: 'Cookie Policy', href: '/legal/cookie-policy' },
        { label: 'Accessibility Statement', href: '/legal/accessibility-statement' },
        { label: 'Refund Policy', href: '/legal/refund-policy' },
        { label: 'Intellectual Property Notice', href: '/legal/intellectual-property' },
      ],
    }),
    []
  );

  const [email, setEmail] = useState('');
  const [subscriberState, setSubscriberState] = useState<
    | { status: 'idle' | 'loading' | 'success' | 'error'; message?: string }
    | { status: 'error'; message: string }
  >({ status: 'idle' });

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setSubscriberState({ status: 'error', message: 'Email is required.' });
      return;
    }
    if (!isValidEmail(trimmed)) {
      setSubscriberState({ status: 'error', message: 'Please enter a valid email.' });
      return;
    }

    try {
      setSubscriberState({ status: 'loading' });
      const res = await axios.post(
        `${config.apiUrl}/subscription/subscribe`,
        { email: trimmed, source: 'footer' },
        { withCredentials: true }
      );

      const msg = res?.data?.message || 'Subscribed successfully.';
      setSubscriberState({ status: 'success', message: msg });
      setEmail('');
    } catch (err: unknown) {
      let msg = 'Subscription failed. Please try again.';
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setSubscriberState({ status: 'error', message: msg });
    }
  }


  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <footer className="relative w-full bg-black/50 backdrop-blur-xl border-t border-white/10 py-16 md:py-24 px-4 md:px-8 z-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 mb-16"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={item} className="lg:col-span-1">
            <Link href="/">
              <h3 className="text-xl font-bold tracking-[0.2em] text-white uppercase mb-4 cursor-pointer hover:text-cyan-400 transition-colors">
                Plasma Atelier
              </h3>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Futuristic luxury fashion-tech experience. AI-designed aesthetics, cinematic
              storytelling, and immersive luxury.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Twitter', 'TikTok', 'Discord'].map((social) => (
                <motion.a
                  key={social}
                  href="/welcome"
                  className="text-[10px] text-zinc-500 hover:text-cyan-400 transition-colors tracking-widest font-medium"
                  whileHover={{ scale: 1.1, color: '#00d9ff' }}
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <motion.div key={title} variants={item}>
              <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-6">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs text-zinc-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mb-12 pb-12 border-b border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-4">
            Subscribe to Updates
          </h4>

          <form
            className="flex flex-col md:flex-row gap-4"
            onSubmit={handleSubscribe}
          >
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (subscriberState.status === 'error') setSubscriberState({ status: 'idle' });
              }}
              aria-label="Email"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-all text-sm"
            />
            <motion.button
              type="submit"
              disabled={subscriberState.status === 'loading'}
              aria-label="Subscribe"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs font-bold tracking-widest uppercase rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {subscriberState.status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </motion.button>
          </form>

          {subscriberState.status !== 'idle' && (
            <p
              role="status"
              className={`mt-4 text-sm ${
                subscriberState.status === 'success' ? 'text-cyan-300' : 'text-zinc-200'
              }`}
              aria-live="polite"
            >
              {subscriberState.message}
            </p>
          )}

        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p>&copy; 2026 Plasma Atelier. All rights reserved.</p>
            <div className="flex gap-6">
            <Link href="/legal/privacy-policy" className="hover:text-cyan-400 transition-colors">
              Privacy
            </Link>
            <Link href="/legal/terms-of-service" className="hover:text-cyan-400 transition-colors">
              Terms
            </Link>
            <Link href="/legal/cookie-policy" className="hover:text-cyan-400 transition-colors">
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};