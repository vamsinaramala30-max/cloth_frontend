import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WishlistItem, Product } from '@/types';
import * as api from '@/lib/api';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;

  // Local actions (optimistic)
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Backend sync
  syncFromBackend: () => Promise<void>;
  toggleItemWithSync: (item: WishlistItem) => Promise<void>;

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
            items: [...state.items, { ...item, addedAt: new Date().toISOString() }],
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

      isInWishlist: (productId) => get().items.some((i) => i.productId === productId),

      clearWishlist: () => set({ items: [] }),

      syncFromBackend: async () => {
        set({ isLoading: true });
        try {
          const response = await api.getWishlist();
          if (response.data?.data) {
            const serverItems: WishlistItem[] = response.data.data.map((p: Product) => ({
              id: p._id || p.id,
              productId: p._id || p.id,
              name: p.name,
              price: p.salePrice ?? p.basePrice ?? p.price,
              image: p.images?.[0] ?? '',
              slug: p.slug,
              collection: p.collection,
              isVault: p.isVault,
            }));
            set({ items: serverItems });
          }
        } catch {
          // Keep local state on network failure
        } finally {
          set({ isLoading: false });
        }
      },

      toggleItemWithSync: async (item) => {
        const inWishlist = get().isInWishlist(item.productId);

        // Optimistic update
        get().toggleItem(item);

        try {
          if (inWishlist) {
            await api.removeFromWishlist(item.productId);
          } else {
            await api.addToWishlist(item.productId);
          }
        } catch {
          // Rollback on failure
          get().toggleItem(item);
        }
      },

      itemCount: () => get().items.length,
    }),
    {
      name: 'plasma-atelier-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
