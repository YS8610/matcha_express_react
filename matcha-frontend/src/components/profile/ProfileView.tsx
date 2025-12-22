'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { api, generateAvatarUrl } from '@/lib/api';
import { Profile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import AuthImage from '@/components/AuthImage';
import Modal from '@/components/Modal';
import { toNumber, getLastSeenString } from '@/lib/neo4j-utils';
import { removeTags, sanitizeInput } from '@/lib/security';
import { calculateDistance, formatDistance } from '@/lib/distance';
import { ShieldBan, Flag, X, Heart, MessageCircle, ChevronLeft, ChevronRight, Circle, MapPin, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GENDER_MALE, GENDER_FEMALE, SEXUAL_PREFERENCE_MALE, SEXUAL_PREFERENCE_FEMALE } from '@/constants';

interface ProfileViewProps {
  userId: string;
  isModal?: boolean;
}

export default function ProfileView({ userId, isModal = false }: ProfileViewProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; statusCode?: number } | null>(null);
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
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [locationName, setLocationName] = useState<string>('');
  const [distance, setDistance] = useState<number | null>(null);
  const [viewedUserIds, setViewedUserIds] = useState<Set<string>>(new Set());
  const [myTags, setMyTags] = useState<string[]>([]);
  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const currentUserId = user?.id;

  const displayName = useMemo(
    () => {
      const name = removeTags(profile?.firstName || profile?.username || 'User');
      return name.length > 50 ? name.substring(0, 47) + '...' : name;
    },
    [profile?.firstName, profile?.username]
  );

  const displayUsername = useMemo(
    () => {
      const username = removeTags(profile?.username || 'user');
      return username.length > 30 ? username.substring(0, 27) + '...' : username;
    },
    [profile?.username]
  );

  const displayBiography = useMemo(
    () => sanitizeInput(profile?.biography || 'No biography available.'),
    [profile?.biography]
  );

  const isOnline = useMemo(() => {
    if (!profile?.lastOnline) return false;
    return (Date.now() - profile.lastOnline) < 5 * 60 * 1000;
  }, [profile?.lastOnline]);

  const availablePhotos = useMemo(() => {
    if (!profile) return [];
    const photos = [];
    if (profile.photo0) photos.push(profile.photo0);
    if (profile.photo1) photos.push(profile.photo1);
    if (profile.photo2) photos.push(profile.photo2);
    if (profile.photo3) photos.push(profile.photo3);
    if (profile.photo4) photos.push(profile.photo4);
    return photos;
  }, [profile]);

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % availablePhotos.length);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + availablePhotos.length) % availablePhotos.length);
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      try {
        const response = await api.getProfile(userId);
        if (cancelled) return;

        setProfile((response.data as unknown as Profile) || null);
        setError(null);

        if (currentUserId && currentUserId !== userId) {
          try {
            const viewedResponse = await api.getUsersViewed() as { data?: Array<{ id: string }> } | Array<{ id: string }>;
            if (cancelled) return;

            const viewedUsers = Array.isArray(viewedResponse) ? viewedResponse : (viewedResponse?.data || []);
            const viewedIds = new Set(viewedUsers.map(u => u.id));
            setViewedUserIds(viewedIds);

            if (!viewedIds.has(userId)) {
              try {
                await api.recordUserView(userId);
                if (cancelled) return;

                viewedIds.add(userId);
                setViewedUserIds(new Set(viewedIds));
              } catch (viewError) {
              }
            }
          } catch (viewError) {
            try {
              await api.recordUserView(userId);
            } catch (err) {
            }
          }

          if (response.data) {
            const typedData = response.data as Record<string, unknown>;
            const connectionStatus = typedData.connectionStatus as Record<string, unknown>;
            if (connectionStatus) {
              setHasProfileLikedUser((connectionStatus.likedBack as boolean) || false);
              setIsConnected((connectionStatus.matched as boolean) || false);
            }
          }
        }
      } catch (err) {
        if (cancelled) return;

        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
        let statusCode = 404;

        if (errorMessage.includes('blocked') || errorMessage.includes('blocking')) {
          statusCode = 403;
        }

        setError({ message: errorMessage, statusCode });
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [userId, currentUserId]);

  useEffect(() => {
    if (profile?.latitude !== undefined && profile?.longitude !== undefined) {
      const latitude = profile.latitude;
      const longitude = profile.longitude;
    }
  }, [profile?.latitude, profile?.longitude]);

  useEffect(() => {
    const fetchCurrentUserLocation = async () => {
      if (!user || !profile || user.id === userId) {
        setDistance(null);
        return;
      }

      if (
        profile.latitude !== undefined &&
        profile.longitude !== undefined
      ) {
        try {
          const response = await api.getProfile();
          const currentUserProfile = response.data as unknown as Profile;

          if (
            currentUserProfile.latitude !== undefined &&
            currentUserProfile.longitude !== undefined
          ) {
            const dist = calculateDistance(
              currentUserProfile.latitude,
              currentUserProfile.longitude,
              profile.latitude,
              profile.longitude
            );
            setDistance(dist);
          }
        } catch (error) {
        }
      }
    };

    fetchCurrentUserLocation();
  }, [user, profile, userId]);

  useEffect(() => {
    const fetchMyTags = async () => {
      if (!user || user.id === userId) {
        setMyTags([]);
        return;
      }

      try {
        const response = await api.getUserTags() as { tags?: string[] };
        setMyTags(response.tags || []);
      } catch (error) {
        setMyTags([]);
      }
    };

    fetchMyTags();
  }, [user, userId]);

  const handleLike = async () => {
    if (!profile || !userId) {
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
      setLikeError('Failed to verify profile picture requirement');
      return;
    }

    try {
      setLikeError('');
      await api.likeUser(userId);
      setHasUserLiked(true);
      addToast('Profile liked! 💚', 'success', 3000);
      setModalState({
        type: 'success',
        title: 'Profile Liked!',
        message: 'You have successfully liked this profile.',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes('already liked')) {
        setLikeError('You have already liked this profile');
        addToast('You have already liked this profile', 'warning', 3000);
      } else if (errorMsg.includes('cannot like yourself')) {
        setLikeError('You cannot like your own profile');
        addToast('You cannot like your own profile', 'warning', 3000);
      } else {
        addToast('Failed to like profile', 'error', 4000);
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
      return;
    }

    setModalState({
      type: 'confirm',
      title: 'Unlike Profile',
      message: `Are you sure you want to unlike @${profile.username}? This will disable chat and stop notifications from this user.`,
      action: async () => {
        try {
          setLikeError('');
          await api.unlikeUser(userId);
          setHasUserLiked(false);
          setIsConnected(false);
          addToast('Profile unliked - Chat disabled', 'success', 3000);
          setModalState({
            type: 'success',
            title: 'Profile Unliked',
            message: 'You have successfully unliked this profile. Chat and notifications have been disabled.',
          });
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          addToast('Failed to unlike profile', 'error', 4000);
          setModalState({
            type: 'error',
            title: 'Failed to Unlike',
            message: 'An error occurred while trying to unlike this profile. Please try again.',
          });
        }
      },
    });
  };

  const handleBlock = async () => {
    if (!profile || !userId) {
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
          addToast(`${profile.username} blocked`, 'success', 3000);
          setModalState({
            type: 'success',
            title: 'User Blocked',
            message: 'This user has been blocked successfully.',
            action: () => router.push('/browse'),
          });
        } catch (error) {
          addToast('Failed to block user', 'error', 4000);
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
      return;
    }

    setReportLoading(true);
    setReportError('');

    try {
      await api.reportUser(userId, reportReason.trim());
      setShowReportModal(false);
      setReportReason('');
      addToast('Report submitted successfully', 'success', 3000);
      setModalState({
        type: 'success',
        title: 'Report Submitted',
        message: 'Thank you for reporting this user. Our moderation team will review it shortly.',
        action: () => router.push('/browse'),
      });
    } catch (error) {
      const errorMessage = (error as Error).message || 'Failed to report user. Please try again.';
      setReportError(errorMessage);
      addToast(errorMessage, 'error', 4000);
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) return (
    <div className={`flex items-center justify-center ${isModal ? 'min-h-[400px]' : 'min-h-screen'}`}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    </div>
  );

  if (error) {
    let title = 'Profile Not Found';
    let message = "This user's profile doesn't exist or has been deleted.";

    if (error.statusCode === 403) {
      title = 'Access Denied';
      message = 'You are blocked by this user or this user is blocked by you. You cannot view their profile.';
    }

    return (
      <div className={`flex items-center justify-center ${isModal ? 'min-h-[400px]' : 'min-h-screen'}`}>
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
          {!isModal && (
            <button
              onClick={() => router.push('/browse')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Browse
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!profile) return (
    <div className={`flex items-center justify-center ${isModal ? 'min-h-[400px]' : 'min-h-screen'}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Loading...</h2>
      </div>
    </div>
  );

  return (
    <div className={`max-w-4xl mx-auto ${isModal ? 'p-0' : 'p-6'}`}>
      {!isModal && (
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-48 sm:h-64 md:h-96 w-full aspect-video group">
          {availablePhotos.length > 0 ? (
            <>
              <AuthImage
                src={availablePhotos[currentPhotoIndex] ? `/api/photo/${availablePhotos[currentPhotoIndex]}` : generateAvatarUrl(profile.firstName || profile.username || 'User', profile.id)}
                alt={profile.username || 'Profile'}
                fill
                className="object-cover"
                unoptimized
                fallbackSrc={generateAvatarUrl(profile.firstName || profile.username || 'User', profile.id)}
              />

              {availablePhotos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="Previous photo"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="Next photo"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {availablePhotos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentPhotoIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                          }`}
                        title={`Photo ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <AuthImage
              src={generateAvatarUrl(profile.firstName || profile.username || 'User', profile.id)}
              alt={profile.username || 'Profile'}
              fill
              className="object-cover"
              unoptimized
            />
          )}
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {displayName}
              </h1>
              {isOnline && (
                <div className="flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
                  <Circle className="w-2.5 h-2.5 fill-green-500 text-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Online</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              @{displayUsername}
            </p>
          </div>
          <div className="flex items-center gap-6 mb-6 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Fame Rating: {`${toNumber(profile.fameRating) ?? '0'}/100`}
            </span>
            {!isOnline && profile.lastOnline && (
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                <Circle className="w-2 h-2 fill-gray-400 dark:fill-gray-500 text-gray-400 dark:text-gray-500" />
                Last seen: {getLastSeenString(profile.lastOnline)}
              </span>
            )}
            {user && user.id !== userId && hasProfileLikedUser && (
              <span className="text-sm px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full font-medium inline-flex items-center gap-1">
                <Heart className="w-4 h-4 fill-current" />
                They liked you!
              </span>
            )}
            {user && user.id !== userId && isConnected && (
              <span className="text-sm px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium inline-flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                Connected
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Gender</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                {profile.gender === GENDER_MALE ? 'Male' : profile.gender === GENDER_FEMALE ? 'Female' : 'Other'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Looking for</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                {profile.sexualPreference === SEXUAL_PREFERENCE_MALE ? 'Male' : profile.sexualPreference === SEXUAL_PREFERENCE_FEMALE ? 'Female' : 'Both'}
              </p>
            </div>
            {profile.birthDate && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Age</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                  {(() => {
                    const bd = profile.birthDate as unknown as { year?: number; month?: number; day?: number };
                    if (bd.year) return new Date().getFullYear() - Number(bd.year);
                    return 'N/A';
                  })()}
                </p>
              </div>
            )}
            {(profile.latitude !== undefined && profile.longitude !== undefined) && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Location</p>
                {distance !== null && user && user.id !== userId && (
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">
                      {formatDistance(distance)} away
                    </span>
                  </div>
                )}
                <a
                  href={`https://www.google.com/maps?q=${profile.latitude},${profile.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline mt-0.5 inline-flex items-center gap-1"
                  title="View on Google Maps"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile.latitude.toFixed(8)}°, {profile.longitude.toFixed(8)}°
                </a>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">About</h2>
            <p className="text-gray-700 dark:text-gray-300">{displayBiography}</p>
          </div>

          {profile.userTags && profile.userTags.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.userTags.map((tag, index) => {
                  const isShared = myTags.includes(tag);
                  return (
                    <span
                      key={index}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${isShared
                          ? 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/50 dark:to-yellow-900/50 text-amber-900 dark:text-amber-200 border-2 border-amber-400 dark:border-amber-600 shadow-sm'
                          : 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-green-800 dark:text-emerald-200 border border-green-300 dark:border-emerald-700'
                        }`}
                      title={isShared ? 'Shared interest!' : undefined}
                    >
                      #{tag}
                      {isShared && <span className="ml-1.5">✨</span>}
                    </span>
                  );
                })}
              </div>
              {myTags.length > 0 && profile.userTags.some(tag => myTags.includes(tag)) && (
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <span>✨</span>
                  <span>Shared interests highlighted</span>
                </p>
              )}
            </div>
          )}

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
                    onClick={handleUnlike}
                    title="Click to unmatch - This will disable chat and notifications"
                    className="flex-1 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Unmatch
                  </button>
                ) : hasUserLiked ? (
                  <button
                    onClick={handleUnlike}
                    title="Unlike this profile"
                    className="flex-1 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    Unlike
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
