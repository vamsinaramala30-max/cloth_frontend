'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { NAVIGATION } from '@/lib/constants';

import { useAuthStore } from '@/hooks/useAuth';

export const FloatingNavbar: React.FC = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const { user, isLoading } = useAuthStore();


  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -120 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div
          className={`mx-4 md:mx-8 mt-4 px-6 md:px-12 py-5 rounded-[2rem] backdrop-blur-3xl border transition-all duration-500 ${
            scrollY > 80
              ? 'bg-black/50 border-white/10 shadow-2xl'
              : 'bg-white/5 border-white/5 shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center">
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Logo showText />
              </motion.div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              <Link href="/">
                <motion.div
                  className="text-xs font-medium tracking-[0.22em] text-cyan-200 hover:text-white cursor-pointer relative group"
                  whileHover={{ color: '#ffffff' }}
                >
                  HOME
                  <motion.span
                    className="absolute -bottom-2 left-0 h-[1px] bg-gradient-to-r from-cyan-400 to-purple-400"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
              {NAVIGATION.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className="text-xs font-medium tracking-[0.22em] text-zinc-300 hover:text-white cursor-pointer relative group"
                    whileHover={{ color: '#ffffff' }}
                  >
                    {item.label}
                    <motion.span
                      className="absolute -bottom-2 left-0 h-[1px] bg-gradient-to-r from-cyan-400 to-purple-400"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </Link>
              ))}
            </div>



            <div className="flex items-center gap-6">
              <Link href="/cart">
                <motion.div
                  className="relative flex items-center gap-2 text-xs font-medium tracking-widest text-white cursor-pointer group"
                  whileHover={{ scale: 1.05 }}
                >
                  <span>BAG</span>
                  {cartCount > 0 && (
                    <motion.span
                      className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full text-[10px] font-bold text-black"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              {!user ? (
                <Link href="/login">
                  <motion.div
                    className="rounded-full px-4 py-2 text-xs font-medium tracking-widest border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Sign in"
                  >
                    SIGN IN
                  </motion.div>
                </Link>
              ) : (
                <Link href="/account/orders" aria-label="My orders">
                  <motion.div
                    className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="User profile"
                  >
                    {/* Premium user icon (avatar-like) */}
                    <span className="sr-only">User</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="text-cyan-200"
                    >
                      <path
                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20 21C20 17.134 16.4183 14 12 14C7.58172 14 4 17.134 4 21"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    {/* Floating glow */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_18px_rgba(0,217,255,0.35)] opacity-70"
                    />
                  </motion.div>
                </Link>
              )}

              <motion.button
                className="lg:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-1.5"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="w-7 h-0.5 bg-white rounded-full"
                  animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-7 h-0.5 bg-white rounded-full"
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-7 h-0.5 bg-white rounded-full"
                  animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />
              <motion.div
              className="absolute inset-0 flex items-center justify-center px-6 py-10"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="relative w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-black/95 p-8 overflow-hidden shadow-2xl shadow-cyan-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-transparent to-purple-500/15 pointer-events-none" />
                <motion.div
                  className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"
                  animate={{ y: [0, 22, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300">FUTURE NAV</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">Explore</h2>
                    </div>
                    <button className="text-white text-xl" onClick={() => setIsOpen(false)}>
                      ✕
                    </button>
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3 text-white/70">
                      <span className="text-lg">⌕</span>
                      <span className="text-sm">Search collections, drops, designers</span>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <Link href="/">
                      <motion.a
                        className="block rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-lg font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 }}
                        onClick={() => setIsOpen(false)}
                      >
                        HOME
                      </motion.a>
                    </Link>
                    {NAVIGATION.map((item, index) => (
                      <Link key={item.href} href={item.href}>
                        <motion.a
                          className="block rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-lg font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.12 + (index + 1) * 0.07 }}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </motion.a>
                      </Link>
                    ))}
                  </div>


                  <div className="grid grid-cols-2 gap-3">
                    {['Runway', 'Editorial', 'Limited', 'AI Core'].map((tag, index) => (
                      <motion.span
                        key={tag}
                        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-white/80"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
