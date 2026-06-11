import Link from 'next/link';

export default function StartPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 shadow-[0_0_60px_rgba(0,217,255,0.12)]">
        <h1 className="text-white text-3xl md:text-4xl font-light tracking-[0.08em] uppercase text-center">
          RARE RAB IT
        </h1>
        <p className="mt-3 text-zinc-400 text-sm md:text-base text-center">
          Start your journey: choose Home or Login.
        </p>

        <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 shadow-[0_0_80px_rgba(0,255,255,0.10)]">
          <div className="text-[0.65rem] uppercase tracking-[0.25em] text-cyan-200/90">Launch Offer</div>
          <div className="mt-1 text-white text-2xl font-light">
            Start with <span className="text-cyan-200">$5000</span> discount
          </div>
          <p className="mt-2 text-zinc-300 text-sm">
            Limited time drop — sign in to apply your offer.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl px-6 py-4 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 text-cyan-200 font-bold tracking-widest uppercase hover:from-cyan-400/30 hover:to-purple-400/30 transition"
          >
            Home
          </Link>

          <Link
            href="/login-dynamic"
            className="inline-flex items-center justify-center rounded-xl px-6 py-4 bg-white/5 border border-white/10 text-white font-bold tracking-widest uppercase hover:bg-white/10 transition"
          >
            Login
          </Link>

        </div>
      </div>
    </div>
  );
}

