import { MapPin } from 'lucide-react';
import AuthImage from './AuthImage';
import { generateAvatarUrl } from '@/lib/api';
import { ProfileShort } from '@/types';
import { formatDistance } from '@/lib/distance';

interface ProfileCardProps {
  profile: ProfileShort;
  showBadge?: boolean;
  badgeIcon?: React.ReactNode;
  badgeClassName?: string;
}

export default function ProfileCard({
  profile,
  showBadge = false,
  badgeIcon,
  badgeClassName = 'bg-red-500 text-white'
}: ProfileCardProps) {
  const photoUrl = profile.photo0
    ? `/api/photo/${profile.photo0}`
    : generateAvatarUrl(profile.firstName + ' ' + profile.lastName, profile.id);

  const handleClick = () => {
    window.location.href = `/profile/${profile.id}`;
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        <AuthImage
          src={photoUrl}
          alt={profile.username}
          fill
          className="object-cover"
          unoptimized
          fallbackSrc={generateAvatarUrl(profile.firstName + ' ' + profile.lastName, profile.id)}
        />
        {showBadge && badgeIcon && (
          <div className={`absolute top-2 right-2 p-2 rounded-full ${badgeClassName}`}>
            {badgeIcon}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
          {profile.firstName} {profile.lastName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">@{profile.username}</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center text-yellow-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm ml-1">{profile.fameRating || 0}</span>
          </div>
          {profile.distance !== undefined && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{formatDistance(profile.distance)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
