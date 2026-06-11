'use client';

import React from 'react';

import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { HeroSection } from '@/components/HeroSection';
import { FloatingNavbar } from '@/components/FloatingNavbar';

const STAT_ITEMS = [
  { label: 'Templates', value: '120+' },
  { label: 'Production Speed', value: '24h' },
  { label: 'Customer Care', value: '24/7' },
  { label: 'Quality Score', value: 'A+' },
];

const PRICING = [
  {
    name: 'Starter',
    price: '$19',
    blurb: 'For personal designs & basic customization.',
    perks: ['Template downloads', '1 marketplace sync', 'Community support'],
  },
  {
    name: 'Studio',
    price: '$49',
    blurb: 'For frequent creators & teams.',
    perks: ['Live previews', 'Priority rendering', 'Export presets', 'Private collections'],
  },
  {
    name: 'Maison',
    price: '$99',
    blurb: 'For agencies & premium workflows.',
    perks: ['Advanced analytics', 'Team templates', 'Best-in-class support', 'Early feature access'],
  },
];

const TESTIMONIALS = [
  {
    name: 'Alya K.',
    role: 'Creative Director',
    quote:
      'The glassmorphism experience feels premium, and the template previews are instant—exactly the kind of speed we need.',
  },
  {
    name: 'Noah R.',
    role: 'E-commerce Founder',
    quote:
      'Clean UX, smooth transitions, and the layout is stunning. Our conversion lift started immediately.',
  },
  {
    name: 'Mina S.',
    role: 'Brand Strategist',
    quote:
      'The experience is cinematic—hero, stats, testimonials, and pricing all flow naturally without distracting from the product.',
  },
];

const TEMPLATE_SHOWCASE = [
  { title: 'Nebula Noir', desc: 'Dark editorial with cinematic typography.' },
  { title: 'Aurum Halo', desc: 'Warm luxury gradients & premium spacing.' },
  { title: 'Vanta Silk', desc: 'Minimal, fast, and intensely elegant.' },
  { title: 'Cosmic Atelier', desc: 'Bold hero blocks and bold feature grids.' },
];

