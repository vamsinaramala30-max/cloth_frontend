'use client';

import * as api from '@/lib/api';

export type CartLine = {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
};

export async function getCartLines(): Promise<CartLine[]> {
  const response = await api.getCart();
  const cart = response.data as any;
  const items = cart?.data?.items ?? cart?.items ?? [];
  return (items || []).map((it: any) => ({
    _id: it._id,
    productId: it.productId,
    name: it.name,
    price: it.price,
    quantity: it.quantity,
    size: it.size,
    color: it.color,
    image: it.image,
  }));
}

export async function removeCartLine(itemId: string) {
  return api.updateCartItem(itemId, 0);
}

export async function setCartLineQuantity(itemId: string, quantity: number) {
  return api.updateCartItem(itemId, quantity);
}

