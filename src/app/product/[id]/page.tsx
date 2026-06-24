import { redirect, notFound } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { fetchProductDetail } from '@/lib/api';
import { ProductDetailClient } from '@/components/ProductDetailClient';

type PageProps = {
  params: { id: string };
};

export default async function ProductDetailPage({ params }: PageProps) {
  // Check if it exists in mock products first by slug or ID
  const mockProduct = MOCK_PRODUCTS.find(
    (p) => p.slug === params.id || p.id === params.id
  );

  if (mockProduct) {
    // If it's a vault product, redirect to /vault/[slug]
    if (mockProduct.isVault) {
      redirect(`/vault/${mockProduct.slug}`);
    }
    redirect(`/products/${mockProduct.slug}`);
  }

  // Fall back to backend database
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