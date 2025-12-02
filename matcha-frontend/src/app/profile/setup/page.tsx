'use client';

import ProfileSetup from '@/components/profile/ProfileSetup';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileSetupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
    } else if (user.profileComplete) {
      router.replace('/profile');
    }
  }, [user, loading, router]);

  if (loading || !user || user.profileComplete) {
    return null;
  }

  return <ProfileSetup />;
}
