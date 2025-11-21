'use client';

import { useMemo } from 'react';
import { ProfileShort } from '@/types';
import { Star } from 'lucide-react';
import { generateAvatarUrl, getPhotoUrl } from '@/lib/api';
import Link from 'next/link';
import AuthImage from '@/components/AuthImage';
import { formatFameRating, getLastSeenString } from '@/lib/neo4j-utils';
import { stripAndEncode } from '@/lib/security';

interface ProfileCardProps {
  profile: ProfileShort & { distance?: number };
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const profileId = profile.id;

  const displayName = useMemo(
    () => {
      const name = stripAndEncode(profile.firstName || profile.username || `User ${profileId}`);
      return name.length > 30 ? name.substring(0, 27) + '...' : name;
    },
    [profile.firstName, profile.username, profileId]
  );

  const displayUsername = useMemo(
    () => {
      const username = stripAndEncode(profile.username || 'user');
      return username.length > 25 ? username.substring(0, 22) + '...' : username;
    },
    [profile.username]
  );

  const isOnline = profile.lastOnline ? (Date.now() - profile.lastOnline) < 5 * 60 * 1000 : false;

  return (
    <Link
      href={`/profile/${profileId}`}
      className="relative z-10 block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 border border-green-100"
    >
      <div className="relative h-64">
        <AuthImage
          src={profile.photo0 ? getPhotoUrl(profile.photo0) : generateAvatarUrl(displayName, profileId)}
          alt={`Profile ${profileId}`}
          width={300}
          height={256}
          unoptimized
          className="w-full h-full object-cover"
          fallbackSrc={generateAvatarUrl(displayName, profileId)}
        />

        {isOnline && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-900/70 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">
            {displayName}
          </h3>
          <p className="text-white/80 text-sm">
            @{displayUsername}
          </p>
          {profile.lastOnline && (
            <p className="text-white/70 text-xs mt-1">
              {isOnline ? 'Online now' : `Last seen ${getLastSeenString(profile.lastOnline)}`}
            </p>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-green-700 flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {formatFameRating(profile.fameRating)}
          </span>
          {profile.distance !== undefined && (
            <span className="text-sm text-blue-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {(profile.distance / 1000).toFixed(1)} km
            </span>
          )}
        </div>

        {profile.connectionStatus && (
          <div className="flex flex-wrap gap-2">
            {profile.connectionStatus.matched && (
              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                ❤️ Matched
              </span>
            )}
            {profile.connectionStatus.likedBack && !profile.connectionStatus.matched && (
              <span className="inline-block bg-pink-100 text-pink-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                💗 Liked you
              </span>
            )}
            {profile.connectionStatus.liked && !profile.connectionStatus.matched && !profile.connectionStatus.likedBack && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                👍 Liked
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}