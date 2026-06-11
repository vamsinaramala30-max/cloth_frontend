'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SafeImage from './SafeImage';


interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isFeatured?: boolean;
  delay?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  category,
  isFeatured = false,
  delay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link href={`/product/${id}`}>
        <div
          className="relative overflow-hidden rounded-xl aspect-square cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
        >
          {/* Background Image */}
          <motion.div
            className="relative w-full h-full"
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <SafeImage
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          </motion.div>

          {/* Gradient Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
            animate={isHovered ? { opacity: 0.8 } : { opacity: 0.4 }}
            transition={{ duration: 0.3 }}
          />

          {/* Glow Effect on Hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 217, 255, 0.3) 0%, transparent 70%)`,
              }}
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Category Badge */}
          <motion.div
            className="absolute top-4 left-4 z-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-3 py-1 bg-cyan-500/80 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-widest uppercase text-white">
              {category}
            </div>
          </motion.div>

          {/* Featured Badge */}
          {isFeatured && (
            <motion.div
              className="absolute top-4 right-4 z-10"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-widest uppercase text-white">
                ✦ Featured
              </div>
            </motion.div>
          )}

          {/* Content Area */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Floating Text on Hover */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-4">View Item</p>
              <div className="flex gap-2 justify-center">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-cyan-400 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Info */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-white font-medium text-sm tracking-wide truncate mb-2">{name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-cyan-300 font-bold text-sm">${price.toLocaleString()}</span>
              <motion.div
                className="w-6 h-6 rounded-full border border-white flex items-center justify-center"
                whileHover={{ scale: 1.2, borderColor: '#00d9ff' }}
              >
                <span className="text-white text-xs">+</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};
