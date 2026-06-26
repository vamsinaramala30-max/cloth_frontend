import type { Metadata } from 'next';
import { Inter, Space_Mono } from 'next/font/google';
import '../app/globals.css';
import { Footer } from '@/components/Footer';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

const FloatingNavbar = dynamic(() => import('@/components/FloatingNavbar').then((m) => m.FloatingNavbar), { ssr: false });
const ParticleBackground = dynamic(() => import('@/components/ParticleBackground').then((m) => m.ParticleBackground), { ssr: false });
const SmoothScroll = dynamic(() => import('@/components/SmoothScroll').then((m) => m.SmoothScroll), { ssr: false });
const CursorGlow = dynamic(() => import('@/components/CursorGlow').then((m) => m.CursorGlow), { ssr: false });
const PageTransition = dynamic(() => import('@/components/PageTransition').then((m) => m.PageTransition), { ssr: false });
const CartDrawer = dynamic(() => import('@/components/CartDrawer').then((m) => m.CartDrawer), { ssr: false });
const ToastContainer = dynamic(() => import('@/components/ui/ToastContainer').then((m) => m.ToastContainer), { ssr: false });

export const metadata: Metadata = {
  title: 'Plasma Atelier | Futuristic Luxury Fashion',
  description:
    'Next-generation luxury fashion experience. AI-designed digital couture, cinematic editorial storytelling, and immersive premium shopping.',
  keywords:
    'luxury fashion, futuristic design, AI fashion, digital couture, haute couture, Plasma Atelier, luxury clothing',
  openGraph: {
    title: 'Plasma Atelier | Futuristic Luxury Fashion',
    description: 'Experience the future of luxury fashion — digital couture meets AI.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceMono.variable}`}>
      <body
        className="text-luxury-accent overflow-x-hidden relative min-h-screen font-sans"
        suppressHydrationWarning
      >
        <SmoothScroll />
        <CursorGlow />

        {/* Global Background Image (z-0) */}
        <div className="fixed inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/images/background/hero-background.webp"
            alt="Global Background"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Dark Overlays (z-[1]) */}
        <div className="fixed inset-0 z-[1] bg-black/40 pointer-events-none" />
        <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/25 via-transparent to-black/80 pointer-events-none" />

        {/* Global Glassmorphism Frosted Layer */}
        <div className="fixed inset-0 z-[1] bg-white/[0.01] backdrop-blur-[6px] pointer-events-none" />

        {/* Particle Background */}
        <ParticleBackground opacity={0.2} />

        {/* Floating Navigation */}
        <FloatingNavbar />

        {/* Cart Drawer (global) */}
        <CartDrawer />

        {/* Toast Notifications (global) */}
        <ToastContainer />

        {/* Main Content (z-10) */}
        <main className="relative z-10 min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>

        {/* Footer (z-10) */}
        <div className="relative z-10">
          <Footer />
        </div>
      </body>
    </html>
  );
}