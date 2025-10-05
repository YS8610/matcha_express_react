'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, generateAvatarUrl } from '@/lib/api';
import { Profile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { toDisplayNumber } from '@/lib/neo4j-utils';

interface ProfileViewProps {
  userId: string;
}

export default function ProfileView({ userId }: ProfileViewProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const { user } = useAuth();

  const loadProfile = useCallback(async () => {
    if (!userId) {
      console.error('No userId provided');
      setLoading(false);
      return;
    }

    try {
      const data = await api.getProfile(userId);
      setProfile(data);

      if (user && user.id !== userId) {
        try {
          await api.recordUserView(userId);
        } catch (viewError) {
          console.error('Failed to record profile view:', viewError);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, user]);

  useEffect(() => {
    if (userId) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [userId, loadProfile]);

  const handleLike = async () => {
    if (!profile || !userId) {
      console.error('Cannot like: profile or userId is missing');
      return;
    }
    try {
      if (profile.isLiked) {
        await api.unlikeProfile(userId);
        setProfile({ ...profile, isLiked: false });
      } else {
        await api.likeProfile(userId);
        setProfile({ ...profile, isLiked: true });
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleBlock = async () => {
    if (!userId) {
      console.error('Cannot block: userId is missing');
      return;
    }
    try {
      await api.blockUser(userId);
      window.location.href = '/browse';
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };

  const handleReport = async (reason: string) => {
    if (!userId) {
      console.error('Cannot report: userId is missing');
      return;
    }
    try {
      await api.reportUser(userId, reason);
      setShowReportModal(false);
    } catch (error) {
      console.error('Failed to report user:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <Image
            src={profile.profilePhoto || generateAvatarUrl((profile as Profile & {firstName?: string, username?: string}).firstName || (profile as Profile & {firstName?: string, username?: string}).username || 'User', profile.userId || profile.id)}
            alt={profile.userId || 'Profile'}
            width={1024}
            height={384}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 className="text-3xl font-bold text-white">
              {(profile as Profile & {firstName?: string, username?: string}).firstName || (profile as Profile & {firstName?: string, username?: string}).username || profile.userId}{profile.age ? `, ${toDisplayNumber(profile.age)}` : ''}
            </h1>
            <p className="text-white/90">
              {profile.location?.city || 'Unknown location'}
              {profile.location?.distance && ` • ${profile.location.distance} km away`}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-600">
              Fame Rating: {toDisplayNumber(profile.fameRating, '0')}/100
            </span>
            {profile.isOnline ? (
              <span className="text-green-500 text-sm">Online</span>
            ) : (
              <span className="text-gray-500 text-sm">Offline</span>
            )}
          </div>

          {profile.isConnected && (
            <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">
              You&apos;re connected! You can now chat.
            </div>
          )}

          {profile.hasLikedMe && !profile.isConnected && (
            <div className="bg-blue-100 text-blue-800 p-3 rounded-md mb-4">
              This user likes you!
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-700">{profile.biography || 'No biography available.'}</p>
          </div>

          {profile.interests && profile.interests.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map(interest => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                  >
                    #{interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.photos && profile.photos.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Photos</h2>
              <div className="grid grid-cols-3 gap-2">
                {profile.photos.map(photo => (
                  <Image
                    key={photo.id}
                    src={photo.url}
                    alt=""
                    width={128}
                    height={128}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          )}

          {user && user.id !== userId && (
            <div className="flex gap-2">
              <button
                onClick={handleLike}
                className={`flex-1 py-2 rounded-md ${
                  profile.isLiked
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {profile.isLiked ? 'Unlike' : 'Like'}
              </button>
              
              {profile.isConnected && (
                <Link
                  href={`/chat/${userId}`}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 text-center"
                >
                  Chat
                </Link>
              )}
              
              <button
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Report
              </button>
              
              <button
                onClick={handleBlock}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Block
              </button>
            </div>
          )}
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Report User</h3>
            <div className="space-y-2">
              {['Fake account', 'Inappropriate content', 'Harassment', 'Spam'].map(reason => (
                <button
                  key={reason}
                  onClick={() => handleReport(reason)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReportModal(false)}
              className="w-full mt-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
