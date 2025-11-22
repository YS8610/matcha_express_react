'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';

interface AuthImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  unoptimized?: boolean;
  fallbackSrc?: string;
}

export default function AuthImage({
  src,
  alt,
  width,
  height,
  className,
  fill,
  unoptimized,
  fallbackSrc,
}: AuthImageProps) {
  const [imageUrl, setImageUrl] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (src && src.includes('/api/photo/')) {
      const photoName = src.split('/api/photo/')[1];
      if (!photoName) {
        setError(true);
        setIsLoading(false);
        if (fallbackSrc) {
          setImageUrl(fallbackSrc);
        }
        return;
      }
      setIsLoading(true);
      setError(false);
      api
        .getPhotoBlob(photoName)
        .then((blobUrl) => {
          setImageUrl(blobUrl);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load protected image:', err);
          setError(true);
          setIsLoading(false);
          if (fallbackSrc) {
            setImageUrl(fallbackSrc);
          }
        });
    } else {
      setIsLoading(false);
    }
  }, [src, fallbackSrc]);

  if (fill) {
    return (
      <Image
        src={error && fallbackSrc ? fallbackSrc : imageUrl}
        alt={alt}
        fill
        className={className}
        unoptimized={unoptimized}
      />
    );
  }

  return (
    <Image
      src={error && fallbackSrc ? fallbackSrc : imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={unoptimized}
    />
  );
}
