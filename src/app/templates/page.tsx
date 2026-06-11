import type { Metadata } from 'next';

import { TemplatesGallery } from '@/components/templates/TemplatesGallery';

export const metadata: Metadata = {
  title: 'Templates | RARE RAB IT',
  description: 'Search, preview, and select templates',
};

export default function TemplatesPage() {
  return <TemplatesGallery />;
}

