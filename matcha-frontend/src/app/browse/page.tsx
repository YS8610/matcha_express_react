'use client';

import BrowseProfiles from '@/components/browse/BrowseProfiles';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BrowsePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!user.profileComplete) {
      router.replace('/profile/setup');
      return;
    }
  }, [user, loading, router]);

  if (loading || !user || !user.profileComplete) {
    return <></>;
  }

  return <BrowseProfiles />;
}
