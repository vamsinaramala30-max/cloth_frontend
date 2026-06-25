'use client';

import React, { useMemo, useState } from 'react';

type Template = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
};

const CATEGORIES = ['All', 'Editorial', 'Minimal', 'Luxury', 'Cinematic'];

const TEMPLATES: Template[] = [
  {
    id: 'nebula-noir',
    title: 'Nebula Noir',
    category: 'Cinematic',
    description: 'Dark editorial layout with dramatic typography.',
    tags: ['dark', 'editorial', 'fast'],
  },
  {
    id: 'aurum-halo',
    title: 'Aurum Halo',
    category: 'Luxury',
    description: 'Warm luxury gradients and premium spacing.',
    tags: ['luxury', 'glass', 'gradients'],
  },
  {
    id: 'vanta-silk',
    title: 'Vanta Silk',
    category: 'Minimal',
    description: 'Minimal and responsive, optimized for speed.',
    tags: ['minimal', 'responsive'],
  },
  {
    id: 'cosmic-atelier',
    title: 'Cosmic Atelier',
    category: 'Editorial',
    description: 'Bold hero blocks and cinematic feature grids.',
    tags: ['editorial', 'bold'],
  },
];


export function TemplatesGallery() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter((t) => {
      const matchesCategory = category === 'All' ? true : t.category === category;
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const activeTemplate = useMemo(() => {
    return TEMPLATES.find((t) => t.id === activeTemplateId) ?? null;
  }, [activeTemplateId]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-zinc-400">Template Gallery</div>
          <h1 className="mt-3 text-3xl sm:text-4xl text-white font-light">Search & preview templates</h1>
          <p className="mt-4 text-zinc-400 max-w-2xl">
            Choose a template and view a live preview. Cards are responsive and optimized for smooth browsing.
          </p>
        </div>

        <div className="w-full lg:w-[420px]">
          <div className="flex gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1 text-xs uppercase tracking-widest border transition ${
                  category === c
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-black border-transparent'
                    : 'bg-white/5 border-white/15 text-zinc-300 hover:bg-white/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="group rounded-3xl border border-white/10 bg-black/25 backdrop-blur-xl p-5 hover:border-cyan-400/20 transition shadow-[0_0_80px_rgba(0,255,255,0.02)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-white text-lg font-semibold">{t.title}</div>
                <div className="text-zinc-400 text-xs mt-1 uppercase tracking-[0.2em]">{t.category}</div>
              </div>
              <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[0.65rem] text-zinc-300">
                Live
              </span>
            </div>

            <p className="mt-3 text-zinc-400 text-sm line-clamp-2">{t.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {t.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-zinc-300/90">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTemplateId(t.id)}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Preview
              </button>
              <button
                onClick={() => {
                  setActiveTemplateId(t.id);
                }}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-purple-400 px-3 py-2 text-sm font-bold text-black hover:brightness-105 transition"
              >
                Select
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-3xl border border-white/10 bg-black/20 p-8 text-zinc-400 text-center">
            No templates match your search.
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {activeTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveTemplateId(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-black/90 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-white text-xl font-semibold">{activeTemplate.title}</div>
                <div className="text-zinc-400 text-xs uppercase tracking-[0.2em] mt-1">{activeTemplate.category}</div>
                <div className="text-zinc-400 text-sm mt-2">{activeTemplate.description}</div>
              </div>
              <button
                onClick={() => setActiveTemplateId(null)}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white hover:bg-white/10 transition"
              >
                Close
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-cyan-200 text-sm font-bold uppercase tracking-widest">Hero</div>
                  <div className="mt-2 text-white text-2xl font-light">Plasma Atelier</div>
                  <div className="mt-2 text-zinc-400 text-sm">Cinematic layout preview</div>
                  <div className="mt-4 h-32 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-cyan-200 text-sm font-bold uppercase tracking-widest">Features</div>
                  <div className="mt-3 space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-10 rounded-xl border border-white/10 bg-white/5" />
                    ))}
                  </div>
                  <div className="mt-4 h-12 rounded-xl border border-white/10 bg-white/5" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <a
                href="/login"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 transition text-center"
              >
                Login to Continue
              </a>
              <button
                onClick={() => {
                  // Placeholder: selection persistence should be added later via API/localStorage.
                  setActiveTemplateId(null);
                }}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-purple-400 px-4 py-3 text-sm font-bold text-black hover:brightness-105 transition"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

