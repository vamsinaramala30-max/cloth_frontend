import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '@/types';
import * as api from '@/lib/api';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;

  // Local actions (instant, optimistic)
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  // Backend sync
  syncFromBackend: () => Promise<void>;
  addItemAndSync: (
    productId: string,
    variantSku: string,
    quantity: number,
    size: string,
    color: string,
    localItem: CartItem
  ) => Promise<boolean>;

  // Computed helpers
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.size === item.size && i.color === item.color
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, id: item.id || `${item.productId}-${item.size}-${item.color}-${Date.now()}` },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          return {
            items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
          };
        }),

      clearCart: () => set({ items: [] }),

      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

      syncFromBackend: async () => {
        set({ isLoading: true });
        try {
          const response = await api.getCart();
          if (response.data?.data?.items) {
            set({ items: response.data.data.items });
          }
        } catch {
          // Keep local state on network failure
        } finally {
          set({ isLoading: false });
        }
      },

      addItemAndSync: async (productId, variantSku, quantity, size, color, localItem) => {
        // Optimistic add first
        get().addItem(localItem);
        try {
          const response = await api.addToCart(productId, variantSku, quantity, size, color);
          if (response.error) {
            // Rollback on failure
            get().removeItem(localItem.id);
            return false;
          }
          return true;
        } catch {
          get().removeItem(localItem.id);
          return false;
        }
      },

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'plasma-atelier-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
