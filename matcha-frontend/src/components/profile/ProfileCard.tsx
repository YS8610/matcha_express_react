// src/components/profile/ProfileCard.tsx
import React, { useState } from 'react';
import { Heart, X, MapPin, Star, Info, Camera } from 'lucide-react';
import { Profile } from '../types/profile';

interface ProfileCardProps {
  profile: Profile;
  onLike: (profileId: number) => void;
  onPass: (profileId: number) => void;
  onViewProfile?: (profileId: number) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  onLike, 
  onPass, 
  onViewProfile 
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showFullBio, setShowFullBio] = useState(false);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === profile.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? profile.photos.length - 1 : prev - 1
    );
  };

  const handleLike = () => {
    onLike(profile.id);
  };

  const handlePass = () => {
    onPass(profile.id);
  };

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(profile.id);
    }
  };

  const truncatedBio = profile.bio.length > 100 
    ? profile.bio.substring(0, 100) + '...' 
    : profile.bio;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto">
      <div className="relative">
        <img
          src={profile.photos[currentPhotoIndex]}
          alt={`${profile.name} photo ${currentPhotoIndex + 1}`}
          className="w-full h-96 object-cover"
        />
        
        {profile.photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50"
            >
              ←
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50"
            >
              →
            </button>
            
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {profile.photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-4 right-4 bg-black/50 text-white rounded-full px-2 py-1 text-xs flex items-center">
          <Camera size={12} className="mr-1" />
          {profile.photos.length}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="text-white">
            <h3 className="text-xl font-bold">{profile.name}, {profile.age}</h3>
            <p className="flex items-center opacity-90">
              <MapPin size={16} className="mr-1" />
              {profile.distance}
            </p>
          </div>
        </div>

        <div className="absolute top-4 left-4">
          <div className={`w-3 h-3 rounded-full ${
            profile.isOnline ? 'bg-green-400' : 'bg-gray-400'
          } border-2 border-white`} />
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <p className="text-gray-600">
            {showFullBio ? profile.bio : truncatedBio}
          </p>
          {profile.bio.length > 100 && (
            <button
              onClick={() => setShowFullBio(!showFullBio)}
              className="text-pink-500 text-sm hover:text-pink-600 mt-1"
            >
              {showFullBio ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {profile.tags.slice(0, 4).map((tag, index) => (
            <span 
              key={index} 
              className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
          {profile.tags.length > 4 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
              +{profile.tags.length - 4} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="text-yellow-400 fill-current" size={16} />
            <span className="ml-1 text-sm text-gray-600 font-medium">
              {profile.fameRating}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              profile.isOnline ? 'bg-green-400' : 'bg-gray-400'
            }`} />
            {profile.isOnline ? 'Online now' : `Last seen ${profile.lastSeen}`}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handlePass}
            className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <X size={20} />
          </button>
          
          {onViewProfile && (
            <button
              onClick={handleViewProfile}
              className="bg-blue-100 text-blue-600 p-3 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Info size={20} />
            </button>
          )}
          
          <button
            onClick={handleLike}
            className="flex-1 bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center"
          >
            <Heart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
