'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';

import Logo from '@/components/Logo';

import { GlassCard } from '@/components/GlassCard';

const LuxuryVideo = dynamic(() => import('./_parts/LuxuryVideo'), { ssr: false });
const CityLights = dynamic(() => import('./_parts/CityLights'), { ssr: false });
const AuroraOverlays = dynamic(() => import('./_parts/AuroraOverlays').then((m) => m.default), { ssr: false });
const LuxuryTemplatesRail = dynamic(() => import('./_parts/LuxuryTemplatesRail'), { ssr: false });


function useSafePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const apply = () => setReduced(!!mq.matches);
    apply();

    // Safari compatibility
    const anyMq = mq as any;
    if (anyMq.addEventListener) {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }

    mq.addListener(apply);
    return () => mq.removeListener(apply);
  }, []);

  return reduced;
}

export function WelcomeLanding() {
  const prefersReducedMotion = useSafePrefersReducedMotion();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const logoTextRef = useRef<HTMLDivElement | null>(null);

  const [soundOn, setSoundOn] = useState(false);
  const [soundLoaded, setSoundLoaded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const [phase, setPhase] = useState<'intro' | 'exiting' | 'done'>('intro');

  const AUTO_REDIRECT_MS = 5000;

  const FEATURES = useMemo(
    () => [
      'AI Fashion Studio',
      'Luxury Collections',
      'Personalized Recommendations',
      'Digital Fashion Experience',
    ],
    []
  );

  const CITY_VIDEO_FALLBACK_IMAGE = useMemo(() => {
    // If you add/replace assets later, keep these defaults.
    // Using existing project assets would be ideal but not required.
    return '/images/background/hero-background.webp';
  }, []);

  const onToggleSound = async () => {
    setHasInteracted(true);
    setSoundOn((v) => !v);
  };

  // Lazy load sound
  useEffect(() => {
    if (!hasInteracted) return;
    if (!soundOn) return;

    // Create on-demand
    if (!audioRef.current) {
      // Provide a local audio asset if available; otherwise it will fail gracefully.
      // Replace /sounds/rare-rab-it.wav with a real file if you add one.
      audioRef.current = new Audio('/sounds/rare-rab-it.mp3');
      audioRef.current.preload = 'none';

      audioRef.current.addEventListener('canplaythrough', () => setSoundLoaded(true));
      audioRef.current.addEventListener('error', () => setSoundLoaded(false));

      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }

    // Attempt play (must be after interaction)
    const tryPlay = async () => {
      try {
        await audioRef.current?.play();
      } catch {
        // Ignore autoplay policy errors.
      }
    };

    tryPlay();
  }, [hasInteracted, soundOn]);

  // Stop sound when toggled off
  useEffect(() => {
    if (!audioRef.current) return;
    if (soundOn) return;
    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } catch {
      // ignore
    }
  }, [soundOn]);

  // Logo animation + burst
  useEffect(() => {
    if (prefersReducedMotion) {
      gsap.set(logoWrapRef.current, { opacity: 1, y: 0 });
      gsap.set(logoTextRef.current, { opacity: 1, filter: 'none' });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.set(logoWrapRef.current, { opacity: 0, y: 24, filter: 'blur(8px)' });
      tl.fromTo(
        logoWrapRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, y: 0, filter: 'blur(0px)' }
      );

      // Golden neon glow pulse
      tl.fromTo(
        logoTextRef.current,
        { opacity: 0, color: 'rgba(255, 215, 90, 0.2)', textShadow: 'none' },
        {
          opacity: 1,
          color: 'rgba(255, 215, 90, 1)',
          duration: 0.7,
          textShadow: '0 0 24px rgba(255, 196, 74, 0.65), 0 0 60px rgba(255, 196, 74, 0.35)',
        }
      );

      // Luxury reveal sequence
      tl.to(logoWrapRef.current, { scale: 1.02, duration: 0.35 });
      tl.to(logoWrapRef.current, { scale: 1, duration: 0.25 });

      // Particle burst
      const el = rootRef.current;
      if (el) {
        const burst = document.createElement('div');
        burst.className = 'welcome-burst';
        el.appendChild(burst);

        const particles = Array.from({ length: 18 }).map(() => {
          const p = document.createElement('span');
          p.className = 'welcome-burst-dot';
          burst.appendChild(p);
          return p;
        });

        particles.forEach((p, i) => {
          const ang = (Math.PI * 2 * i) / particles.length;
          const dist = 60 + Math.random() * 40;
          const x = Math.cos(ang) * dist;
          const y = Math.sin(ang) * dist;
          const delay = 0.06 + Math.random() * 0.08;

          gsap.set(p, { opacity: 0 });
          gsap.to(p, {
            opacity: 1,
            x,
            y,
            duration: 0.65,
            delay,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(p, {
                opacity: 0,
                duration: 0.2,
              });
            },
          });
        });

        tl.add(() => {
          gsap.set(burst, { opacity: 1 });
        }, '+=0.05');

        tl.to(burst, {
          opacity: 0,
          duration: 0.5,
          delay: 0.2,
          onComplete: () => {
            burst.remove();
          },
        });
      }
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Auto redirect with cinematic exit
  const doExitAndGoHome = async () => {
    if (phase !== 'intro') return;
    setPhase('exiting');

    const el = rootRef.current;
    if (!el) {
      window.location.href = '/';
      return;
    }

    if (prefersReducedMotion) {
      window.location.href = '/';
      return;
    }

    // Cinematic shutter effect
    const shutter = document.createElement('div');
    shutter.className = 'welcome-shutter';
    el.appendChild(shutter);

    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
    tl.set(shutter, { opacity: 1, scaleY: 0.12, transformOrigin: 'center center' });
    tl.to(shutter, { scaleY: 1, duration: 0.7 });
    tl.to(
      el,
      {
        opacity: 0,
        duration: 0.35,
      },
      '-=0.25'
    );

    tl.add(() => {
      window.location.href = '/';
    });
  };

  useEffect(() => {
    if (phase !== 'intro') return;
    const t = window.setTimeout(() => {
      doExitAndGoHome();
    }, AUTO_REDIRECT_MS);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const onSkip = () => doExitAndGoHome();

  const onEnterVault = () => doExitAndGoHome();
  const onExploreCollections = () => (window.location.href = '/templates');

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden">
      {/* Animated background layers */}
      <CityLights />
      <AuroraOverlays />

      {/* Glass overlays & gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,217,255,0.14),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(179,102,255,0.12),transparent_55%),linear-gradient(to_bottom,rgba(0,0,0,0.15),rgba(0,0,0,0.65))]" />
      <div className="pointer-events-none absolute inset-0 backdrop-blur-[2px]" style={{ opacity: 0.35 }} />

      {/* Main hero */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 pt-24 md:pt-32 pb-16">
        <div className="flex items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <div ref={logoWrapRef} className="welcome-logo-wrap">
              <div className="welcome-logo-glow" />
              <div ref={logoTextRef} className="welcome-logo-text">
                <Logo className="-ml-1" showText={true} />
              </div>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSound}
              className="relative rounded-xl border border-white/10 bg-black/35 backdrop-blur-xl px-4 py-2 text-xs font-semibold tracking-widest uppercase text-white/90 hover:bg-white/10 transition"
              aria-label={soundOn ? 'Sound on' : 'Sound off'}
            >
              <span className="inline-flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${soundOn ? 'bg-cyan-300 shadow-[0_0_20px_rgba(0,217,255,0.7)]' : 'bg-white/30'}`}
                />
                Sound
              </span>
            </button>

            <button
              onClick={onSkip}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-widest uppercase text-white/90 hover:bg-white/10 transition"
            >
              Skip Intro
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-300 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(0,255,255,0.6)]" />
                Luxury Fashion • Cyberpunk Premium
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight text-white">
                WELCOME TO THE FUTURE OF FASHION
              </h1>

              <p className="mt-5 text-zinc-300 max-w-xl text-base sm:text-lg">
                Where Luxury Meets Technology
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <button
                  onClick={onEnterVault}
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-purple-400 px-6 py-3 text-sm font-bold text-black shadow-[0_0_30px_rgba(0,217,255,0.12)] hover:brightness-105 transition"
                >
                  Enter The Vault
                </button>
                <button
                  onClick={onExploreCollections}
                  className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Explore Collections
                </button>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FEATURES.map((f) => (
                  <div key={f} className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-xl p-4">
                    <div className="text-white font-semibold text-sm">{f}</div>
                    <div className="mt-2 h-[1px] w-full bg-gradient-to-r from-cyan-300/30 via-purple-300/20 to-transparent" />
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-3 text-xs text-zinc-400">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-1 w-1 rounded-full bg-cyan-300/80" />
                  Auto-redirecting in <span className="text-zinc-200">5s</span>
                </span>
                <span className="hidden sm:inline-block">•</span>
                <span className="hidden sm:inline-flex items-center gap-2">
                  <span className="inline-block h-1 w-1 rounded-full bg-purple-300/70" />
                  GPU-first transforms
                </span>
              </div>
            </motion.div>
          </div>

          <div className="relative">
            {/* Lazy video */}
            <div className="relative rounded-[1.6rem] border border-white/10 bg-black/20 backdrop-blur-xl overflow-hidden shadow-[0_0_120px_rgba(0,217,255,0.08)]">
              <LuxuryVideo
                poster={CITY_VIDEO_FALLBACK_IMAGE}
                className="h-[420px] w-full"
                reduced={prefersReducedMotion}
              />


              {/* Glass caption overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/70 via-black/25 to-transparent">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-white text-sm font-semibold">RARE RAB IT — Luxury Look</div>
                  <div className="text-zinc-400 text-xs">Cinematic intro stream</div>
                </div>
              </div>

              {/* Glassmorphism overlay */}
              <div className="pointer-events-none absolute inset-0 border border-white/5 rounded-[1.6rem]" />
            </div>

            {/* Parallax hint */}
            <div className="pointer-events-none absolute -top-6 -right-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-purple-400/10 blur-2xl" />
          </div>
        </div>

        {/* Animated template rails */}
        <div className="mt-16">
          <LuxuryTemplatesRail />
        </div>

        {/* Footer hint (no duplication) */}
      </div>

      {/* Exit animations overlay */}
      <AnimatePresence>
        {phase === 'exiting' ? (
          <motion.div
            key="exit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="welcome-exit-overlay"
          />
        ) : null}
      </AnimatePresence>

      <style jsx global>{`
        .welcome-logo-wrap {
          position: relative;
          transform: translateZ(0);
        }
        .welcome-logo-glow {
          position: absolute;
          inset: -10px -18px;
          background: radial-gradient(circle at 50% 50%, rgba(255, 196, 74, 0.35), rgba(255, 196, 74, 0) 60%);
          filter: blur(10px);
          opacity: 0.9;
          pointer-events: none;
          z-index: -1;
        }
        .welcome-logo-text {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }
        .welcome-burst {
          position: absolute;
          left: 50%;
          top: 165px;
          transform: translate(-50%, -50%);
          width: 1px;
          height: 1px;
          pointer-events: none;
          z-index: 60;
        }
        .welcome-burst-dot {
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background: rgba(255, 215, 90, 0.95);
          box-shadow: 0 0 14px rgba(255, 215, 90, 0.6), 0 0 35px rgba(255, 215, 90, 0.25);
        }
        .welcome-shutter {
          position: absolute;
          inset: -10% -10%;
          background: radial-gradient(circle at 50% 30%, rgba(255, 196, 74, 0.18), rgba(0,0,0,0) 55%),
            linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9));
          transform: scaleY(0.12);
          transform-origin: center center;
          pointer-events: none;
          z-index: 80;
          opacity: 0;
        }
        .welcome-exit-overlay {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at 50% 30%, rgba(255, 196, 74, 0.16), rgba(0,0,0,0) 55%),
            linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.9));
          z-index: 100;
          pointer-events: none;
          backdrop-filter: blur(2px);
        }
      `}</style>
    </div>
  );
}

