// API Configuration
import config from '@/config/env';
import type { CartItem, OrderHistoryItem, Product, Collection, User } from '@/types';

const API_BASE_URL = config.apiUrl;

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT_DETAIL: (id: string) => `${API_BASE_URL}/products/${id}`,
  PRODUCT_BY_SLUG: (slug: string) => `${API_BASE_URL}/products/slug/${slug}`,
  FILTERS: `${API_BASE_URL}/products/filters`,

  // Collections
  COLLECTIONS: `${API_BASE_URL}/collections`,
  COLLECTION_DETAIL: (slug: string) => `${API_BASE_URL}/collections/${slug}`,
  COLLECTION_PRODUCTS: (slug: string) => `${API_BASE_URL}/collections/${slug}/products`,

  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  ME: `${API_BASE_URL}/account/me`,

  // OTP Auth
  OTP_SEND: `${API_BASE_URL}/otp/send`,
  OTP_VERIFY: `${API_BASE_URL}/otp/verify`,

  // Cart
  CART: `${API_BASE_URL}/cart`,
  CART_ITEM: (itemId: string) => `${API_BASE_URL}/cart/${itemId}`,

  // Wishlist
  WISHLIST: `${API_BASE_URL}/wishlist`,

  // Orders
  ORDERS: `${API_BASE_URL}/orders`,
  ORDER_DETAIL: (id: string) => `${API_BASE_URL}/orders/${id}`,
  ORDER_HISTORY: `${API_BASE_URL}/orders/history`,

  // Payments
  PAYMENT: `${API_BASE_URL}/payments`,
  STRIPE_INTENT: `${API_BASE_URL}/payments/stripe/intent`,
  RAZORPAY_ORDER: `${API_BASE_URL}/payments/razorpay/order`,

  // Reviews
  PRODUCT_REVIEWS: (id: string) => `${API_BASE_URL}/products/${id}/reviews`,
  PRODUCT_RATINGS: (id: string) => `${API_BASE_URL}/products/${id}/ratings`,

  // Search
  SEARCH: `${API_BASE_URL}/search`,
};

// ── Response Types ────────────────────────────────────────────────────────────

export type ProductListResponse = {
  success: boolean;
  data: Product[];
  pagination: { total: number; page: number; pages: number };
};

export type ProductDetailsResponse = {
  success: boolean;
  data: Product;
};

export type CollectionListResponse = {
  success: boolean;
  data: Collection[];
};

export type CollectionDetailResponse = {
  success: boolean;
  data: Collection & { products?: Product[] };
};

export type FilterResponse = {
  success: boolean;
  data: { 
    categories: string[]; 
    collections: string[];
    colors?: string[];
    sizes?: string[];
  };
};

export type LoginResponseData = {
  user: User;
  token: string;
};

export type CartResponse = {
  data: {
    items: CartItem[];
  };
};

export type OrderHistoryResponse = {
  data?: { data?: OrderHistoryItem[] } | OrderHistoryItem[];
};

export type OtpSendPayload = {
  email?: string;
  phone?: string;
  action: string;
};

export type OtpVerifyPayload = {
  email?: string;
  phone?: string;
  otp: string;
};

export type OtpResponse = {
  success: boolean;
  message?: string;
  expiresInMinutes?: number;
  user?: { name: string; email: string; role: 'customer' | 'admin' | 'superadmin' };
};

export type StripeIntentResponse = {
  clientSecret: string;
  orderId: string;
};

export type RazorpayOrderResponse = {
  id: string;
  amount: number;
  currency: string;
  orderId: string;
};

export type SearchResponse = {
  success: boolean;
  data: {
    products: Product[];
    collections: Collection[];
  };
};

// Re-export User from types for backwards compat
export type { User } from '@/types';

// ── Core Fetch Wrapper ────────────────────────────────────────────────────────

export async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      return { error: errorBody?.message || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

// ── Product APIs ──────────────────────────────────────────────────────────────

export async function fetchProducts(params: {
  category?: string;
  collection?: string;
  sort?: string;
  search?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  availability?: string;
  featured?: boolean;
  newArrivals?: boolean;
  bestSellers?: boolean;
}) {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'All Items' && params.category !== 'All') {
    query.set('category', params.category);
  }
  if (params.collection && params.collection !== 'All') query.set('collection', params.collection);
  if (params.sort) query.set('sort', params.sort);
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.minPrice !== undefined) query.set('minPrice', String(params.minPrice));
  if (params.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
  if (params.color) query.set('color', params.color);
  if (params.size) query.set('size', params.size);
  if (params.availability) query.set('availability', params.availability);
  if (params.featured !== undefined) query.set('featured', String(params.featured));
  if (params.newArrivals !== undefined) query.set('newArrivals', String(params.newArrivals));
  if (params.bestSellers !== undefined) query.set('bestSellers', String(params.bestSellers));

  const url = `${API_ENDPOINTS.PRODUCTS}${query.toString() ? `?${query}` : ''}`;
  return fetchAPI<ProductListResponse>(url);
}

