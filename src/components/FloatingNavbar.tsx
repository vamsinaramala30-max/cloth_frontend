'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAuthStore } from '@/hooks/useAuth';
import { NAVIGATION } from '@/lib/constants';
import Logo from './Logo';
import { ShoppingBag, User, X, Menu, Heart, Search } from 'lucide-react';
import { useCartStore } from '@/lib/stores/useCartStore';
import { useWishlistStore } from '@/lib/stores/useWishlistStore';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { COLLECTIONS } from '@/lib/data/collections';

export const FloatingNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const pathname = usePathname();

  const { itemCount: cartItemCount, toggleDrawer } = useCartStore();
  const { itemCount: wishlistItemCount } = useWishlistStore();

  const cartCount = cartItemCount();
  const wishlistCount = wishlistItemCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* ── Floating Bar ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-[100]"
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isScrolled ? 0 : -100,
          opacity: isScrolled ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
        }}
        style={{
          pointerEvents: isScrolled ? 'auto' : 'none',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
          <motion.div
            className="flex h-14 items-center justify-between rounded-2xl px-6 transition-all duration-500"
            animate={
              isScrolled
                ? {
                  backgroundColor: 'rgba(0,0,0,0.75)',
                  backdropFilter: 'blur(24px)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                }
                : {
                  backgroundColor: 'rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(8px)',
                  borderColor: 'rgba(255,255,255,0.05)',
                  boxShadow: 'none',
                }
            }
            style={{ border: '1px solid' }}
          >
            {/* Logo */}
            <Link href="/" aria-label="Plasma Atelier — Go to homepage" onClick={closeMenu}>
              <Logo showText />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
              {NAVIGATION.map((item) => (
                <Link key={item.href} href={item.href} aria-label={`Navigate to ${item.label}`}>
                  <motion.span
                    className={`relative text-[11px] font-medium uppercase tracking-widest transition-colors ${isActive(item.href)
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-white'
                      }`}
                    whileHover={{ y: -1 }}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <motion.span
                        className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-cyan-400 to-purple-400"
                        layoutId="nav-underline"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.span>
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen((v) => !v)}
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="Toggle search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative" aria-label={`Wishlist (${wishlistCount} items)`}>
                <Heart className="h-5 w-5 text-zinc-400 hover:text-white transition-colors" />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-400 text-[9px] font-black text-white"
                  >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={toggleDrawer}
                className="relative"
                aria-label={`Shopping bag (${cartCount} items)`}
              >
                <ShoppingBag className="h-5 w-5 text-zinc-400 hover:text-white transition-colors" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[9px] font-black text-black"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </button>

              {/* Account */}
              <Link
                href={user ? '/account' : '/login'}
                aria-label={user ? 'Go to account' : 'Sign in'}
                className="flex items-center"
              >
                {user ? (
                  <User className="h-5 w-5 text-zinc-400 hover:text-white transition-colors" />
                ) : (
                  <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                    Sign In
                  </span>
                )}
              </Link>

              {/* Hamburger (mobile) */}
              <button
                onClick={toggleMenu}
                className="lg:hidden text-zinc-400 hover:text-white transition-colors"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </motion.div>

          {/* Search Bar Inline */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mt-2 mx-1"
              >
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/70 backdrop-blur-2xl px-4 py-3">
                  <Search className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                  <input
                    autoFocus
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, collections, vault…"
                    className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
                    aria-label="Search"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-zinc-500 hover:text-white"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest"
                    aria-label="Close search"
                  >
                    Esc
                  </button>
                </div>

                {/* Instant Search Results Dropdown */}
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-1 right-1 mt-2 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50 max-h-[70vh] overflow-y-auto"
                  >
                    {/* Filter logic */}
                    {(() => {
                      const query = searchQuery.toLowerCase();
                      const matchingProducts = MOCK_PRODUCTS.filter(
                        (p) =>
                          p.name.toLowerCase().includes(query) ||
                          p.category.toLowerCase().includes(query) ||
                          (p.tags && p.tags.some((t) => t.toLowerCase().includes(query)))
                      ).slice(0, 5);

                      const matchingCollections = COLLECTIONS.filter(
                        (c) =>
                          c.title.toLowerCase().includes(query) ||
                          c.description.toLowerCase().includes(query)
                      ).slice(0, 3);

                      if (matchingProducts.length === 0 && matchingCollections.length === 0) {
                        return (
                          <div className="py-8 text-center text-zinc-500 text-xs uppercase tracking-widest">
                            No pieces or collections found
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Products Column */}
                          {matchingProducts.length > 0 && (
                            <div>
                              <h4 className="text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-black mb-3 pb-1.5 border-b border-white/5">
                                Matching Pieces ({matchingProducts.length})
                              </h4>
                              <div className="space-y-2">
                                {matchingProducts.map((p) => (
                                  <Link
                                    key={p.id}
                                    href={p.isVault ? `/vault/${p.slug}` : `/products/${p.slug}`}
                                    onClick={() => {
                                      setIsSearchOpen(false);
                                      setSearchQuery('');
                                    }}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group"
                                  >
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                      <Image
                                        src={p.images[0]}
                                        alt={p.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                                        {p.name}
                                      </p>
                                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">
                                        {p.category} {p.isVault && '• Vault'}
                                      </p>
                                    </div>
                                    <span className="text-xs font-bold text-white">${p.price.toLocaleString()}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Collections Column */}
                          {matchingCollections.length > 0 && (
                            <div>
                              <h4 className="text-[10px] text-purple-400 uppercase tracking-[0.2em] font-black mb-3 pb-1.5 border-b border-white/5">
                                Collections ({matchingCollections.length})
                              </h4>
                              <div className="space-y-2">
                                {matchingCollections.map((c) => (
                                  <Link
                                    key={c.id}
                                    href={`/collections/${c.slug}`}
                                    onClick={() => {
                                      setIsSearchOpen(false);
                                      setSearchQuery('');
                                    }}
                                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all group border border-white/[0.03]"
                                  >
                                    <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0">
                                      <Image
                                        src={c.image}
                                        alt={c.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
                                        {c.title}
                                      </p>
                                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">
                                        {c.itemCount} pieces
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[90] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-lg"
              onClick={closeMenu}
            />

            {/* Slide Panel */}
            <motion.nav
              className="absolute top-0 right-0 bottom-0 w-72 border-l border-white/10 bg-black/95 backdrop-blur-2xl flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              aria-label="Mobile navigation"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-8 pb-6 border-b border-white/10">
                <Logo showText={false} />
                <button
                  onClick={closeMenu}
                  className="text-zinc-400 hover:text-white transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 px-6 py-8 overflow-y-auto">
                <div className="flex flex-col gap-1">
                  {NAVIGATION.map((item, idx) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + idx * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={`flex items-center py-3.5 px-4 rounded-xl text-sm font-medium uppercase tracking-widest transition-all ${isActive(item.href)
                          ? 'bg-white/10 text-white'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-1">
                  <Link
                    href="/wishlist"
                    onClick={closeMenu}
                    className="flex items-center justify-between py-3.5 px-4 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </span>
                    {wishlistCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-400 text-[9px] font-black text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => { closeMenu(); toggleDrawer(); }}
                    className="flex items-center justify-between w-full py-3.5 px-4 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingBag className="h-4 w-4" />
                      Cart
                    </span>
                    {cartCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-[9px] font-black text-black">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <Link
                    href={user ? '/account' : '/login'}
                    onClick={closeMenu}
                    className="flex items-center gap-3 py-3.5 px-4 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <User className="h-4 w-4" />
                    {user ? 'Account' : 'Sign In'}
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-6 border-t border-white/10 text-center">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                  Plasma Atelier — Digital Couture
                </p>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};