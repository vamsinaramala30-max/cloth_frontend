'use client';

import { LuxuryAuthBackground } from '@/components/auth/LuxuryAuthBackground';
import LuxuryAuthCard from '@/components/auth/LuxuryAuthCard';

export default function AuthPage() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-10">
      <LuxuryAuthBackground />
      <div className="relative z-10 w-full max-w-[520px]">
        <LuxuryAuthCard mode="register" />
      </div>
    </div>
  );
}



