'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, generateAvatarUrl } from '@/lib/api';
import { Profile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { toDisplayNumber } from '@/lib/neo4j-utils';
import { ShieldBan, Flag, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileViewProps {
  userId: string;
}

export default function ProfileView({ userId }: ProfileViewProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const loadProfile = useCallback(async () => {
    if (!userId) {
      console.error('No userId provided');
      setLoading(false);
      return;
    }

    try {
      const data = user && user.id === userId
        ? await api.getProfile()
        : await api.getUserFullProfile(userId);
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

  const handleBlock = async () => {
    if (!profile || !userId) {
      console.error('Cannot block: profile or userId is missing');
      return;
    }

    if (!confirm(`Are you sure you want to block @${profile.username}?`)) {
      return;
    }

    try {
      await api.blockUser(userId);
      setIsBlocked(true);
      alert('User blocked successfully!');
      router.push('/browse');
    } catch (error) {
      console.error('Failed to block user:', error);
      alert('Failed to block user. Please try again.');
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportReason.trim() || reportReason.trim().length < 10) {
      setReportError('Report reason must be at least 10 characters long');
      return;
    }

    if (!profile || !userId) {
      console.error('Cannot report: profile or userId is missing');
      return;
    }

    setReportLoading(true);
    setReportError('');

    try {
      await api.reportUser(userId, reportReason.trim());
      alert('Thank you for reporting this user. Our team will review it.');
      setShowReportModal(false);
      setReportReason('');
      router.push('/browse');
    } catch (error) {
      const errorMessage = (error as Error).message || 'Failed to report user. Please try again.';
      setReportError(errorMessage);
      console.error('Failed to report user:', error);
    } finally {
      setReportLoading(false);
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
          <div className="flex items-center gap-6 mb-6 flex-wrap">
            <span className="text-sm text-gray-600">
              Fame Rating: {toDisplayNumber(profile.fameRating, '0')}/100
            </span>
            {profile.location && (
              <span className="text-sm text-blue-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {profile.location.latitude.toFixed(2)}, {profile.location.longitude.toFixed(2)}
              </span>
            )}
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
              <button
                onClick={handleBlock}
                disabled={isBlocked}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                title="Block this user"
              >
                <ShieldBan className="w-4 h-4" />
                {isBlocked ? 'Blocked' : 'Block'}
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-2"
                title="Report this user"
              >
                <Flag className="w-4 h-4" />
                Report
              </button>
            </div>
          )}
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Report User</h2>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportError('');
                  setReportReason('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReport} className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Please tell us why you&apos;re reporting @{profile.username}. This helps us maintain a safe community.
              </p>

              {reportError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                  {reportError}
                </div>
              )}

              <textarea
                value={reportReason}
                onChange={(e) => {
                  setReportReason(e.target.value);
                  setReportError('');
                }}
                placeholder="Please provide details about why you're reporting this user (minimum 10 characters)..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                rows={5}
                disabled={reportLoading}
              />

              <p className="text-xs text-gray-500 mt-2">
                {reportReason.length}/10 minimum characters
              </p>

              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportError('');
                    setReportReason('');
                  }}
                  disabled={reportLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportLoading || reportReason.trim().length < 10}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reportLoading ? 'Reporting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
