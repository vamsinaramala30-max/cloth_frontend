'use client';

'use client';

import dynamic from 'next/dynamic';

// Build/prerender safety: render the dashboard only on the client.
// This avoids SSR/export crashes from browser-only globals used by deeply imported UI libs.
const AccountDashboardClient = dynamic(
  () => import('./AccountDashboardClient'),
  { ssr: false }
);

export default function AccountDashboardPage() {
  return <AccountDashboardClient />;
}


