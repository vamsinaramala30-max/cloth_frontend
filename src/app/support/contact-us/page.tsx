import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Plasma Atelier',
  description: 'Send a message to Plasma Atelier support. We respond with premium guidance for your order and questions.',
};

export default function ContactUsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 text-zinc-300">
      <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
        Contact Us
      </h1>

      <p className="mt-6 text-zinc-400 leading-relaxed">
        Share your details and we’ll route your request to the right team.
        (Connect the submission endpoint when available.)
      </p>

      <form className="mt-10 space-y-4" action="#" method="post">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-zinc-200">Name</span>
            <input
              name="name"
              required
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-cyan-400 outline-none"
              placeholder="Your name"
              aria-label="Name"
            />
          </label>
          <label className="block">
            <span className="text-sm text-zinc-200">Email</span>
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-cyan-400 outline-none"
              placeholder="you@domain.com"
              aria-label="Email"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-zinc-200">Phone</span>
            <input
              name="phone"
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-cyan-400 outline-none"
              placeholder="Optional"
              aria-label="Phone"
            />
          </label>
          <label className="block">
            <span className="text-sm text-zinc-200">Subject</span>
            <input
              name="subject"
              required
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-cyan-400 outline-none"
              placeholder="Order, returns, sizing, etc."
              aria-label="Subject"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-zinc-200">Message</span>
          <textarea
            name="message"
            required
            rows={6}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-cyan-400 outline-none"
            placeholder="Tell us what you need..."
            aria-label="Message"
          />
        </label>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 text-black font-bold tracking-widest uppercase text-xs hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          Send Message
        </button>

        <p className="text-xs text-zinc-500">
          Note: backend submission wiring will connect to the existing server endpoint for storing contact requests.
        </p>
      </form>
    </article>
  );
}

