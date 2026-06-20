'use client';

import React, { useMemo, useState } from 'react';
import Image, { type ImageProps } from 'next/image';

export type SafeImageProps = Omit<ImageProps, 'src' | 'onError' | 'placeholder'> & {
  src?: string | null;
  fallbackSrc?: string;
  fallbackAlt?: string;
  placeholder?: 'blur' | 'empty';
};

const DEFAULT_FALLBACK_SRC = '/images/vk/placeholder.png';

const DEFAULT_FALLBACK_ALT = 'Image unavailable';

function isProbablyValidHttpUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function isLocalPath(url: unknown): url is string {
  return typeof url === 'string' && url.startsWith('/');
}

function getDeterministicFallbackSrc(_src: string, fallbackSrc?: string) {
  if (fallbackSrc) return fallbackSrc;
  return DEFAULT_FALLBACK_SRC;
}


const BLUR_DATA_URL =
  'data:image/webp;base64,UklGRiIAAABXRUJQVlA4TAYAAAAvAAAAAQAcJaQAAQUxQSsAA';

export default function SafeImage(props: SafeImageProps) {
  const {
    src,
    fallbackSrc,
    fallbackAlt = DEFAULT_FALLBACK_ALT,
    alt,
    placeholder = 'blur',
    sizes,
    priority,
    ...rest
  } = props;

  const safeInitialSrc = useMemo(() => {
    if (src === null || src === undefined) return '';
    const s = String(src);
    return s.trim().length > 0 ? s : '';
  }, [src]);

  const [errored, setErrored] = useState(false);

  const effectiveSrc = useMemo(() => {
    if (!safeInitialSrc) {
      return getDeterministicFallbackSrc(String(src ?? ''), fallbackSrc);
    }

    // Local paths are valid for Next.js public assets.
    if (isLocalPath(safeInitialSrc)) {
      return safeInitialSrc;
    }

    // If it is not a valid http(s) URL, never pass it to next/image remote loader.
    if (!isProbablyValidHttpUrl(safeInitialSrc)) {
      return getDeterministicFallbackSrc(safeInitialSrc, fallbackSrc);
    }

    return errored ? getDeterministicFallbackSrc(safeInitialSrc, fallbackSrc) : safeInitialSrc;
  }, [errored, fallbackSrc, safeInitialSrc, src]);

  const effectiveAlt = (alt && alt.trim().length > 0 ? alt : fallbackAlt) || 'Image unavailable';

  // Blur placeholder: show the placeholder but still render the Image tag.
  // Using a deterministic blur data keeps hydration stable.
  return (
    <Image
      {...rest}
      src={effectiveSrc}
      alt={effectiveAlt}
      sizes={sizes}
      priority={priority}
      placeholder={placeholder === 'blur' ? 'blur' : 'empty'}
      blurDataURL={placeholder === 'blur' ? BLUR_DATA_URL : undefined}
      onError={() => {
        // prevent console errors from repeatedly firing
        setErrored(true);
      }}
    />
  );
}

