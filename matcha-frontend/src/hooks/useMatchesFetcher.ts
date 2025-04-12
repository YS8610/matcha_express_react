import { useState, useEffect } from 'react';
import { type Profile } from '@/types/profile';
import { FEATURED_PROFILES } from '@/constants/profiles';

export function useMatchesFetcher() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real app, this would be an API call
        setProfiles(FEATURED_PROFILES);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return { profiles, loading, error };
}
