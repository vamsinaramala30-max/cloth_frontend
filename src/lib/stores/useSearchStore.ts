import { create } from 'zustand';
import type { Product, Collection } from '@/types';
import * as api from '@/lib/api';

interface SearchState {
  query: string;
  results: {
    products: Product[];
    collections: Collection[];
  };
  isSearching: boolean;
  error: string | null;

  setQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>()((set) => ({
  query: '',
  results: { products: [], collections: [] },
  isSearching: false,
  error: null,

  setQuery: (query) => set({ query }),

  search: async (query) => {
    if (!query.trim()) {
      set({ results: { products: [], collections: [] }, error: null, isSearching: false });
      return;
    }

    set({ isSearching: true, error: null });
    try {
      const response = await api.searchAll(query);
      if (response.error) {
        set({ error: response.error, results: { products: [], collections: [] } });
        return;
      }
      set({
        results: {
          products: response.data?.data?.products ?? [],
          collections: response.data?.data?.collections ?? [],
        },
        error: null,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Search failed',
        results: { products: [], collections: [] },
      });
    } finally {
      set({ isSearching: false });
    }
  },

  clearSearch: () =>
    set({ query: '', results: { products: [], collections: [] }, error: null, isSearching: false }),
}));
