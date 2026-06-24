import { create } from 'zustand';
import type { ToastMessage, ToastType } from '@/types';

interface ToastState {
  toasts: ToastMessage[];
  addToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],

  addToast: (type, title, message) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts.slice(-4), { id, type, title, message }],
    }));
    // Auto-remove after 4 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),
}));
