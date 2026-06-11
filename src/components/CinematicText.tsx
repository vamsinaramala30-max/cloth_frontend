import React from 'react';
import { motion } from 'framer-motion';

interface CinematicTextProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: boolean;
}

export const CinematicText: React.FC<CinematicTextProps> = ({
  children,
  className = '',
  delay = 0,
  stagger = false,
}) => {
  const letters = children.split('');

  if (!stagger) {
    return (
      <motion.span
        className={className}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className={className}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.05,
          }}
          className="inline-block"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
};
