import type { Metadata } from 'next';

import { TemplatesGallery } from '@/components/templates/TemplatesGallery';

export const metadata: Metadata = {
  title: 'Templates | Plasma Atelier',
  description: 'Search, preview, and select templates',
};

export default function TemplatesPage() {
  return <TemplatesGallery />;
}

