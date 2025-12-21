'use client';

import ProfileView from '@/components/profile/ProfileView';
import { useParams } from 'next/navigation';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  return <ProfileView userId={userId} />;
}
