import type { Metadata } from 'next';

import { WelcomeLanding } from '@/components/welcome/WelcomeLanding';

export const metadata: Metadata = {
  title: 'Welcome | Plasma Atelier',
  description: 'Premium futuristic luxury fashion experience',
};

export default function WelcomePage() {
  return <WelcomeLanding />;
}

