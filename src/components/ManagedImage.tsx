'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion } from 'framer-motion';

const BLUR_DATA_URL =
  'data:image/webp;base64,UklGRiIAAABXRUJQVlA4TAYAAAAvAAAAAQAcJaQAAQUxQSsAA';

const DEFAULT_FALLBACK_SRC = '/images/vk/placeholder.png';

export type ManagedImageProps = Omit<ImageProps, 'src' | 'onError'> & {
  src?: string | null;
  fallbackSrc?: string;
  containerClassName?: string;
  imgClassName?: string;
};

function isValidUrl(url: string) {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'http:' ||
      parsed.protocol === 'https:'
    );
  } catch {
    return false;
  }
}

export default function ManagedImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  priority = false,
  fill = false,
  width,
  height,
  sizes,
  className,
  containerClassName,
  imgClassName,
  ...props
}: ManagedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const imageSrc = useMemo(() => {
    if (hasError) return fallbackSrc;

    if (!src) return fallbackSrc;

    const cleaned = src.trim();

    if (cleaned.startsWith('/')) {
      return cleaned;
    }

    if (isValidUrl(cleaned)) {
      return cleaned;
    }

    return fallbackSrc;
  }, [src, hasError, fallbackSrc]);

  const imageProps = fill
    ? {
      fill: true,
      sizes:
        sizes ??
        '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    }
    : {
      width: width ?? 1200,
      height: height ?? 1600,
    };

  return (
    <div
      className={`
        relative overflow-hidden
        ${fill ? 'w-full h-full' : ''}
        ${containerClassName ?? ''}
      `}
    >
      {isLoading && (
        <motion.div
          className="absolute inset-0 z-10 bg-zinc-900"
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      <Image
        {...imageProps}
        {...props}
        src={imageSrc}
        alt={alt || 'Image'}
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`
          transition-opacity duration-500
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          ${fill ? 'object-cover' : ''}
          ${className ?? ''}
          ${imgClassName ?? ''}
        `}
      />
    </div>
  );
}