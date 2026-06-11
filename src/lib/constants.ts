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
  { label: 'The Vault', href: '/shop' },
  { label: 'Lineage', href: '/lineage' },
  { label: 'Magazine', href: '/magazine' },
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
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2070',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 2,
    title: 'Quantum Weave',
    description: 'Futuristic Textiles',
    image: 'https://images.unsplash.com/photo-1552062407-c551eeda4921?q=80&w=2070',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 3,
    title: 'Ethereal Form',
    description: 'Luxury Minimalism',
    image: 'https://images.unsplash.com/photo-1490481651971-daf3dd63d3ff?q=80&w=2070',
    color: 'from-gold-400 to-yellow-600',
  },
];

export const LOOKBOOK_COLLECTIONS = [
  {
    id: 'aurora-silk',
    title: 'Aurora Silk',
    subtitle: 'Cinematic editorial growth',
    description: 'A motion-driven lookbook where light, fabric, and futurism collide.',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200',
    accent: 'from-cyan-400 to-purple-500',
  },
  {
    id: 'plasma-atelier',
    title: 'Plasma Atelier',
    subtitle: 'Luxury lab collection',
    description: 'Digital couture for a runway built on AI, motion, and modern design.',
    image:
      'https://images.unsplash.com/photo-1519895609932-f8d2ab928aec?q=80&w=1200',
    accent: 'from-purple-400 to-pink-500',
  },
  {
    id: 'quantum-tailor',
    title: 'Quantum Tailor',
    subtitle: 'Futuristic silhouettes',
    description: 'Editor-crafted pieces that feel like an elegant screen of premium technology.',
    image:
      'https://images.unsplash.com/photo-1520975918194-2a3a62a008d8?q=80&w=1200',
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
