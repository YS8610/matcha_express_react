import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Star } from 'lucide-react';
import { type Profile } from '@/types/profile';

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard = memo(({ profile }: ProfileCardProps) => {
  return (
    <div className="profile-card card">
      <div className="profile-image-container relative w-full h-[300px]">
        <Image
          src={profile.imageUrl}
          alt={`${profile.name}'s profile`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          loading="lazy"
          className="profile-image object-cover"
        />
      </div>

      <div className="profile-details">
        <div className="profile-header d-flex justify-content-between align-items-center">
          <h3 className="profile-name">
            {profile.name}, {profile.age}
          </h3>
          <div className={`online-status ${profile.online ? 'online' : 'offline'}`}>
            <span className="status-indicator"></span>
            <span>{profile.online ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        <div className="profile-info">
          <MapPin size={16} />
          <span>
            {profile.location} • {profile.distance} miles away
          </span>
        </div>

        <p className="profile-bio">{profile.bio}</p>

        <div className="profile-tags">
          {profile.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="profile-footer d-flex justify-content-between align-items-center">
          <div className="fame-rating">
            <Star size={16} className="star" />
            <span>{profile.fameRating.toFixed(1)}</span>
          </div>

          <div className="profile-actions d-flex gap-sm">
            <Link href={`/profile/${profile.id}`} className="btn btn-outline">
              View Profile
            </Link>
            <button className="btn btn-connect">
              <Heart size={16} />
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ProfileCard.displayName = 'ProfileCard';

export default ProfileCard;
