// src/components/features/home/FeaturedProfiles.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Heart, X } from 'lucide-react';
import ProfileCard from '@/components/features/profiles/ProfileCard';
import { type Profile } from '@/types/profile';
import { FEATURED_PROFILES } from '@/constants/profiles';

interface FeaturedProfilesProps {
  profiles?: Profile[];
}

const FeaturedProfiles = ({
  profiles = FEATURED_PROFILES
}: FeaturedProfilesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const hasMoreProfiles = currentIndex < profiles.length - 1;

  const handleLike = () => {
    if (hasMoreProfiles) {
      setDirection('right');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    }
  };

  const handleDislike = () => {
    if (hasMoreProfiles) {
      setDirection('left');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    }
  };

  return (
    <section className="py-6 px-4 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Discover</h2>
        <Link
          href="/browse"
          className="flex items-center text-pink-500 font-medium"
        >
          See All <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="relative h-96 max-w-sm mx-auto mb-6">
        {profiles.map((profile, index) => (
          <div
            key={profile.id}
            className={`absolute inset-0 transition-all duration-300 shadow-lg rounded-xl overflow-hidden
              ${index < currentIndex ? 'hidden' : ''}
              ${index === currentIndex ? 'z-10' : ''}
              ${index === currentIndex + 1 ? 'z-[5] scale-95 -translate-y-2 opacity-80' : ''}
              ${index === currentIndex + 2 ? 'z-[1] scale-90 -translate-y-4 opacity-60' : ''}
              ${index > currentIndex + 2 ? 'hidden' : ''}
              ${direction === 'left' && index === currentIndex ? '-translate-x-full -rotate-6 opacity-0' : ''}
              ${direction === 'right' && index === currentIndex ? 'translate-x-full rotate-6 opacity-0' : ''}
            `}
          >
            <ProfileCard profile={profile} />
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-8">
        <button
          onClick={handleDislike}
          disabled={!hasMoreProfiles}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-md text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Dislike"
        >
          <X size={28} />
        </button>
        <button
          onClick={handleLike}
          disabled={!hasMoreProfiles}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-md text-green-500 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Like"
        >
          <Heart size={28} />
        </button>
      </div>
    </section>
  );
};

export default FeaturedProfiles;
