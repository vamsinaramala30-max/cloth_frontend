import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Plasma Atelier',
  description: 'Contact Plasma Atelier via SMS-only support.',
};

const CONTACT_PHONE = '9390223123';
const CONTACT_EMAIL_DISPLAY_ONLY = 'vamsinaramala30@gmail.com';

export default function ContactPage() {
  return (
    <div className="min-h-[60vh]">
      {/* RootLayout already renders navbar/footer; keep this page content-only */}

      <div className="mx-auto max-w-6xl px-4 pt-24 pb-16">
        <div className="relative">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute top-10 -right-10 h-[260px] w-[260px] rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-zinc-300">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(0,217,255,0.9)]" />
                SMS-ONLY SUPPORT
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl font-light leading-[1.05] tracking-tight text-white">
                Contact us the fast way.
              </h1>

              <p className="mt-4 text-zinc-400 max-w-xl">
                For the quickest response, text our support line. Email is shown for display only—no
                email sending/integration.
              </p>

              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-6 overflow-hidden">
                  <div className="text-sm font-semibold text-white">SMS</div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <a
                      href={`sms:${CONTACT_PHONE}`}
                      className="rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-400 px-5 py-3 text-sm font-bold text-black hover:brightness-110 transition shadow-[0_0_50px_rgba(0,255,255,0.15)]"
                    >
                      {CONTACT_PHONE}
                    </a>
                    <span className="text-xs text-zinc-400">Text “HELP” for order & account support.</span>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-6">
                  <div className="text-sm font-semibold text-white">Email (display only)</div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-200">
                      {CONTACT_EMAIL_DISPLAY_ONLY}
                    </span>
                    <span className="text-xs text-zinc-400">No email sending/integration available.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/25 backdrop-blur-xl p-6">
              <div className="text-xs font-bold tracking-[0.25em] text-zinc-400 uppercase">What to include</div>
              <ul className="mt-4 space-y-3 text-zinc-300">
                {[
                  'Your name',
                  'Order ID (if you have one)',
                  'Issue summary (1–2 lines)',
                  'Best time to reply',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(0,217,255,0.85)]" />
                    <span className="text-sm">{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold text-white">Quick button</div>
                <div className="mt-4">
                  <a
                    href={`sms:${CONTACT_PHONE}?&body=${encodeURIComponent(
                      'Hi Plasma Atelier, I need help with my account/order. My name is ____.'
                    )}`}
                    className="w-full inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-400 px-5 py-3 text-sm font-bold text-black hover:brightness-110 transition"
                  >
                    Send an SMS template
                  </a>
                </div>
                <p className="mt-3 text-xs text-zinc-400">
                  This opens your phone’s SMS app. No email is sent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer/navbar are already rendered in RootLayout */}
    </div>
  );
}

