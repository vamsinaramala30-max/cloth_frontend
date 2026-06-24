'use client';

import React from 'react';

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div className={`group rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] ${className}`}>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/[0.04] animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent skeleton-shimmer" />
      </div>
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 rounded-full bg-white/10 animate-pulse" />
        <div className="h-4 w-3/4 rounded-full bg-white/10 animate-pulse" />
        <div className="h-3 w-1/2 rounded-full bg-white/[0.07] animate-pulse" />
        <div className="flex items-center justify-between mt-4">
          <div className="h-5 w-20 rounded-full bg-white/10 animate-pulse" />
          <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
