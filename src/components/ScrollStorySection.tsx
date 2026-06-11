'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ScrollStorySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom+=200 center',
          scrub: 0.8,
          pin: false,
        },
      });

      timeline
        .from('.story-panel', { opacity: 0, y: 80, stagger: 0.25, duration: 1, ease: 'power3.out' })
        .to('.story-title', { letterSpacing: '0.8em', duration: 1, ease: 'power2.out' }, 0);
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-24 md:py-32 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/90" />
      <div className="relative z-20 max-w-7xl mx-auto grid gap-10 lg:grid-cols-[0.8fr_1.2fr] items-start">
        <div className="space-y-6">
          <p className="text-[10px] uppercase tracking-[0.45em] text-cyan-300">Story mode</p>
          <h2 className="story-title text-4xl md:text-6xl font-extralight uppercase tracking-[0.12em] text-white leading-tight">
            Scroll through the narrative of a designer’s world.
          </h2>
          <p className="text-sm md:text-base text-zinc-300 tracking-[0.18em] leading-relaxed">
            Each section reveals a new layer of luxury, lighting, and motion. Designed for high performance and cinematic impact.
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              title: 'Magnetic interaction',
              text: 'Hover and move across premium cards that respond with dynamic glow and parallax motion.',
            },
            {
              title: 'Video-style reveals',
              text: 'Products unfold in layered frames, blending soft motion blur with crisp editorial visuals.',
            },
            {
              title: 'GPU-accelerated particles',
              text: 'Canvas-driven elements keep the interface lively while preserving 60FPS performance.',
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              className="story-panel rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-3xl shadow-2xl shadow-cyan-500/10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-semibold text-white uppercase tracking-[0.12em] mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed tracking-[0.18em]">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
