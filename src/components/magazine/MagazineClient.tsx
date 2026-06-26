'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

type Article = {
  id: string;
  title: string;
  category: 'Style' | 'Editorial' | 'Collections' | 'Guides';
  excerpt: string;
  minutes: number;
};

const ARTICLES: Article[] = [
  {
    id: 'a1',
    title: 'The Quiet Power of Monochrome',
    category: 'Editorial',
    excerpt: 'A premium guide to building presence through tone, texture, and proportion.',
    minutes: 6,
  },
  {
    id: 'a2',
    title: 'Layering for Breathable Luxury',
    category: 'Guides',
    excerpt: 'Learn the structure behind comfortable warmth—without sacrificing elegance.',
    minutes: 5,
  },
  {
    id: 'a3',
    title: 'Couture Cuts: How to Read a Seam',
    category: 'Style',
    excerpt: 'From drape to finishing, discover what makes a garment look expensive—and last.',
    minutes: 7,
  },
  {
    id: 'a4',
    title: 'Season Capsule: Featured Collections',
    category: 'Collections',
    excerpt: 'A curated set of pieces designed to move across occasions with intention.',
    minutes: 4,
  },
  {
    id: 'a5',
    title: 'Editorial Styling: The 3-Texture Rule',
    category: 'Style',
    excerpt: 'Balance sheen, softness, and structure so every look reads premium in motion.',
    minutes: 6,
  },
  {
    id: 'a6',
    title: 'The Future of Responsible Craft',
    category: 'Editorial',
    excerpt: 'How process improvements translate to longevity, comfort, and better outcomes.',
    minutes: 8,
  },
];

const CATEGORIES: Array<Article['category'] | 'All'> = ['All', 'Editorial', 'Style', 'Guides', 'Collections'];

function filterArticles(query: string, category: typeof CATEGORIES[number]) {
  const q = query.trim().toLowerCase();
  return ARTICLES.filter((a) => {
    const matchesCategory = category === 'All' ? true : a.category === category;
    const matchesQuery =
      q.length === 0 ? true : (a.title + ' ' + a.excerpt + ' ' + a.category).toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
}

export function MagazineClient() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');

  useEffect(() => {
    if (user) {
      router.push('/products');
    }
  }, [user, router]);

  const filtered = useMemo(() => filterArticles(query, category), [query, category]);

  if (user) return null;

  return (
    <div className="space-y-10">
      <motion.div
        className="rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs md:text-sm text-cyan-300 tracking-[0.28em] uppercase">Search the edit</p>
        <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">Find your next read</h2>
        <p className="mt-4 text-zinc-300/90 leading-relaxed max-w-2xl">
          Search articles, filter by category, and build a personal style direction.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: tailoring, craft, style…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-cyan-400/40"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={
                    'px-4 py-2 rounded-full text-xs md:text-sm border transition-all ' +
                    (active
                      ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 text-zinc-200/90')
                  }
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((a, idx) => (
          <motion.article
            key={a.id}
            className="rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.02 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs md:text-sm text-cyan-300 tracking-[0.22em] uppercase">{a.category}</span>
              <span className="text-xs text-zinc-400">{a.minutes} min</span>
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight">{a.title}</h3>
            <p className="mt-3 text-zinc-300/90 leading-relaxed">{a.excerpt}</p>

            <div className="mt-6">
              <button
                type="button"
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-lg"
                onClick={() => {
                  // No navigation yet; this is an in-page editorial card.
                  // Keep behavior deterministic.
                }}
              >
                Read excerpt
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-zinc-400">
          No articles match your search. Try a different keyword or category.
        </div>
      )}
    </div>
  );
}

