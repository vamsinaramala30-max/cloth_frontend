import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User } from '@/lib/api';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
}

export interface AppStore {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;

  // User
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;

  // UI
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((c) => c.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((c) =>
                c.id === item.id ? { ...c, quantity: c.quantity + item.quantity } : c
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      updateCartQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ cart: [] }),
      cartTotal: () =>
        get().cart.reduce((total, item) => total + item.price * item.quantity, 0),

      // User
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      isAuthenticated: () => get().user !== null,

      // UI
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
    }),
    { name: 'app-store' }
  )
);