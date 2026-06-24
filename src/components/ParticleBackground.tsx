'use client';

import React, { useEffect, useRef } from 'react';

interface DropletData {
  element: HTMLDivElement;
  x: number;
  y: number;
  r: number;
  vy: number;
  wobbleSpeed: number;
  wobbleAmount: number;
  wobbleOffset: number;
}

export const ParticleBackground: React.FC<{ opacity?: number }> = ({ opacity = 0.8 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const droplets: DropletData[] = [];
    const maxDroplets = 45;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create a pool of droplets
    for (let i = 0; i < maxDroplets; i++) {
      const drop = document.createElement('div');
      
      // Random radius between 6px and 22px
      const r = Math.random() * 16 + 6;
      
      // Styling drop to look like realistic water drop with highlights and background blur
      drop.style.position = 'absolute';
      drop.style.width = `${r * 2}px`;
      drop.style.height = `${r * 2}px`;
      drop.style.borderRadius = '50%';
      drop.style.pointerEvents = 'none';
      drop.style.border = '1px solid rgba(255, 255, 255, 0.28)';
      drop.style.background = 'rgba(255, 255, 255, 0.08)';
      
      // Realistic water droplet highlights (top-left light, bottom shadow, drop shadow on page)
      drop.style.boxShadow = `
        inset ${r * 0.2}px ${r * 0.2}px ${r * 0.3}px rgba(255, 255, 255, 0.45),
        inset -${r * 0.15}px -${r * 0.15}px ${r * 0.25}px rgba(0, 0, 0, 0.5),
        0 ${r * 0.2}px ${r * 0.3}px rgba(0, 0, 0, 0.35)
      `;
      
      // Blur the background under the water drop (high blur strength)
      drop.style.backdropFilter = `blur(${Math.max(16, r * 2)}px)`;
      drop.style.transform = 'translate(-50%, -50%)';
      drop.style.willChange = 'transform, top, left';
      
      container.appendChild(drop);

      // Random starting coordinates
      const x = Math.random() * width;
      const y = Math.random() * height;

      // 18% of drops slowly drip down, others are mostly static condensation
      const isDripping = Math.random() < 0.18;
      const vy = isDripping ? Math.random() * 1.5 + 0.5 : 0;

      droplets.push({
        element: drop,
        x,
        y,
        r,
        vy,
        wobbleSpeed: Math.random() * 0.05 + 0.02,
        wobbleAmount: Math.random() * 2 + 1,
        wobbleOffset: Math.random() * 100,
      });
    }

    let animationFrameId: number;
    let time = 0;

    const update = () => {
      time += 1;
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      droplets.forEach((drop) => {
        // If dripping, slide down
        if (drop.vy > 0) {
          drop.y += drop.vy;
          
          // Wobble slightly as it slides down
          const wobble = Math.sin(time * drop.wobbleSpeed + drop.wobbleOffset) * drop.wobbleAmount;
          drop.x += wobble * 0.1;

          // Reset to top if it goes offscreen
          if (drop.y > currentHeight + drop.r) {
            drop.y = -drop.r;
            drop.x = Math.random() * currentWidth;
          }
        }

        // Apply styles directly to bypass React virtual DOM overhead for 60fps
        drop.element.style.left = `${drop.x}px`;
        drop.element.style.top = `${drop.y}px`;
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    // Mouse interactive attraction: make drops slide faster when mouse is nearby
    const handleMouseMove = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;

      droplets.forEach((drop) => {
        const dx = mx - drop.x;
        const dy = my - drop.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // If mouse is very close (within 80px), make it fall
        if (dist < 80 && drop.vy === 0) {
          drop.vy = Math.random() * 2 + 1; // start dripping
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      // Re-adjust boundary positions on resize
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      droplets.forEach((drop) => {
        if (drop.x > currentWidth) drop.x = Math.random() * currentWidth;
        if (drop.y > currentHeight) drop.y = Math.random() * currentHeight;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
      style={{ opacity }}
    />
  );
};
