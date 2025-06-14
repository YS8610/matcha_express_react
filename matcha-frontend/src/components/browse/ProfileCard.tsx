// src/components/browse/ProfileCard.tsx
import React, { useState, useEffect } from 'react';
import { Heart, X, MapPin, Star, Info, Camera, MoreVertical, Shield, Flag, MessageCircle, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { Profile } from '../../types/types';
import { FameRatingDisplay } from '../common/FameRatingDisplay';
import { ReportBlockModal } from '../modals/ReportBlockModal';
import Modal from '../common/Modal';
import * as api from '../../utils/api';

interface ProfileCardProps {
  profile: Profile;
  onLike: (profileId: number) => void;
  onPass: (profileId: number) => void;
  onViewProfile?: (profileId: number) => void;
  currentUser: any;
  showActions?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  onLike, 
  onPass, 
  onViewProfile,
  currentUser,
  showActions = true
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showFullBio, setShowFullBio] = useState(false);
  const [isLiked, setIsLiked] = useState(profile.isLiked || false);
  const [isMatched, setIsMatched] = useState(profile.isMatched || false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showRequirementModal, setShowRequirementModal] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    const recordView = async () => {
      if (!hasViewed && profile.id !== currentUser.id) {
        try {
          await api.recordProfileView(profile.id);
          setHasViewed(true);
        } catch (error) {
          console.error('Failed to record profile view:', error);
        }
      }
    };

    recordView();
  }, [profile.id, currentUser.id, hasViewed]);

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

  const canLike = () => {
    return currentUser.photos && currentUser.photos.length > 0;
  };

  const handleLike = async () => {
    if (!canLike()) {
      setShowRequirementModal(true);
      return;
    }

    try {
      const result = await api.likeProfile(profile.id);
      setIsLiked(true);
      
      if (result.matched) {
        setIsMatched(true);
        alert(`🎉 It's a match with ${profile.name}! You can now start chatting.`);
      }
      
      onLike(profile.id);
    } catch (error) {
      console.error('Failed to like profile:', error);
    }
  };

  const handleUnlike = async () => {
    try {
      await api.unlikeProfile(profile.id);
      setIsLiked(false);
      setIsMatched(false);
    } catch (error) {
      console.error('Failed to unlike profile:', error);
    }
  };

  const handlePass = () => {
    onPass(profile.id);
  };

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(profile.id);
    }
  };

  const handleReport = () => {
    setShowReportModal(true);
    setShowActionsMenu(false);
  };

  const handleBlock = () => {
    setShowBlockModal(true);
    setShowActionsMenu(false);
  };

  const getConnectionStatus = () => {
    if (isMatched) {
      return (
        <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
          <Heart size={12} className="mr-1 fill-current" />
          Connected
        </div>
      );
    } else if (isLiked) {
      return (
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
          <Heart size={12} className="mr-1" />
          Liked
        </div>
      );
    } else if (profile.isLiked) {
      return (
        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
          <Eye size={12} className="mr-1" />
          Likes You
        </div>
      );
    }
    return null;
  };

  const formatLastSeen = (lastSeen: string): string => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) { 
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncatedBio = profile.bio && profile.bio.length > 100 
    ? profile.bio.substring(0, 100) + '...' 
    : profile.bio || '';

  return (
    <>
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
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition-colors"
              >
                ←
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition-colors"
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

          {getConnectionStatus()}

          <div className="absolute bottom-20 left-4">
            <div className={`w-3 h-3 rounded-full border-2 border-white ${
              profile.isOnline ? 'bg-green-400' : 'bg-gray-400'
            }`} />
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{profile.name}, {profile.age}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="flex items-center opacity-90 text-sm">
                      <MapPin size={14} className="mr-1" />
                      {profile.distance}
                    </p>
                    <FameRatingDisplay 
                      rating={profile.fameRating} 
                      size="sm" 
                      showNumber={false}
                    />
                  </div>
                </div>
                
                {showActions && (
                  <div className="relative">
                    <button
                      onClick={() => setShowActionsMenu(!showActionsMenu)}
                      className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {showActionsMenu && (
                      <div className="absolute right-0 bottom-full mb-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                        <button
                          onClick={handleViewProfile}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                        >
                          View Full Profile
                        </button>
                        <button
                          onClick={handleReport}
                          className="w-full px-4 py-2 text-left text-orange-600 hover:bg-orange-50 transition-colors text-sm"
                        >
                          Report as Fake
                        </button>
                        <button
                          onClick={handleBlock}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors text-sm"
                        >
                          Block User
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          {profile.bio && (
            <div className="mb-3">
              <p className="text-gray-600 text-sm">
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
          )}

          {profile.tags && profile.tags.length > 0 && (
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
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <FameRatingDisplay 
                rating={profile.fameRating} 
                showNumber 
                size="sm"
              />
              
              {profile.viewedAt && (
                <span className="text-xs text-gray-500">
                  Viewed {formatLastSeen(profile.viewedAt)}
                </span>
              )}
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                profile.isOnline ? 'bg-green-400' : 'bg-gray-400'
              }`} />
              {profile.isOnline ? 'Online now' : formatLastSeen(profile.lastSeen || '')}
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
            
            {isMatched ? (
              <button
                onClick={() => {}}
                className="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
              >
                <MessageCircle size={20} />
              </button>
            ) : isLiked ? (
              <button
                onClick={handleUnlike}
                className="flex-1 bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center"
              >
                <Heart size={20} className="fill-current" />
              </button>
            ) : (
              <button
                onClick={handleLike}
                className={`flex-1 p-3 rounded-lg transition-colors flex items-center justify-center ${
                  canLike()
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Heart size={20} />
              </button>
            )}
          </div>

          {(isMatched || isLiked || profile.isLiked) && (
            <div className="mt-3 p-3 bg-pink-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-sm">
                {isMatched && (
                  <>
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-green-700 font-medium">
                      You're connected! Start chatting.
                    </span>
                  </>
                )}
                {isLiked && !isMatched && (
                  <>
                    <Heart size={16} className="text-pink-600 fill-current" />
                    <span className="text-pink-700">
                      You liked {profile.name}
                    </span>
                  </>
                )}
                {profile.isLiked && !isMatched && (
                  <>
                    <Heart size={16} className="text-yellow-600" />
                    <span className="text-yellow-700">
                      {profile.name} likes you!
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {!canLike() && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-yellow-800">
                <AlertCircle size={16} />
                <span>Add a profile picture to like other users</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showRequirementModal}
        onClose={() => setShowRequirementModal(false)}
        title="Profile Picture Required"
        size="md"
      >
        <div className="text-center p-4">
          <Camera className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Add a Profile Picture First
          </h3>
          <p className="text-gray-600 mb-6">
            You need to add a profile picture before you can like other users. 
            This helps create a more authentic community where everyone can see who they're connecting with.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setShowRequirementModal(false);
              }}
              className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Add Profile Picture
            </button>
            <button
              onClick={() => setShowRequirementModal(false)}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </Modal>

      <ReportBlockModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        profileId={profile.id}
        profileName={profile.name}
        mode="report"
        onComplete={() => {
          console.log('Profile reported');
        }}
      />

      <ReportBlockModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        profileId={profile.id}
        profileName={profile.name}
        mode="block"
        onComplete={() => {
          console.log('Profile blocked');
          onPass(profile.id);
        }}
      />

      {showActionsMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActionsMenu(false)}
        />
      )}
    </>
  );
};

export default ProfileCard;
