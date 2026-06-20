'use client';

import React, { useMemo } from 'react';

export default function AuroraOverlays() {
  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute -top-20 left-1/4 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-[12%] right-[10%] h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[15%] h-[420px] w-[420px] rounded-full bg-pink-500/10 blur-3xl" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      <div className="absolute -top-20 left-1/4 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-3xl animate-[aurora-float_8s_ease-in-out_infinite]" />
      <div className="absolute top-[12%] right-[10%] h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-3xl animate-[aurora-float_10s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] left-[15%] h-[420px] w-[420px] rounded-full bg-pink-500/10 blur-3xl animate-[aurora-float_12s_ease-in-out_infinite]" />
      <style jsx global>{`
        @keyframes aurora-float {
          0% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(-18px, 12px, 0) scale(1.03); }
          100% { transform: translate3d(0,0,0) scale(1); }
        }
      `}</style>
    </div>
  );
}

