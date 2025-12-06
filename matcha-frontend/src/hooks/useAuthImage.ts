'use client';

import { useState, useEffect } from 'react';
import { getToken } from '@/lib/tokenStorage';
import { useToast } from '@/contexts/ToastContext';

export function useAuthImage(photoName: string | undefined | null): string | null {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { addToast } = useToast();

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
  }, [photoName, addToast]);

  return imageUrl;
}
