import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateGlowEffect(intensity: 'low' | 'medium' | 'high' = 'medium') {
  const glows = {
    low: '0 0 20px rgba(0, 217, 255, 0.3)',
    medium: '0 0 40px rgba(0, 217, 255, 0.5)',
    high: '0 0 60px rgba(0, 217, 255, 0.8)',
  };
  return glows[intensity];
}

export function getRandomGlowColor() {
  const colors = [
    'rgba(0, 217, 255, 0.5)',      // Cyan
    'rgba(179, 102, 255, 0.5)',    // Purple
    'rgba(255, 0, 110, 0.5)',      // Pink
    'rgba(255, 215, 0, 0.5)',      // Gold
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function generateParticle(x: number, y: number) {
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    life: 1,
    decay: Math.random() * 0.02 + 0.005,
    size: Math.random() * 3 + 1,
    color: getRandomGlowColor(),
  };
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function smoothScroll(element: HTMLElement, target: number, duration: number = 1000) {
  const start = element.scrollLeft;
  const distance = target - start;
  const startTime = Date.now();

  const ease = (t: number) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const scroll = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    element.scrollLeft = start + distance * ease(progress);

    if (progress < 1) {
      requestAnimationFrame(scroll);
    }
  };

  scroll();
}
