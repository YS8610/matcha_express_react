'use client';

import BrowseProfiles from '@/components/browse/BrowseProfiles';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BrowsePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!user.profileComplete) {
        router.push('/profile/setup');
      }
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  if (!user.profileComplete) return null;

  return <BrowseProfiles />;
}