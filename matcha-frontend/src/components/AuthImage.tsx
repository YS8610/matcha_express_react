'use client';

import Image from 'next/image';
import { useAuthImage } from '@/hooks/useAuthImage';

interface AuthImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  unoptimized?: boolean;
  fallbackSrc?: string;
  priority?: boolean;
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
  priority,
}: AuthImageProps) {
  const photoName = src && src.includes('/api/photo/')
    ? src.split('/api/photo/')[1]
    : null;

  const authImageUrl = useAuthImage(photoName);

  const finalSrc = authImageUrl || (photoName ? fallbackSrc : src) || fallbackSrc || '';

  if (!finalSrc) {
    return null;
  }

  if (fill) {
    return (
      <Image
        src={finalSrc}
        alt={alt}
        fill
        className={className}
        unoptimized={unoptimized}
        priority={priority}
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
      priority={priority}
    />
  );
}