export async function fetchProductDetail(id: string) {
  return fetchAPI<ProductDetailsResponse>(API_ENDPOINTS.PRODUCT_DETAIL(id));
}

export async function fetchProductBySlug(slug: string) {
  return fetchAPI<ProductDetailsResponse>(API_ENDPOINTS.PRODUCT_BY_SLUG(slug));
}

export async function fetchFilters() {
  return fetchAPI<FilterResponse>(API_ENDPOINTS.FILTERS);
}

// ── Collection APIs ───────────────────────────────────────────────────────────

export async function fetchCollections() {
  return fetchAPI<CollectionListResponse>(API_ENDPOINTS.COLLECTIONS);
}

export async function fetchCollectionBySlug(slug: string) {
  return fetchAPI<CollectionDetailResponse>(API_ENDPOINTS.COLLECTION_DETAIL(slug));
}

export async function fetchCollectionProducts(slug: string, params?: { sort?: string; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.sort) query.set('sort', params.sort);
  if (params?.limit) query.set('limit', String(params.limit));
  const url = `${API_ENDPOINTS.COLLECTION_PRODUCTS(slug)}${query.toString() ? `?${query}` : ''}`;
  return fetchAPI<ProductListResponse>(url);
}

// ── Search API ────────────────────────────────────────────────────────────────

export async function searchAll(query: string) {
  const url = `${API_ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`;
  return fetchAPI<SearchResponse>(url);
}

// ── Auth APIs ─────────────────────────────────────────────────────────────────

export async function register(email: string, password: string, name: string) {
  return fetchAPI(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

export async function login(email: string, password: string) {
  return fetchAPI<LoginResponseData>(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return fetchAPI(API_ENDPOINTS.LOGOUT, { method: 'POST' });
}

export async function getMe() {
  return fetchAPI<{ user: import('@/types').User }>(API_ENDPOINTS.ME);
}

export async function updateProfile(payload: { name: string; phone?: string }) {
  return fetchAPI<{ data: import('@/types').User }>(API_ENDPOINTS.ME, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

// ── Cart APIs ─────────────────────────────────────────────────────────────────

export async function addToCart(productId: string, variantSku: string, quantity: number, size: string, color: string) {
  return fetchAPI(API_ENDPOINTS.CART, {
    method: 'POST',
    body: JSON.stringify({ productId, variantSku, quantity, size, color }),
  });
}

export async function getCart() {
  return fetchAPI<CartResponse>(API_ENDPOINTS.CART);
}

export async function updateCartItem(itemId: string, quantity: number) {
  return fetchAPI(API_ENDPOINTS.CART_ITEM(itemId), {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(itemId: string) {
  return fetchAPI(API_ENDPOINTS.CART_ITEM(itemId), { method: 'DELETE' });
}

export async function clearCart() {
  return fetchAPI(API_ENDPOINTS.CART, { method: 'DELETE' });
}

// ── Wishlist APIs ─────────────────────────────────────────────────────────────

export async function addToWishlist(productId: string) {
  return fetchAPI(API_ENDPOINTS.WISHLIST, {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
}

export async function removeFromWishlist(productId: string) {
  return fetchAPI(API_ENDPOINTS.WISHLIST, {
    method: 'DELETE',
    body: JSON.stringify({ productId }),
  });
}

export async function getWishlist() {
  return fetchAPI<{ data: Product[] }>(API_ENDPOINTS.WISHLIST);
}

// ── Order APIs ────────────────────────────────────────────────────────────────

export async function fetchOrderHistory() {
  return fetchAPI<OrderHistoryResponse>(API_ENDPOINTS.ORDER_HISTORY, { method: 'GET' });
}

// ── OTP APIs ──────────────────────────────────────────────────────────────────

export async function sendOtp(payload: OtpSendPayload) {
  return fetchAPI<OtpResponse>(API_ENDPOINTS.OTP_SEND, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function verifyOtp(payload: OtpVerifyPayload) {
  return fetchAPI<OtpResponse>(API_ENDPOINTS.OTP_VERIFY, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}