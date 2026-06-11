import type { Metadata } from 'next';

import LuxuryAuthCard from '@/components/auth/LuxuryAuthCard';
import { LuxuryAuthBackground } from '@/components/auth/LuxuryAuthBackground';

export const metadata: Metadata = {
  title: 'Login | RARE RAB IT',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-10">
      <LuxuryAuthBackground />
      <div className="relative z-10 w-full max-w-[620px]">
        {/* Wrap login card with OTP/verification flow inside the card */}
        <LuxuryAuthCard mode="login" />
      </div>
    </div>
  );
}





