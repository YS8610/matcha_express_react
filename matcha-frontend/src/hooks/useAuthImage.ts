'use client';

import { useState, useEffect } from 'react';
import { getToken } from '@/lib/tokenStorage';

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
        console.log(`[useAuthImage] Attempt ${attemptCount}: Token not available yet`);

        if (attemptCount < maxAttempts && isMounted) {
          const delay = Math.min(100 * attemptCount, 1000);
          setTimeout(attemptFetch, delay);
        } else if (isMounted) {
          console.error(`[useAuthImage] Failed to get token after ${maxAttempts} attempts`);
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
            console.error(`[useAuthImage] Failed (${response.status})`);
            setImageUrl(null);
            return;
          }

          return response.blob().then(blob => {
            if (!isMounted) return;
            const blobUrl = URL.createObjectURL(blob);
            setImageUrl(blobUrl);
            console.log(`[useAuthImage] Success: ${photoName}`);
          });
        })
        .catch(error => {
          if (!isMounted) return;
          console.error(`[useAuthImage] Error:`, error);
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
