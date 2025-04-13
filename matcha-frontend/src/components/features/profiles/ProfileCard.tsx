// src/components/features/profiles/ProfileCard.tsx
import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, X } from 'lucide-react';
import { type Profile } from '@/types/profile';

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard = memo(({ profile }: ProfileCardProps) => {
  return (
    <div className="relative w-full h-[580px] rounded-xl overflow-hidden shadow-lg">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={profile.imageUrl}
          alt={`${profile.name}'s profile`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          loading="lazy"
          className="object-cover"
        />
      </div>
      
      <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-black/70 to-transparent" />
      
      <div className="absolute top-4 right-4 z-10">
        <div className={`px-2 py-1 rounded-full text-xs ${profile.online ? 'bg-green-500' : 'bg-gray-500'} text-white flex items-center gap-1`}>
          <span className={`inline-block w-2 h-2 rounded-full ${profile.online ? 'bg-green-200' : 'bg-gray-300'}`}></span>
          <span>{profile.online ? 'Online' : 'Offline'}</span>
        </div>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 p-4 text-white z-10">
        <div className="mb-2">
          <h3 className="text-2xl font-bold">
            {profile.name}, {profile.age}
          </h3>
          <div className="flex items-center text-sm mt-1 text-gray-200">
            <MapPin size={14} className="mr-1" />
            <span>{profile.location} • {profile.distance} miles away</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-200 mb-3">
          {profile.bio.length > 80 ? `${profile.bio.substring(0, 80)}...` : profile.bio}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {profile.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-white/20 rounded-full text-xs">
              {tag}
            </span>
          ))}
          {profile.tags.length > 3 && (
            <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
              +{profile.tags.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex justify-center gap-4 mt-2">
          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-red-500 shadow-lg hover:scale-110 transition-transform">
            <X size={24} />
          </button>
          <Link href={`/profile/${profile.id}`} className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
          </Link>
          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-green-500 shadow-lg hover:scale-110 transition-transform">
            <Heart size={24} />
          </button>
        </div>
      </div>
    </div>
  );
});

ProfileCard.displayName = 'ProfileCard';
export default ProfileCard;
