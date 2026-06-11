import type { Metadata } from 'next';

import LuxuryAuthCard from '@/components/auth/LuxuryAuthCard';
import { LuxuryAuthBackground } from '@/components/auth/LuxuryAuthBackground';

export const metadata: Metadata = {
  title: 'Register | RARE RAB IT',
  description: 'Create your account',
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-10">
      <LuxuryAuthBackground />
      <div className="relative z-10 w-full max-w-[520px]">
        <LuxuryAuthCard mode="register" />
      </div>
    </div>
  );
}




