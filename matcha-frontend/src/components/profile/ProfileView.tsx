'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { api, generateAvatarUrl, getPhotoUrl } from '@/lib/api';
import { Profile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import AuthImage from '@/components/AuthImage';
import Modal from '@/components/Modal';
import { toNumber, getLastSeenString } from '@/lib/neo4j-utils';
import { escapeHtml, removeTags, sanitizeInput } from '@/lib/security';
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
  const [hasUserLiked, setHasUserLiked] = useState(false);
  const [hasProfileLikedUser, setHasProfileLikedUser] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [likeError, setLikeError] = useState('');
  const [modalState, setModalState] = useState<{ type: 'success' | 'error' | 'confirm' | null; title: string; message: string; action?: () => void }>({ type: null, title: '', message: '' });
  const { user } = useAuth();
  const router = useRouter();

  const displayName = useMemo(
    () => {
      const name = escapeHtml(removeTags(profile?.firstName || profile?.username || 'User'));
      return name.length > 50 ? name.substring(0, 47) + '...' : name;
    },
    [profile?.firstName, profile?.username]
  );

  const displayUsername = useMemo(
    () => {
      const username = escapeHtml(removeTags(profile?.username || 'user'));
      return username.length > 30 ? username.substring(0, 27) + '...' : username;
    },
    [profile?.username]
  );

  const displayBiography = useMemo(
    () => sanitizeInput(profile?.biography || 'No biography available.'),
    [profile?.biography]
  );

  const loadProfile = useCallback(async () => {
    if (!userId) {
      console.error('No userId provided');
      setLoading(false);
      return;
    }

    try {
      const response = await api.getProfile(userId);
      setProfile(response.data || null);

      if (user && user.id !== userId) {
        try {
          await api.recordUserView(userId);
        } catch (viewError) {
          console.debug('View recording skipped:', viewError);
        }

        if (response.data?.connectionStatus) {
          setHasProfileLikedUser(response.data.connectionStatus.likedBack);
          setIsConnected(response.data.connectionStatus.matched);
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

    if (!user) {
      return;
    }

    try {
      const response = await api.getProfile();
      const currentUserProfile = response.data;
      if (!currentUserProfile?.photo0) {
        setLikeError('You must add a profile picture before you can like someone');
        return;
      }
    } catch (error) {
      console.error('Failed to fetch current user profile:', error);
      setLikeError('Failed to verify profile picture requirement');
      return;
    }

    try {
      setLikeError('');
      await api.likeUser(userId);
      setHasUserLiked(true);
      setModalState({
        type: 'success',
        title: 'Profile Liked!',
        message: 'You have successfully liked this profile.',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Failed to like:', error);
      if (errorMsg.includes('already liked')) {
        setLikeError('You have already liked this profile');
      } else if (errorMsg.includes('cannot like yourself')) {
        setLikeError('You cannot like your own profile');
      } else {
        setModalState({
          type: 'error',
          title: 'Failed to Like',
          message: 'An error occurred while trying to like this profile. Please try again.',
        });
      }
    }
  };

  const handleUnlike = async () => {
    if (!profile || !userId) {
      console.error('Cannot unlike: profile or userId is missing');
      return;
    }

    try {
      setLikeError('');
      await api.unlikeUser(userId);
      setHasUserLiked(false);
      setModalState({
        type: 'success',
        title: 'Profile Unliked',
        message: 'You have successfully unliked this profile.',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Failed to unlike:', error);
      setModalState({
        type: 'error',
        title: 'Failed to Unlike',
        message: 'An error occurred while trying to unlike this profile. Please try again.',
      });
    }
  };

  const handleBlock = async () => {
    if (!profile || !userId) {
      console.error('Cannot block: profile or userId is missing');
      return;
    }

    setModalState({
      type: 'confirm',
      title: 'Block User',
      message: `Are you sure you want to block @${profile.username}? You won't be able to interact with this user anymore.`,
      action: async () => {
        try {
          await api.blockUser(userId);
          setIsBlocked(true);
          setModalState({
            type: 'success',
            title: 'User Blocked',
            message: 'This user has been blocked successfully.',
            action: () => router.push('/browse'),
          });
        } catch (error) {
          console.error('Failed to block user:', error);
          setModalState({
            type: 'error',
            title: 'Failed to Block',
            message: 'An error occurred while blocking this user. Please try again.',
          });
        }
      },
    });
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
      setShowReportModal(false);
      setReportReason('');
      setModalState({
        type: 'success',
        title: 'Report Submitted',
        message: 'Thank you for reporting this user. Our moderation team will review it shortly.',
        action: () => router.push('/browse'),
      });
    } catch (error) {
      const errorMessage = (error as Error).message || 'Failed to report user. Please try again.';
      setReportError(errorMessage);
      console.error('Failed to report user:', error);
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
        <p className="text-gray-600 mb-6">This user's profile doesn't exist or has been deleted.</p>
        <button
          onClick={() => router.push('/browse')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Back to Browse
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-2xl overflow-hidden">
        <div className="relative h-48 sm:h-64 md:h-96">
          <AuthImage
            src={profile.photo0 ? getPhotoUrl(profile.photo0) : generateAvatarUrl(profile.firstName || profile.username || 'User', profile.id)}
            alt={profile.username || 'Profile'}
            width={1024}
            height={384}
            className="w-full h-full object-cover"
            unoptimized
            fallbackSrc={generateAvatarUrl(profile.firstName || profile.username || 'User', profile.id)}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 className="text-3xl font-bold text-white">
              {displayName}
            </h1>
            <p className="text-white/90">
              @{displayUsername}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-6 mb-6 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Fame Rating: {`${toNumber(profile.fameRating) ?? '0'}/100`}
            </span>
            {profile.location && (
              <span className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {profile.location.latitude.toFixed(2)}, {profile.location.longitude.toFixed(2)}
              </span>
            )}
            {profile.lastOnline && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Last seen: {getLastSeenString(profile.lastOnline)}
              </span>
            )}
            {user && user.id !== userId && hasProfileLikedUser && (
              <span className="text-sm px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full font-medium">
                ♥ They liked you!
              </span>
            )}
            {user && user.id !== userId && isConnected && (
              <span className="text-sm px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                💬 Connected
              </span>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">About</h2>
            <p className="text-gray-700 dark:text-gray-300">{displayBiography}</p>
          </div>

          {user && user.id !== userId && (
            <div>
              {likeError && (
                <div className="mb-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                  {likeError}
                </div>
              )}
              <div className="flex gap-2">
                {isConnected ? (
                  <button
                    disabled={true}
                    title="You are already connected"
                    className="flex-1 py-2 rounded-md bg-gray-400 text-white disabled:cursor-not-allowed"
                  >
                    💬 Connected
                  </button>
                ) : hasUserLiked ? (
                  <button
                    onClick={handleUnlike}
                    title="Unlike this profile"
                    className="flex-1 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    ❤️ Unlike
                  </button>
                ) : (
                  <button
                    onClick={handleLike}
                    title="Like this profile"
                    className="flex-1 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
                  >
                    Like
                  </button>
                )}
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
                Please tell us why you&apos;re reporting @{displayUsername}. This helps us maintain a safe community.
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

      <Modal
        isOpen={modalState.type === 'success'}
        type="alert"
        title={modalState.title}
        message={modalState.message}
        onClose={() => {
          setModalState({ type: null, title: '', message: '' });
          modalState.action?.();
        }}
        confirmText="OK"
      />

      <Modal
        isOpen={modalState.type === 'error'}
        type="alert"
        title={modalState.title}
        message={modalState.message}
        onClose={() => setModalState({ type: null, title: '', message: '' })}
        confirmText="OK"
      />

      <Modal
        isOpen={modalState.type === 'confirm'}
        type="confirm"
        title={modalState.title}
        message={modalState.message}
        onConfirm={modalState.action}
        onClose={() => setModalState({ type: null, title: '', message: '' })}
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </div>
  );
}
