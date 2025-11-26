'use client';

import Image from 'next/image';
import { getPhotoUrl } from '@/lib/api';

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
  const imageUrl = src && src.includes('/api/photo/')
    ? getPhotoUrl(src.split('/api/photo/')[1])
    : src;
  const error = !imageUrl;

  const finalSrc = error && fallbackSrc ? fallbackSrc : imageUrl;

  if (fill) {
    return (
      <Image
        src={finalSrc}
        alt={alt}
        fill
        className={className}
        unoptimized={unoptimized}
      />
    );
  }

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={unoptimized}
    />
  );
}
