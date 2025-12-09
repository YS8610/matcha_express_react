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
        console.warn(`[useAuthImage] No token available for ${photoName}, attempt ${attemptCount}/${maxAttempts}`);
        if (attemptCount < maxAttempts && isMounted) {
          const delay = Math.min(100 * attemptCount, 1000);
          setTimeout(attemptFetch, delay);
        } else if (isMounted) {
          console.error(`[useAuthImage] Failed to load ${photoName} - no token after ${maxAttempts} attempts`);
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
            console.error(`[useAuthImage] Failed to load ${photoName}: ${response.status} ${response.statusText}`);
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
