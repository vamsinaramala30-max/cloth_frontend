// API Configuration
import config from '@/config/env';

const API_BASE_URL = config.apiUrl;

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT_DETAIL: (id: string) => `${API_BASE_URL}/products/${id}`,
  FILTERS: `${API_BASE_URL}/products/filters`,

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
  CART_ITEMS: `${API_BASE_URL}/cart/items`,

  // Wishlist
  WISHLIST: `${API_BASE_URL}/wishlist`,

  // Orders
  ORDERS: `${API_BASE_URL}/orders`,
  ORDER_DETAIL: (id: string) => `${API_BASE_URL}/orders/${id}`,

  // Payments
  PAYMENT: `${API_BASE_URL}/payments`,
  STRIPE_INTENT: `${API_BASE_URL}/payments/stripe/intent`,
  RAZORPAY_ORDER: `${API_BASE_URL}/payments/razorpay/order`,

  // Reviews
  PRODUCT_REVIEWS: (id: string) => `${API_BASE_URL}/products/${id}/reviews`,
  PRODUCT_RATINGS: (id: string) => `${API_BASE_URL}/products/${id}/ratings`,
};


export type ProductVariant = {
  sku: string;
  color: string;
  colorName: string;
  size: string;
  stock: number;
  images: string[];
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice?: number;
  category: string;
  collections: string[];
  tags: string[];
  variants: ProductVariant[];
  averageRating: number;
  isFeatured: boolean;
  isActive: boolean;
  reviews?: Array<{ rating: number }>;
};

export type ProductListResponse = {
  success: boolean;
  data: Product[];
  pagination: { total: number; page: number; pages: number };
};

export type ProductDetailsResponse = {
  success: boolean;
  data: Product;
};

export type FilterResponse = {
  success: boolean;
  data: { categories: string[]; collections: string[] };
};

export type User = {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'superadmin';
  isVerified: boolean;
  wishlist: string[];
  addresses: Array<{ label: string; street: string; city: string; country: string }>;
};

export type CartItem = {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
};

// OTP Auth
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

// Fetch wrapper with error handling
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
      return { error: errorBody?.message || 'An error occurred' };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

// Product APIs
export async function fetchProducts(params: {
  category?: string;
  collection?: string;
  sort?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const url = new URL(API_ENDPOINTS.PRODUCTS);

  if (params.category) url.searchParams.set('category', params.category);
  if (params.collection) url.searchParams.set('collection', params.collection);
  if (params.sort) url.searchParams.set('sort', params.sort);
  if (params.search) url.searchParams.set('search', params.search);
  if (params.page) url.searchParams.set('page', String(params.page));
  if (params.limit) url.searchParams.set('limit', String(params.limit));

  const response = await fetchAPI<ProductListResponse>(url.toString());
  return response;
}

export async function fetchProductDetail(id: string) {
  const response = await fetchAPI<ProductDetailsResponse>(API_ENDPOINTS.PRODUCT_DETAIL(id));
  return response;
}

export async function fetchFilters() {
  const response = await fetchAPI<FilterResponse>(API_ENDPOINTS.FILTERS);
  return response;
}

// Auth APIs
export async function register(email: string, password: string, name: string) {
  return fetchAPI(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

export async function login(email: string, password: string) {
  return fetchAPI(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return fetchAPI(API_ENDPOINTS.LOGOUT, { method: 'POST' });
}

export async function getMe() {
  return fetchAPI<{ user: User }>(API_ENDPOINTS.ME);
}

// Cart APIs
export async function addToCart(productId: string, variantSku: string, quantity: number, size: string, color: string) {
  return fetchAPI(API_ENDPOINTS.CART, {
    method: 'POST',
    body: JSON.stringify({ productId, variantSku, quantity, size, color }),
  });
}

export async function getCart() {
  return fetchAPI(API_ENDPOINTS.CART);
}

export async function updateCartItem(itemId: string, quantity: number) {
  return fetchAPI(`${API_ENDPOINTS.CART}/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export async function clearCart() {
  return fetchAPI(API_ENDPOINTS.CART, { method: 'DELETE' });
}

// Wishlist APIs
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

// OTP APIs
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

