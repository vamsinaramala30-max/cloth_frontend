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
