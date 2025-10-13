'use client';

import { Profile } from '@/types';
import { Star } from 'lucide-react';
import { api, generateAvatarUrl } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { toDisplayNumber } from '@/lib/neo4j-utils';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const profileId = profile.id;
  const displayName = profile.firstName || profile.username || `User ${profileId}`;
  
  return (
    <Link
      href={`/profile/${profileId}`}
      className="relative z-10 block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 border border-green-100"
    >
      <div className="relative h-64">
        <Image
          src={profile.photo0 ? api.getPhoto(profile.photo0) : generateAvatarUrl(displayName, profileId)}
          alt={`Profile ${profileId}`}
          width={300}
          height={256}
          unoptimized
          className="w-full h-full object-cover"
        />
        
        {(profile as Profile & {isOnline?: boolean}).isOnline && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-900/70 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">
            {displayName}
          </h3>
          <p className="text-white/80 text-sm">
            @{profile.username}
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-green-700 flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {toDisplayNumber(profile.fameRating, '0')}/100
          </span>
        </div>

        <p className="text-sm text-green-800 line-clamp-2 mb-2">
          {profile.biography || 'No bio yet'}
        </p>
      </div>
    </Link>
  );
}