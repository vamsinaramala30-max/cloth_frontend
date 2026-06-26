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
  { label: 'Products', href: '/products' },
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