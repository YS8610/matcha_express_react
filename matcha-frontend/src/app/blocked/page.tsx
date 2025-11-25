'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldBan, X } from 'lucide-react';
import AuthImage from '@/components/AuthImage';
import { api, generateAvatarUrl, getPhotoUrl } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileShort } from '@/types';

export default function BlockedPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState<ProfileShort[]>([]);
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

      const response = await api.getBlockedUsers();
      setBlockedUsers(response.data || []);
    } catch (err) {
      setError((err as Error).message || 'Failed to load blocked users');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to unblock @${username}?`)) {
      return;
    }

    try {
      await api.unblockUser(userId);
      setBlockedUsers(blockedUsers.filter(u => u.id !== userId));
    } catch (err) {
      setError((err as Error).message || 'Failed to unblock user');
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="flex items-center p-4">
          <div
            onClick={() => handleProfileClick(profile.id)}
            className="relative w-16 h-16 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <AuthImage
              src={photoUrl}
              alt={profile.username}
              fill
              className="object-cover rounded-full"
              unoptimized
              fallbackSrc={generateAvatarUrl(profile.firstName + ' ' + profile.lastName, profile.id)}
            />
          </div>
          <div
            onClick={() => handleProfileClick(profile.id)}
            className="flex-1 ml-4 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">@{profile.username}</p>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex items-center text-yellow-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm ml-1">{profile.fameRating || 0}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleUnblock(profile.id, profile.username)}
            className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Unblock
          </button>
        </div>
      </div>
    );
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
        <ShieldBan className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-gray-500 dark:text-gray-400">You haven&apos;t blocked anyone yet.</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-gray-600 to-gray-800 p-4 rounded-full">
              <ShieldBan className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent mb-2">
            Blocked Users
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage users you&apos;ve blocked</p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 ml-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {blockedUsers.length > 0 ? (
              <div className="space-y-4">
                {blockedUsers.map((profile) => (
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
