'use client';

import { useState, useEffect } from 'react';
import { getToken, clearToken } from '@/lib/tokenStorage';

export function useAuthImage(photoName: string | undefined | null): string | null {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!photoName) {
      setImageUrl(null);
      return;
    }

    let isMounted = true;
    let attemptCount = 0;
    const maxAttempts = 10;

    const attemptFetch = () => {
      attemptCount++;
      const token = getToken();

      if (!token) {
        if (attemptCount < maxAttempts && isMounted) {
          const delay = Math.min(100 * attemptCount, 1000);
          setTimeout(attemptFetch, delay);
        } else if (isMounted) {
          setImageUrl(null);
        }
        return;
      }

      fetch(`/api/photo/${photoName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => {
          if (!isMounted) return;

          if (!response.ok) {
            if (response.status === 401) {
              clearToken();
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('unauthorized'));
              }
            }
            setImageUrl(null);
            return;
          }

          return response.blob().then(blob => {
            if (!isMounted) return;
            const blobUrl = URL.createObjectURL(blob);
            setImageUrl(blobUrl);
          });
        })
        .catch(error => {
          if (!isMounted) return;
          setImageUrl(null);
        });
    };

    attemptFetch();

    return () => {
      isMounted = false;
    };
  }, [photoName]);

  return imageUrl;
}
