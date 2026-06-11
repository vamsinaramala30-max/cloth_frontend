import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | RARE RAB IT',
  description: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-zinc-300">
      <h1 className="text-3xl text-white font-light">Privacy Policy</h1>
      <p className="mt-4 text-zinc-400">
        This is a new legal page added without modifying existing routes. Replace this placeholder content with your official privacy policy.
      </p>
    </div>
  );
}

