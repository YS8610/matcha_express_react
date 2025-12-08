'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { Alert } from '@/components/ui';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileShort } from '@/types';

export default function LikesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [likedMe, setLikedMe] = useState<ProfileShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadData();
  }, [user, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.getUsersWhoLikedMe();
      setLikedMe(Array.isArray(response) ? response : response.data || []);
    } catch (err) {
      setError((err as Error).message || 'Failed to load likes data');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-red-400 to-pink-600 p-4 rounded-full">
              <Heart className="w-12 h-12 text-white fill-current" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-400 bg-clip-text text-transparent mb-2">
            People Who Liked You
          </h1>
          <p className="text-gray-600 dark:text-gray-400">These users have shown interest in your profile</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {loading ? (
          <LoadingSkeleton count={6} type="grid" />
        ) : likedMe.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedMe.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                showBadge
                badgeIcon={<Heart className="w-4 h-4 fill-current" />}
                badgeClassName="bg-red-500 text-white"
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Heart className="w-8 h-8 text-gray-400 dark:text-gray-500" />}
            title="No one has liked you yet"
            description="Keep your profile updated to attract more interest!"
          />
        )}
      </div>
    </div>
  );
}