export function WelcomeLanding() {
  return (
    <div className="min-h-screen">
      {/* Note: RootLayout already includes navbar/footer/cursor/particles.
          We keep this component purely additive styling and content. */}

      <div className="relative">
        {/* Hero */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-32 right-10 h-[360px] w-[360px] rounded-full bg-purple-500/10 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 pt-24 pb-10">
          {/* Inline Glass Navbar-like bar */}
          <div className="mb-10">
            {/* Keeping existing FloatingNavbar untouched; this is a minimal CTA strip only */}
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl px-4 py-3 shadow-[0_0_50px_rgba(0,255,255,0.08)]">
              <div className="text-xs uppercase tracking-[0.25em] text-zinc-300">
             RARE RAB IT   Futuristic Luxury • Template Studio
              </div>
              <a
                href="/login"
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-purple-400 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black shadow-lg shadow-cyan-400/20 hover:brightness-105 transition"
              >
                Login
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-300">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(0,255,255,0.6)]" />
                Premium dark theme • glass UI • fast previews
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight text-white">
                Design like a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">Maison</span>.
              </h1>

              <p className="mt-5 text-zinc-400 max-w-xl">
                A modern template gallery and cinematic landing experience—built for speed, clarity, and conversion.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/templates"
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Explore Templates
                </a>
                <a
                  href="/welcome"
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-purple-400 px-5 py-3 text-sm font-bold text-black hover:brightness-105 transition"
                >
                  View Premium Flow
                </a>
              </div>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {STAT_ITEMS.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-xl p-4">
                    <div className="text-2xl text-white font-light">{s.value}</div>
                    <div className="text-[0.65rem] uppercase tracking-[0.2em] text-zinc-400 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <GlassCard className="p-6 relative overflow-hidden">
                <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-cyan-500/20 blur-2xl" />
                <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-purple-500/20 blur-2xl" />

                <div className="relative">
                  <h2 className="text-lg text-white font-semibold">Template Preview</h2>
                  <p className="text-zinc-400 text-sm mt-2">
                    Live previews, responsive cards, and smooth transitions.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {TEMPLATE_SHOWCASE.slice(0, 4).map((t) => (
                      <div key={t.title} className="rounded-xl border border-white/10 bg-black/30 p-3">
                        <div className="text-white text-sm font-medium">{t.title}</div>
                        <div className="text-zinc-400 text-xs mt-1 line-clamp-2">{t.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <a
                      href="/templates"
                      className="w-full inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                    >
                      Open Templates Gallery
                    </a>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-zinc-400">Features</div>
              <h3 className="mt-3 text-2xl sm:text-3xl text-white font-light">Everything you need to launch.</h3>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Glass UI Components',
                desc: 'Premium typography, glass surfaces, and cinematic spacing.',
              },
              {
                title: 'Live Template Previews',
                desc: 'Search, filter, preview, and select instantly on any device.',
              },
              {
                title: 'Order Tracking Ready',
                desc: 'Status pipeline from Ordered to Refunded, built for clarity.',
              },
            ].map((f) => (
              <GlassCard key={f.title} className="p-6">
                <div className="text-white text-lg font-semibold">{f.title}</div>
                <div className="text-zinc-400 text-sm mt-2">{f.desc}</div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-zinc-400">Pricing</div>
          <h3 className="mt-3 text-2xl sm:text-3xl text-white font-light">Simple plans. Premium outcomes.</h3>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {PRICING.map((p, idx) => (
              <GlassCard
                key={p.name}
                className={`p-6 ${idx === 1 ? 'border-cyan-400/20 shadow-[0_0_80px_rgba(0,255,255,0.12)]' : ''}`}
              >
                <div className="text-white text-xl font-semibold">{p.name}</div>
                <div className="mt-3 flex items-baseline gap-2">
                  <div className="text-4xl font-light text-cyan-200">{p.price}</div>
                </div>
                <p className="text-zinc-400 text-sm mt-3">{p.blurb}</p>
                <ul className="mt-5 space-y-2">
                  {p.perks.map((perk) => (
                    <li key={perk} className="text-zinc-300 text-sm">
                      • {perk}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <a
                    href="/templates"
                    className={`w-full inline-flex justify-center rounded-xl px-4 py-3 text-sm font-bold transition ${
                      idx === 1
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-black hover:brightness-105'
                        : 'bg-white/5 border border-white/15 text-white hover:bg-white/10'
                    }`}
                  >
                    Choose {p.name}
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-zinc-400">Testimonials</div>
          <h3 className="mt-3 text-2xl sm:text-3xl text-white font-light">Creators love the experience.</h3>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t) => (
              <GlassCard key={t.name} className="p-6">
                <div className="text-zinc-300 text-sm">“{t.quote}”</div>
                <div className="mt-4">
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-zinc-400 text-xs mt-1">{t.role}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-zinc-400">About</div>
              <h3 className="mt-3 text-2xl sm:text-3xl text-white font-light">A futuristic studio for modern luxury.</h3>
              <p className="mt-4 text-zinc-400">
                We believe UI should feel cinematic and navigation should feel effortless. This experience is designed to
                keep you focused on what matters: choosing the right template and shipping with confidence.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/templates"
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-purple-400 px-5 py-3 text-sm font-bold text-black hover:brightness-105 transition"
                >
                  Get Started
                </a>
                <a
                  href="/login"
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Sign In
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-white/10 bg-black/25 backdrop-blur-xl p-6 overflow-hidden">
                <div className="text-white font-semibold">Template Showcase</div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {TEMPLATE_SHOWCASE.map((t) => (
                    <div key={t.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-white text-sm font-medium">{t.title}</div>
                      <div className="text-zinc-400 text-xs mt-1 line-clamp-2">{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-500/20 blur-2xl" />
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl" />
            </div>
          </div>
        </section>
      </div>

      {/* Footer is already in RootLayout; leaving no extra markup to avoid duplication. */}
      <div className="sr-only">Welcome landing page</div>
    </div>
  );
}

