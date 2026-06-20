import type { Metadata } from 'next';
import '../app/globals.css';





import { Footer } from '@/components/Footer';
import dynamic from 'next/dynamic';

const FloatingNavbar = dynamic(() => import('@/components/FloatingNavbar').then(m => m.FloatingNavbar), { ssr: false });
const ParticleBackground = dynamic(() => import('@/components/ParticleBackground').then(m => m.ParticleBackground), { ssr: false });
const SmoothScroll = dynamic(() => import('@/components/SmoothScroll').then(m => m.SmoothScroll), { ssr: false });
const CursorGlow = dynamic(() => import('@/components/CursorGlow').then(m => m.CursorGlow), { ssr: false });
const PageTransition = dynamic(() => import('@/components/PageTransition').then(m => m.PageTransition), { ssr: false });


export const metadata: Metadata = {
  title: 'RARE RAB IT | Futuristic Luxury Fashion',
  description:
    'Next-generation luxury fashion-tech experience. AI-designed aesthetics, cinematic storytelling, and immersive shopping.',

  keywords:
    'luxury fashion, futuristic design, AI fashion, luxury clothing, haute couture',
  openGraph: {
    title: 'RARE RAB IT | Futuristic Luxury Fashion',
    description: 'Experience the future of luxury fashion',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-luxury-darker text-luxury-accent overflow-x-hidden">
        <SmoothScroll />
        <CursorGlow />

        {/* Particle Background */}
        <ParticleBackground opacity={0.2} />
        
        {/* Floating Navigation */}
        <FloatingNavbar />


        {/* Main Content */}
        <main className="relative min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}

