'use client';

import React from 'react';
import ManagedImage from './ManagedImage';
import { IMAGE_MAP } from '../lib/images';

export default function HomeHeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />


      {/* Dynamic, performant hero background (do not change existing background) */}
      <ManagedImage
        src={IMAGE_MAP.hero}
        alt="Hero background"
        fill
        priority
        className="object-cover opacity-60 will-change-transform"
        sizes="100vw"
      />


      {/* Second background image (additive, keep existing background) */}
      <ManagedImage
        src={IMAGE_MAP.background}
        alt="Secondary hero background"
        fill
        className="object-cover opacity-35 will-change-transform mix-blend-screen"
        sizes="100vw"
      />

      {/* Glow layers (more dynamic) */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,217,255,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(179,102,255,0.18),transparent_45%)]" />

      {/* Animated color sweep */}
      <div className="absolute inset-0 opacity-70 [background:linear-gradient(120deg,transparent_0%,rgba(0,217,255,0.18)_30%,transparent_60%)] animate-[hero-sweep_6s_ease-in-out_infinite]" />

      {/* Subtle vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.6)_100%)]" />

    </div>
  );
}