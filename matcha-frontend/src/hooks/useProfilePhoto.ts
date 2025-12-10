import { useMemo } from 'react';
import { generateAvatarUrl } from '@/lib/api';

/**
 * Custom hook to get profile photo URL with automatic fallback to generated avatar
 *
 * @param photo0 - The primary photo identifier (typically from profile.photo0)
 * @param name - Display name for fallback avatar generation
 * @param id - User ID for fallback avatar generation
 * @returns The photo URL (either uploaded photo or generated avatar)
 *
 * @example
 * ```tsx
 * const photoUrl = useProfilePhoto(profile.photo0, profile.firstName + ' ' + profile.lastName, profile.id);
 * ```
 */
export function useProfilePhoto(
  photo0: string | null | undefined,
  name?: string,
  id?: string
): string {
  return useMemo(() => {
    const hasPhoto = photo0 && photo0.length > 0;

    if (hasPhoto) {
      return `/api/photo/${photo0}`;
    }

    return generateAvatarUrl(name, id);
  }, [photo0, name, id]);
}
