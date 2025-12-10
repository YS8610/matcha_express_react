'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Users } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { Alert } from '@/components/ui';
import type { ProfileShort } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function VisitorsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'viewed-by' | 'viewed'>('viewed-by');
  const [viewedByMe, setViewedByMe] = useState<ProfileShort[]>([]);
  const [viewedMe, setViewedMe] = useState<ProfileShort[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());
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

      const [viewedByMeData, viewedMeData, blockedUsersData] = await Promise.all([
        api.getUsersViewed(),
        api.getUsersWhoViewedMe(),
        api.getBlockedUsers(),
      ]);

      const viewedByMeArray = Array.isArray(viewedByMeData) ? viewedByMeData : viewedByMeData.data || [];
      const viewedMeArray = Array.isArray(viewedMeData) ? viewedMeData : viewedMeData.data || [];

      const transformedViewedByMe: ProfileShort[] = viewedByMeArray.map((item: unknown) => {
        const typedItem = item as Record<string, unknown>;
        return {
          id: typedItem.id as string,
          username: typedItem.username as string,
          firstName: typedItem.firstName as string,
          lastName: typedItem.lastName as string,
          photo0: typedItem.photo0 as string,
          fameRating: (typedItem.fameRating as number) || 0,
          lastOnline: (typedItem.viewedAt as number) || 0,
        };
      });
      const transformedViewedMe: ProfileShort[] = viewedMeArray.map((item: unknown) => {
        const typedItem = item as Record<string, unknown>;
        return {
          id: typedItem.id as string,
          username: typedItem.username as string,
          firstName: typedItem.firstName as string,
          lastName: typedItem.lastName as string,
          photo0: typedItem.photo0 as string,
          fameRating: (typedItem.fameRating as number) || 0,
          lastOnline: (typedItem.viewedAt as number) || 0,
        };
      });

      setViewedByMe(transformedViewedByMe);
      setViewedMe(transformedViewedMe);

      const blockedArray = Array.isArray(blockedUsersData) ? blockedUsersData : blockedUsersData.data || [];
      const blockedIds = new Set(blockedArray.map((user: ProfileShort) => user.id));
      setBlockedUserIds(blockedIds);
    } catch (err) {
      setError((err as Error).message || 'Failed to load visitors data');
    } finally {
      setLoading(false);
    }
  };

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

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

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
          <LoadingSkeleton count={6} type="grid" />
        ) : (
          <div>
            {activeTab === 'viewed-by' && (
              <div>
                {viewedMe.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {viewedMe.map((profile) => (
                      <ProfileCard
                        key={profile.id}
                        profile={profile}
                        isBlocked={blockedUserIds.has(profile.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Eye className="w-8 h-8 text-gray-400 dark:text-gray-500" />}
                    title="No one has viewed your profile yet"
                    description="Keep your profile updated to attract more visitors!"
                  />
                )}
              </div>
            )}

            {activeTab === 'viewed' && (
              <div>
                {viewedByMe.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {viewedByMe.map((profile) => (
                      <ProfileCard
                        key={profile.id}
                        profile={profile}
                        isBlocked={blockedUserIds.has(profile.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Eye className="w-8 h-8 text-gray-400 dark:text-gray-500" />}
                    title="You haven't viewed any profiles yet"
                    description="Start browsing to discover matches!"
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
