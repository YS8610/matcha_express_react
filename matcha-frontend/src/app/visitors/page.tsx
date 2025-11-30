'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Users } from 'lucide-react';
import AuthImage from '@/components/AuthImage';
import type { ProfileViewed } from '@/types';
import { api, generateAvatarUrl } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function VisitorsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'viewed-by' | 'viewed'>('viewed-by');
  const [viewedByMe, setViewedByMe] = useState<ProfileViewed[]>([]);
  const [viewedMe, setViewedMe] = useState<ProfileViewed[]>([]);
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

      const [viewedByMeData, viewedMeData] = await Promise.all([
        api.getUsersViewed(),
        api.getUsersWhoViewedMe(),
      ]);

      setViewedByMe(viewedByMeData.data || []);
      setViewedMe(viewedMeData.data || []);
    } catch (err) {
      setError((err as Error).message || 'Failed to load visitors data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const ProfileCard = ({ profile }: { profile: ProfileViewed }) => {
    const photoUrl = profile.photo0
      ? `/api/photo/${profile.photo0}`
      : generateAvatarUrl(profile.firstName + ' ' + profile.lastName, profile.userId);

    return (
      <div
        onClick={() => handleProfileClick(profile.userId)}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      >
        <div className="relative h-48">
          <AuthImage
            src={photoUrl}
            alt={profile.username}
            fill
            className="object-cover"
            unoptimized
            fallbackSrc={generateAvatarUrl(profile.firstName + ' ' + profile.lastName, profile.userId)}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">@{profile.username}</p>
        </div>
      </div>
    );
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
        <Eye className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-full">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">
            Profile Visitors
          </h1>
          <p className="text-green-600">See who viewed your profile and who you&apos;ve checked out</p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('viewed-by')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'viewed-by'
                  ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-950'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" />
                <span>Who Viewed Me</span>
                {viewedMe.length > 0 && (
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    {viewedMe.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('viewed')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'viewed'
                  ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-950'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" />
                <span>I Viewed</span>
                {viewedByMe.length > 0 && (
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    {viewedByMe.length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

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
            {activeTab === 'viewed-by' && (
              <div>
                {viewedMe.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {viewedMe.map((profile) => (
                      <ProfileCard key={profile.userId} profile={profile} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No one has viewed your profile yet. Keep your profile updated to attract more visitors!" />
                )}
              </div>
            )}

            {activeTab === 'viewed' && (
              <div>
                {viewedByMe.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {viewedByMe.map((profile) => (
                      <ProfileCard key={profile.userId} profile={profile} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="You haven't viewed any profiles yet. Start browsing to discover matches!" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
