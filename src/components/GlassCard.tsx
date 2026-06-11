import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'cyan' | 'purple' | 'pink' | 'gold';
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hover = true,
  glow = 'cyan',
  delay = 0,
}) => {
  const glowColors = {
    cyan: 'hover:shadow-lg hover:shadow-cyan-500/50',
    purple: 'hover:shadow-lg hover:shadow-purple-500/50',
    pink: 'hover:shadow-lg hover:shadow-pink-500/50',
    gold: 'hover:shadow-lg hover:shadow-amber-500/50',
  };

  return (
    <motion.div
      className={cn(
        'glass-bg rounded-xl p-6 transition-all duration-300',
        hover && glowColors[glow],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={hover ? { y: -5 } : undefined}
    >
      {children}
    </motion.div>
  );
};
