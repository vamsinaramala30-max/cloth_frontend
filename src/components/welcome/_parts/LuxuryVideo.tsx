'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function LuxuryVideo({
  poster,
  className,
  reduced,
}: {
  poster: string;
  className?: string;
  reduced?: boolean;
}) {
  const [inView, setInView] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) {
      setShouldRender(false);
      setInView(false);
      return;
    }

    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          setShouldRender(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div ref={wrapRef} className={className}>
      {/* Lazy-load video only when in view */}
      {shouldRender ? (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          // Replace with your real luxury fashion video asset
          // Put it in /public/videos/rare-rab-it-fashion.mp4
          src="/videos/rare-rab-it-fashion.mp4"
        />
      ) : (
        <img
          src={poster}
          alt="Luxury fashion"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      )}

      {/* Optional light overlay tint */}
      <div className="absolute inset-0 pointer-events-none" />
    </div>
  );
}

