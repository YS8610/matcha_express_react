'use client';

import { useState, useEffect } from 'react';
import { getToken } from '@/lib/tokenStorage';

interface PhotoDisplayProps {
  photoName: string;
  alt: string;
  className?: string;
}

export default function PhotoDisplay({ photoName, alt, className = '' }: PhotoDisplayProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const token = getToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/photo/${photoName}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    if (photoName) {
      loadPhoto();
    }
  }, [photoName]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-600 flex items-center justify-center`}>
        <span className="text-gray-500 text-sm">Loading...</span>
      </div>
    );
  }

  if (!imageSrc) {
    return (
      <div className={`${className} bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}>
        <span className="text-gray-400 text-sm">Failed to load</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}
