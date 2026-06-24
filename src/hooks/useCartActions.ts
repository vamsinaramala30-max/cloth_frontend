'use client';

import { useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import * as api from '@/lib/api';

export const useCartActions = () => {
  const { removeFromCart, updateCartQuantity } = useAppStore();

  const addToCart = useCallback(
    async (productId: string, variantSku: string, quantity: number, size: string, color: string) => {
      try {
        const response = await api.addToCart(productId, variantSku, quantity, size, color);
        if (response.error) {
          console.error('Add to cart error:', response.error);
          return false;
        }
        return true;
      } catch (err) {
        console.error('Add to cart error:', err);
        return false;
      }
    },
    []
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      try {
        await api.updateCartItem(itemId, 0);
        removeFromCart(itemId);
        return true;
      } catch (err) {
        console.error('Remove from cart error:', err);
        return false;
      }
    },
    [removeFromCart]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        await api.updateCartItem(itemId, quantity);
        updateCartQuantity(itemId, quantity);
        return true;
      } catch (err) {
        console.error('Update quantity error:', err);
        return false;
      }
    },
    [updateCartQuantity]
  );

  return { addToCart, removeItem, updateQuantity };
};