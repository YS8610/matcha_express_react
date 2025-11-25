'use client';

import ProfileView from '@/components/profile/ProfileView';
import { useParams } from 'next/navigation';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">Invalid profile ID</p>
        </div>
      </div>
    );
  }

  return <ProfileView userId={userId} />;
}