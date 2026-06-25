import type { Metadata } from 'next';
import RefundPolicyPage from '@/app/refund-policy/page';

export const metadata: Metadata = {
  title: 'Refund Policy | Plasma Atelier',
  description: 'Return eligibility, refund timeline, and policy details for Plasma Atelier.',
};

export default function RefundPolicyWrapper() {
  return <RefundPolicyPage />;
}

