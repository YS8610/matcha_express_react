'use client';

import { useMemo } from 'react';
import { ProfileShort } from '@/types';
import { Star, Heart, ThumbsUp } from 'lucide-react';
import { generateAvatarUrl } from '@/lib/api';
import AuthImage from '@/components/AuthImage';
import { toNumber, getLastSeenString } from '@/lib/neo4j-utils';
import { removeTags } from '@/lib/security';
import { formatDistance } from '@/lib/distance';

interface ProfileCardProps {
  profile: ProfileShort & { distance?: number };
}

const colorSchemes = [
  { border: 'border-green-300 dark:border-green-700', shadow: 'hover:shadow-green-500/20', accent: 'text-green-700 dark:text-green-300' },
  { border: 'border-blue-300 dark:border-blue-700', shadow: 'hover:shadow-blue-500/20', accent: 'text-blue-700 dark:text-blue-300' },
  { border: 'border-purple-300 dark:border-purple-700', shadow: 'hover:shadow-purple-500/20', accent: 'text-purple-700 dark:text-purple-300' },
  { border: 'border-pink-300 dark:border-pink-700', shadow: 'hover:shadow-pink-500/20', accent: 'text-pink-700 dark:text-pink-300' },
  { border: 'border-orange-300 dark:border-orange-700', shadow: 'hover:shadow-orange-500/20', accent: 'text-orange-700 dark:text-orange-300' },
  { border: 'border-red-300 dark:border-red-700', shadow: 'hover:shadow-red-500/20', accent: 'text-red-700 dark:text-red-300' },
  { border: 'border-indigo-300 dark:border-indigo-700', shadow: 'hover:shadow-indigo-500/20', accent: 'text-indigo-700 dark:text-indigo-300' },
  { border: 'border-cyan-300 dark:border-cyan-700', shadow: 'hover:shadow-cyan-500/20', accent: 'text-cyan-700 dark:text-cyan-300' },
];

function getColorScheme(id: string): typeof colorSchemes[0] {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorSchemes[hash % colorSchemes.length];
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const profileId = profile.id;
  const colorScheme = getColorScheme(profileId);

  const displayName = useMemo(
    () => {
      const name = removeTags(profile.firstName || profile.username || `User ${profileId}`);
      return name.length > 30 ? name.substring(0, 27) + '...' : name;
    },
    [profile.firstName, profile.username, profileId]
  );

  const displayUsername = useMemo(
    () => {
      const username = removeTags(profile.username || 'user');
      return username.length > 25 ? username.substring(0, 22) + '...' : username;
    },
    [profile.username]
  );

  const isOnline = profile.lastOnline ? (Date.now() - profile.lastOnline) < 5 * 60 * 1000 : false;

  const hasPhoto = profile.photo0 && profile.photo0.length > 0;

  return (
    <a
      href={`/profile/${profileId}`}
      className={`relative z-10 block bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 border-2 ${colorScheme.border} ${colorScheme.shadow}`}
    >
      <div className="relative h-64 w-full aspect-video">
        <AuthImage
          src={hasPhoto ? `/api/photo/${profile.photo0}` : generateAvatarUrl(displayName, profileId)}
          alt={`Profile ${profileId}`}
          fill
          unoptimized
          className="object-cover"
          fallbackSrc={generateAvatarUrl(displayName, profileId)}
        />

        {isOnline && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {displayName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          @{displayUsername}
        </p>

        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm ${colorScheme.accent} flex items-center gap-1`}>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {`${toNumber(profile.fameRating) ?? '0'}/100`}
          </span>
          {profile.distance !== undefined && (
            <span className="text-sm text-blue-600 dark:text-blue-300 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {formatDistance(profile.distance)}
            </span>
          )}
        </div>

        {profile.connectionStatus && (
          <div className="flex flex-wrap gap-2">
            {profile.connectionStatus.matched && (
              <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
                <Heart className="w-4 h-4 fill-current" />
                Matched
              </span>
            )}
            {profile.connectionStatus.likedBack && !profile.connectionStatus.matched && (
              <span className="inline-flex items-center gap-1 bg-pink-100 dark:bg-pink-900/40 text-pink-800 dark:text-pink-200 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
                <Heart className="w-4 h-4 fill-current" />
                Liked you
              </span>
            )}
            {profile.connectionStatus.liked && !profile.connectionStatus.matched && !profile.connectionStatus.likedBack && (
              <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full">
                <ThumbsUp className="w-4 h-4 fill-current" />
                Liked
              </span>
            )}
          </div>
        )}
      </div>
    </a>
  );
}
