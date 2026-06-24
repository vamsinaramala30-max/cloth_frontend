/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Product ──────────────────────────────────────────────────────────────────
export interface ProductVariant {
  sku: string;
  color: string;
  colorName: string;
  size: string;
  stock: number;
  images: string[];
}

export interface Product {
  // MongoDB field
  _id?: string;
  // Normalized
  id: string;
  slug: string;
  name: string;
  title?: string;
  subtitle?: string;
  description: string;
  shortDescription?: string;
  price: number;
  basePrice?: number;
  salePrice?: number;
  compareAtPrice?: number;
  images: string[];
  gallery?: string[];
  category: string;
  collection?: string;
  collections?: string[];
  inventory?: number;
  sku?: string;
  tags?: string[];
  materials?: string[];
  careInstructions?: string;
  isFeatured: boolean;
  isVault?: boolean;
  isActive?: boolean;
  inStock?: boolean;
  averageRating?: number;
  reviews?: number | Array<{ rating: number }>;
  sizes?: string[];
  colors?: string[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt?: string;
}

// ── Collection ────────────────────────────────────────────────────────────────
export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  bannerImage?: string;
  accentColor?: string;
  color: string;
  itemCount: number;
  productCount?: number;
  isActive?: boolean;
  sortOrder?: number;
  tags?: string[];
  createdAt?: string;
}

// ── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  name: string;
  image: string;
  slug?: string;
  collection?: string;
}

// ── Wishlist ──────────────────────────────────────────────────────────────────
export interface WishlistItem {
  id: string;          // productId
  productId: string;
  name: string;
  price: number;
  image: string;
  slug?: string;
  collection?: string;
  isVault?: boolean;
  addedAt?: string;
}

// ── Orders ────────────────────────────────────────────────────────────────────
export interface Order {
  _id: any;
  orderId: any;
  orderStatus: string;
  financials: any;
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderHistoryItem {
  _id: string;
  orderId?: string;
  orderStatus?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total?: number;
  financials?: { total?: number };
  trackingNumber?: string;
  estimatedDelivery?: string;
  courier?: string;
  items?: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

// ── User ──────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  _id?: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin' | 'customer' | 'superadmin';
  isVerified?: boolean;
  wishlist?: string[];
  addresses?: Array<{ label: string; street: string; city: string; country: string }>;
  createdAt: string;
  updatedAt?: string;
}

// ── Toast ─────────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}