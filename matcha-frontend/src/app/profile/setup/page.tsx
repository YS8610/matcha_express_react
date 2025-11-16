'use client';

import ProfileSetup from '@/components/profile/ProfileSetup';
import { useAuth } from '@/contexts/AuthContext';
import * as tokenStorage from '@/lib/tokenStorage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileSetupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const token = tokenStorage.getToken();
      if (!token) {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading || (!user && tokenStorage.getToken())) {
    return <div>Loading...</div>;
  }

  if (!user) return null;

  return <ProfileSetup />;
}