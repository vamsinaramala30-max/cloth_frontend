'use client';

import { useCallback, useState } from 'react';
import * as api from '@/lib/api';

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addToWishlist = useCallback(
    async (productId: string) => {
      setIsLoading(true);
      try {
        const response = await api.addToWishlist(productId);
        if (!response.error) {
          setWishlistItems((prev) => [...new Set([...prev, productId])]);
          return true;
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      setIsLoading(true);
      try {
        const response = await api.removeFromWishlist(productId);
        if (!response.error) {
          setWishlistItems((prev) => prev.filter((id) => id !== productId));
          return true;
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.includes(productId);
  }, [wishlistItems]);

  const fetchWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.getWishlist();
      if (response.data?.data) {
        setWishlistItems(response.data.data.map((product) => product._id));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist,
    wishlistItems,
    isLoading,
  };
};
