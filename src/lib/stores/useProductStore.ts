import { create } from 'zustand';
import type { Product, Collection } from '@/types';

interface ProductState {
  products: Product[];
  collections: Collection[];
  vaultProducts: Product[];
  featuredProducts: Product[];
  filters: {
    categories: string[];
    collections: string[];
    tags: string[];
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setProducts: (products: Product[]) => void;
  setCollections: (collections: Collection[]) => void;
  setVaultProducts: (products: Product[]) => void;
  setFeaturedProducts: (products: Product[]) => void;
  setFilters: (filters: { categories: string[]; collections: string[]; tags: string[] }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Helpers
  getProductsByCollection: (slug: string) => Product[];
  getProductBySlug: (slug: string) => Product | undefined;
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  collections: [],
  vaultProducts: [],
  featuredProducts: [],
  filters: { categories: [], collections: [], tags: [] },
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setCollections: (collections) => set({ collections }),
  setVaultProducts: (vaultProducts) => set({ vaultProducts }),
  setFeaturedProducts: (featuredProducts) => set({ featuredProducts }),
  setFilters: (filters) => set({ filters }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  getProductsByCollection: (slug) =>
    get().products.filter(
      (p) =>
        p.collection === slug ||
        (Array.isArray(p.collections) && p.collections.includes(slug))
    ),

  getProductBySlug: (slug) =>
    get().products.find((p) => p.slug === slug),
}));
