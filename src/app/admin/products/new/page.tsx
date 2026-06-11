'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductFormClient, { type AdminProductInput } from '@/components/admin/ProductFormClient';
import config from '@/config/env';

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_API_TOKEN || '';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const create = async (values: AdminProductInput) => {
    setError('');
    setLoading(true);

    try {
      if (!ADMIN_TOKEN) {
        throw new Error('Missing NEXT_PUBLIC_ADMIN_API_TOKEN in frontend env');
      }

      const res = await fetch(`${config.apiUrl}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': ADMIN_TOKEN,
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(body?.message || body?.error || 'Failed to create product');
      }

      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-white text-3xl md:text-4xl font-light tracking-wider">Add Product</h1>
          <p className="text-zinc-500 text-sm mt-2">Owner-only creation via /api/admin/products</p>
        </div>

        {error ? <div className="mb-4 text-red-400 text-sm">{error}</div> : null}

        <ProductFormClient
          onSubmit={create}
          loading={loading}
          initial={{
            name: 'BUNNY BERRY',
            slug: '',
            description: 'A NICE PRODUCT',
            category: 'Unisex',
            collections: 'WITER',
            tags: 'VK',
            basePrice: 7999,
            salePrice: 5999,
            isFeatured: false,
            isActive: true,
            variants: [
              {
                sku: 'SHIRT-BLACK',
                color: 'Black',
                colorName: 'Classic',
                size: 'S',
                stock: 10,
                images: ['https://yourdomain.com/images/black-front.jpg'],
              },
              {
                sku: 'TSHIRT-BLK-M',
                color: 'Black',
                colorName: 'Classic',
                size: 'M',
                stock: 15,
                images: ['https://yourdomain.com/images/black-front.jpg'],
              },
              {
                sku: 'TSHIRT-WHT-L',
                color: 'White',
                colorName: 'Classic',
                size: 'L',
                stock: 9,
                images: ['https://yourdomain.com/images/white-front.jpg'],
              },
            ],
          }}

        />
      </div>
    </div>
  );
}

