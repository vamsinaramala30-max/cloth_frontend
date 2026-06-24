import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WishlistItem } from '@/types';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;

  // Actions
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Computed
  itemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.productId === item.productId);
          if (exists) return state;
          return {
            items: [
              ...state.items,
              { ...item, addedAt: new Date().toISOString() },
            ],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      toggleItem: (item) => {
        const inWishlist = get().isInWishlist(item.productId);
        if (inWishlist) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },

      isInWishlist: (productId) =>
        get().items.some((i) => i.productId === productId),

      clearWishlist: () => set({ items: [] }),

      itemCount: () => get().items.length,
    }),
    {
      name: 'plasma-atelier-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
