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
      await api.likeUser(userId);
      alert('Profile liked!');
    } catch (error) {
      console.error('Failed to like:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <Image
            src={profile.photo0 ? api.getPhoto(profile.photo0) : generateAvatarUrl(profile.firstName || profile.username || 'User', profile.id)}
            alt={profile.username || 'Profile'}
            width={1024}
            height={384}
            className="w-full h-full object-cover"
            unoptimized
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 className="text-3xl font-bold text-white">
              {profile.firstName || profile.username || 'User'}
            </h1>
            <p className="text-white/90">
              @{profile.username}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-600">
              Fame Rating: {toDisplayNumber(profile.fameRating, '0')}/100
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-700">{profile.biography || 'No biography available.'}</p>
          </div>

          {user && user.id !== userId && (
            <div className="flex gap-2">
              <button
                onClick={handleLike}
                className="flex-1 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
              >
                Like
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
