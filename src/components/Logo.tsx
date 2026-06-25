'use client';

import ManagedImage from './ManagedImage';

export default function Logo({ className, showText = false }: { className?: string; showText?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className || ''}`}>
      <div className="relative h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-md bg-white/5 border border-white/10">
        <ManagedImage src="/images/rare.jpeg" alt="Plasma Atelier logo" fill imgClassName="object-contain p-1" sizes="40px" />
      </div>

      {showText && (
        <span className="hidden sm:flex items-center gap-4">
          <span className="text-sm uppercase tracking-[0.35em] text-white whitespace-nowrap">
            Plasma Atelier
          </span>

          <span className="h-4 w-px bg-gradient-to-b from-cyan-300/60 to-purple-300/60" />

          <span className="text-sm uppercase tracking-[0.35em] whitespace-nowrap bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            Premium Luxury
          </span>
        </span>
      )}
    </div>
  );
}