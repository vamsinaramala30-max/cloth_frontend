'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import * as api from '@/lib/api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;

  // Boot action — call once on app mount
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearAuth: () => set({ user: null, token: null, error: null }),
      isAuthenticated: () => get().user !== null,

      initAuth: async () => {
        // If we have a persisted user, still verify with the backend
        const state = get();
        if (state.isLoading) return;

        // Skip network call if there is no token (unauthenticated user)
        if (!state.token) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const response = await api.getMe();
          if (response.data?.user) {
            set({ user: response.data.user, error: null });
          } else {
            // Token is invalid / expired
            set({ user: null, token: null });
          }
        } catch {
          set({ user: null, token: null });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'plasma-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
