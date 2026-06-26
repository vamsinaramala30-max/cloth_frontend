import { create } from 'zustand';
import type { Product, Collection, Pagination } from '@/types';
import * as api from '@/lib/api';

interface ProductState {
  // Products
  products: Product[];
  featuredProducts: Product[];
  productPagination: Pagination | null;
  isLoadingProducts: boolean;
  productsError: string | null;

  // Collections
  collections: Collection[];
  isLoadingCollections: boolean;
  collectionsError: string | null;

  // Filters derived from API
  filters: {
    categories: string[];
    collections: string[];
    tags: string[];
  };

  // Actions
  fetchProducts: (params?: {
    category?: string;
    collection?: string;
    sort?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;

  fetchCollections: () => Promise<void>;
  setFilters: (filters: { categories: string[]; collections: string[]; tags: string[] }) => void;

  // Helpers
  getProductsByCollection: (slug: string) => Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getCollectionBySlug: (slug: string) => Collection | undefined;
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  featuredProducts: [],
  productPagination: null,
  isLoadingProducts: false,
  productsError: null,

  collections: [],
  isLoadingCollections: false,
  collectionsError: null,

  filters: { categories: [], collections: [], tags: [] },

  fetchProducts: async (params = {}) => {
    set({ isLoadingProducts: true, productsError: null });
    try {
      const response = await api.fetchProducts(params);
      if (response.error) {
        set({ productsError: response.error });
        return;
      }
      const data = response.data;
      if (data) {
        const products = data.data ?? [];
        set({
          products,
          featuredProducts: products.filter((p) => p.isFeatured),
          productPagination: data.pagination ?? null,
          productsError: null,
        });
      }
    } catch (err) {
      set({ productsError: err instanceof Error ? err.message : 'Failed to load products' });
    } finally {
      set({ isLoadingProducts: false });
    }
  },

  fetchCollections: async () => {
    set({ isLoadingCollections: true, collectionsError: null });
    try {
      const response = await api.fetchCollections();
      if (response.error) {
        set({ collectionsError: response.error });
        return;
      }
      const collections = response.data?.data ?? [];
      set({ collections, collectionsError: null });
    } catch (err) {
      set({ collectionsError: err instanceof Error ? err.message : 'Failed to load collections' });
    } finally {
      set({ isLoadingCollections: false });
    }
  },

  setFilters: (filters) => set({ filters }),

  getProductsByCollection: (slug) =>
    get().products.filter(
      (p) =>
        p.collection === slug ||
        (Array.isArray(p.collections) && p.collections.includes(slug))
    ),

  getProductBySlug: (slug) => get().products.find((p) => p.slug === slug),

  getCollectionBySlug: (slug) => get().collections.find((c) => c.slug === slug),
}));