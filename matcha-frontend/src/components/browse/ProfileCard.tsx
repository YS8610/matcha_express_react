'use client';

import { Profile } from '@/types';
import { Star } from 'lucide-react';
import { generateAvatarUrl } from '@/utils/avatar';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const profileId = profile.id || profile.userId;
  const displayName = (profile as any).firstName || (profile as any).username || `User ${profileId}`;
  
  return (
    <a
      href={`/profile/${profileId}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-64">
        <img
          src={profile.profilePhoto || generateAvatarUrl(displayName, profileId)}
          alt={`Profile ${profileId}`}
          className="w-full h-full object-cover"
        />
        
        {(profile as any).isOnline && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">
            {displayName}, {profile.age}
          </h3>
          <p className="text-white/80 text-sm">
            {profile.location?.city || 'Unknown'}
            {profile.location?.distance && ` • ${profile.location.distance} km`}
          </p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {profile.fameRating}/100
          </span>
          {profile.hasLikedMe && (
            <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
              Likes you
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-2 mb-2">
          {profile.biography}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {profile.interests.slice(0, 3).map(interest => (
            <span
              key={interest}
              className="text-xs px-2 py-1 bg-gray-100 rounded-full"
            >
              #{interest}
            </span>
          ))}
          {profile.interests.length > 3 && (
            <span className="text-xs text-gray-500">
              +{profile.interests.length - 3} more
            </span>
          )}
        </div>
      </div>
    </a>
  );
}