'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import AuthImage from '@/components/AuthImage';
import { api, generateAvatarUrl, getPhotoUrl } from '@/lib/api';
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
      setLikedMe(response.data || []);
    } catch (err) {
      setError((err as Error).message || 'Failed to load likes data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const ProfileCard = ({ profile }: { profile: ProfileShort }) => {
    const photoUrl = profile.photo0
      ? getPhotoUrl(profile.photo0)
      : generateAvatarUrl(profile.firstName + ' ' + profile.lastName, profile.id);

    return (
      <div
        onClick={() => handleProfileClick(profile.id)}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      >
        <div className="relative h-48">
          <AuthImage
            src={photoUrl}
            alt={profile.username}
            fill
            className="object-cover"
            unoptimized
            fallbackSrc={generateAvatarUrl(profile.firstName + ' ' + profile.lastName, profile.id)}
          />
          <div className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full">
            <Heart className="w-4 h-4 fill-current" />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">@{profile.username}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center text-yellow-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm ml-1">{profile.fameRating || 0}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
        <Heart className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-gray-500 dark:text-gray-400">No one has liked you yet. Keep your profile updated to attract more interest!</p>
    </div>
  );

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

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {likedMe.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedMe.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
