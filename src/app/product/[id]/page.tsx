import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';
import { fetchProductDetail } from '@/lib/api';
import { ProductDetailClient } from '@/components/ProductDetailClient';

type PageProps = {
  params: { id: string };
};

export default async function ProductDetailPage({ params }: PageProps) {
  try {
    const response = await fetchProductDetail(params.id);
    if (!response.data?.data) {
      notFound();
    }
    const product = response.data.data;
    return <ProductDetailClient product={product} />;
  } catch {
    notFound();
  }
}