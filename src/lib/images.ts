export const IMAGE_MAP = {
  hero: '/images/hero.webp',
  editorial: '/images/editorial.webp',
  collection: '/images/collection.webp',
  runway: '/images/runway.webp',
  background: '/images/background.webp',
  placeholder: '/images/vk/placeholder.png'
} as const;

export function getLocalProductImage(nameOrId: string, index: number = 0): string {
  const list = [
    '/images/hero.webp',
    '/images/editorial.webp',
    '/images/collection.webp',
    '/images/runway.webp',
    '/images/background.webp',
    '/images/image1.jpeg',
    '/images/img2.jpeg',
    '/images/backimg.jpeg',
    '/images/rare.jpeg',
  ];
  let hash = 0;
  const str = nameOrId || '';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash + index) % list.length;
  return list[idx];
}

const AVAILABLE_LOCAL_IMAGES = new Set([
  '/images/hero.webp',
  '/images/editorial.webp',
  '/images/collection.webp',
  '/images/runway.webp',
  '/images/background.webp',
  '/images/image1.jpeg',
  '/images/img2.jpeg',
  '/images/backimg.jpeg',
  '/images/rare.jpeg',
  '/images/vk/editorial-background.webp',
  '/images/vk/placeholder.png',
]);

export function getSafeProductImage(imagePath: string | undefined, nameOrId: string, index: number = 0): string {
  if (!imagePath) return getLocalProductImage(nameOrId, index);
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (AVAILABLE_LOCAL_IMAGES.has(imagePath)) {
    return imagePath;
  }
  return getLocalProductImage(nameOrId, index);
}
