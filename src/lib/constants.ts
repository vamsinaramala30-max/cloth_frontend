import { IMAGE_MAP } from './images';

export const COLORS = {
  primary: '#ffffff',
  secondary: '#000000',
  accent: '#00d9ff',
  glow: {
    cyan: '#00d9ff',
    purple: '#b366ff',
    pink: '#ff006e',
    gold: '#ffd700',
  },
  text: {
    primary: '#ffffff',
    secondary: '#a0a0a0',
    muted: '#666666',
  },
  bg: {
    dark: '#0a0a0a',
    darker: '#030303',
    surface: 'rgba(255, 255, 255, 0.05)',
  },
};

export const NAVIGATION = [
  { label: 'Collections', href: '/collections' },
  { label: 'Vault', href: '/vault' },
  { label: 'Shop', href: '/shop' },
  { label: 'Editorial', href: '/magazine' },
];

export const NAV_ACTIONS = [
  { label: 'Wishlist', href: '/wishlist', icon: 'heart' },
  { label: 'Cart', href: '/cart', icon: 'bag' },
  { label: 'Account', href: '/account', icon: 'user' },
];

export const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: '∞' },
  { id: 'men', label: 'Men', icon: '♂' },
  { id: 'women', label: 'Women', icon: '♀' },
  { id: 'unisex', label: 'Unisex', icon: '◆' },
  { id: 'limited', label: 'Limited', icon: '✦' },
];

export const FEATURED_COLLECTIONS = [
  {
    id: 1,
    title: 'Neural Silk',
    description: 'AI-Generated Aesthetic',
    image: IMAGE_MAP.collection,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 2,
    title: 'Quantum Weave',
    description: 'Futuristic Textiles',
    image: IMAGE_MAP.runway,
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 3,
    title: 'Ethereal Form',
    description: 'Luxury Minimalism',
    image: IMAGE_MAP.hero,
    color: 'from-gold-400 to-yellow-600',
  },
];

export const LOOKBOOK_COLLECTIONS = [
  {
    id: 'aurora-silk',
    title: 'Aurora Silk',
    subtitle: 'Cinematic editorial growth',
    description: 'A motion-driven lookbook where light, fabric, and futurism collide.',
    image: IMAGE_MAP.collection,
    accent: 'from-cyan-400 to-purple-500',
  },
  {
    id: 'plasma-atelier',
    title: 'Plasma Atelier',
    subtitle: 'Luxury lab collection',
    description: 'Digital couture for a runway built on AI, motion, and modern design.',
    image: IMAGE_MAP.runway,
    accent: 'from-purple-400 to-pink-500',
  },
  {
    id: 'quantum-tailor',
    title: 'Quantum Tailor',
    subtitle: 'Futuristic silhouettes',
    description: 'Editor-crafted pieces that feel like an elegant screen of premium technology.',
    image: IMAGE_MAP.editorial,
    accent: 'from-gold-400 to-yellow-500',
  },
];

export const TRENDING_SEARCHES = [
  'AI Runway',
  'Futuristic Outerwear',
  'Glass Couture',
  'Editorial Knitwear',
  'Neon Tailoring',
];

export const ANIMATIONS = {
  staggerContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 },
  },
};