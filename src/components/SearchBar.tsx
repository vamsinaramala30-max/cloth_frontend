'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value = '', onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  const suggestions = ['Neural Silk', 'Quantum Weave', 'Ethereal Form', 'Digital Thread'];
  const trending = ['AI Runway', 'Glass Couture', 'Luxury Capsule', 'Neon Tailoring'];

  const handleSelection = (query: string) => {
    setSearchQuery(query);
    onChange?.(query);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <motion.div
        className={`relative flex items-center gap-4 px-6 py-3 rounded-full border-2 transition-all duration-300 backdrop-blur-sm ${
          isFocused
            ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/50'
            : 'border-white/20 bg-white/5 hover:border-white/30'
        }`}
        animate={{
          boxShadow: isFocused
            ? '0 0 30px rgba(0, 217, 255, 0.3)'
            : '0 0 0px rgba(0, 217, 255, 0)',
        }}
      >
        <motion.span
          className="text-white text-lg"
          animate={{ scale: isFocused ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        >
          ⌕
        </motion.span>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search collections, items, designers..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onChange?.(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm"
        />

        {searchQuery && (
          <motion.button
            className="text-zinc-400 hover:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => handleSelection('')}
          >
            ✕
          </motion.button>
        )}
      </motion.div>

      <div className="mt-4 flex flex-wrap gap-3">
        {trending.map((item) => (
          <button
            key={item}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-white/80 hover:bg-cyan-400/10 hover:border-cyan-400/30"
            onClick={() => handleSelection(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {isFocused && (
        <motion.div
          className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-4 space-y-2">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelection(suggestion)}
              >
                <span className="text-cyan-400">⌕</span> {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};