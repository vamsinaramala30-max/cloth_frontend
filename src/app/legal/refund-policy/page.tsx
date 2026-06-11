import type { Metadata } from 'next';
import RefundPolicyPage from '@/app/refund-policy/page';

export const metadata: Metadata = {
  title: 'Refund Policy | RARE RAB IT',
  description: 'Return eligibility, refund timeline, and policy details for RARE RAB IT.',
};

export default function RefundPolicyWrapper() {
  return <RefundPolicyPage />;
}

