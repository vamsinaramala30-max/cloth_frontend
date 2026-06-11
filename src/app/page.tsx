import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const HomeClient = dynamic(() => import('./HomeClient'), { ssr: false });

export default function Home() {
  return (
    <div className="relative z-0">
      {/* Announcement Bar */}
      <div className="relative z-30 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4 text-xs text-zinc-300">
          <p className="tracking-widest uppercase">
            Limited Drop • Free Shipping Over $5000
          </p>
          <Link
            href="/shop"
            className="text-cyan-400 hover:text-cyan-300 transition-colors tracking-widest uppercase font-semibold"
          >
            Shop Now →
          </Link>
        </div>
      </div>

      {/* Glass Navbar is provided globally by FloatingNavbar */}

      {/* Hero Section */}
      <HomeClient />

    </div>
  );
}



