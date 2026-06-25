import type { Metadata } from 'next';

import dynamic from 'next/dynamic';

const AuthModalClient = dynamic(() => import('@/components/AuthModal').then(m => m.AuthModal), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Login | Plasma Atelier',
  description: 'Sign in to your account',
};

export default function LoginNewPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-luxury-darker" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute top-20 -right-40 h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute bottom-[-180px] left-[-180px] h-[360px] w-[360px] rounded-full bg-cyan-300/10 blur-3xl" />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative z-10 w-full px-4 md:px-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs tracking-[0.22em] uppercase text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_22px_rgba(0,217,255,0.7)]" />
              Premium Dark Auth
            </div>
            <h1 className="mt-5 text-4xl md:text-5xl font-light leading-[1.05] tracking-tight text-white">
              Enter the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">Maison</span>
            </h1>
            <p className="mt-4 text-zinc-400 max-w-md">
              Glassmorphism UI with animated luxury ambience. Your next checkout experience starts here.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full">
              {/* Existing auth modal (kept intact; only wrapped by new page layout) */}
              <AuthModalClient isOpen={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Ambient floating glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-1/3 h-20 w-20 rounded-full bg-cyan-400/20 blur-2xl animate-pulse" />
        <div className="absolute right-10 top-1/4 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl animate-pulse" />
      </div>
    </div>
  );
}

