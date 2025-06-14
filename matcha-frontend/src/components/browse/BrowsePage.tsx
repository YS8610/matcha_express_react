// src/components/browse/BrowsePage.tsx
import React, { useState, useEffect } from 'react';
import { Shuffle, Filter, Heart, X } from 'lucide-react';
import ProfileCard from './ProfileCard';
import Header from '../common/Header';
import { Profile } from '../types/profile';

interface BrowsePageProps {
  profiles: Profile[];
  onLike: (profileId: number) => void;
  onPass: (profileId: number) => void;
  onRefresh: () => void;
  onViewProfile?: (profileId: number) => void;
  currentUser: any;
}

const BrowsePage: React.FC<BrowsePageProps> = ({
  profiles,
  onLike,
  onPass,
  onRefresh,
  onViewProfile,
  currentUser
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const currentProfile = profiles[currentIndex];

  useEffect(() => {
    const preloadImages = () => {
      for (let i = currentIndex + 1; i < Math.min(currentIndex + 3, profiles.length); i++) {
        const img = new Image();
        img.src = profiles[i]?.photos[0];
      }
    };
    
    if (profiles.length > 0) {
      preloadImages();
    }
  }, [currentIndex, profiles]);

  const moveToNext = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleRefresh();
    }
    setSwipeDirection(null);
  };

  const handleLike = async (profileId: number) => {
    setSwipeDirection('right');
    setIsLoading(true);
    
    try {
      await onLike(profileId);
      setTimeout(moveToNext, 300); 
    } catch (error) {
      console.error('Like failed:', error);
      setSwipeDirection(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePass = async (profileId: number) => {
    setSwipeDirection('left');
    setIsLoading(true);
    
    try {
      await onPass(profileId);
      setTimeout(moveToNext, 300); 
    } catch (error) {
      console.error('Pass failed:', error);
      setSwipeDirection(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await onRefresh();
      setCurrentIndex(0);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (isLoading || !currentProfile) return;
    
    if (e.key === 'ArrowLeft' || e.key === 'x') {
      handlePass(currentProfile.id);
    } else if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      handleLike(currentProfile.id);
    }
  };

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="Discover" currentUser={currentUser} />
        <div className="flex flex-col items-center justify-center p-8 mt-20">
          <div className="text-center">
            <Heart size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No more profiles</h3>
            <p className="text-gray-500 mb-6">Check back later for new matches!</p>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50 pb-20 focus:outline-none" 
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      <Header title="Discover" currentUser={currentUser} />
      
      <div className="bg-white p-4 shadow-sm border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-500"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
            
            <div className="text-sm text-gray-500">
              {currentIndex + 1} of {profiles.length}
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 disabled:opacity-50"
          >
            <Shuffle size={20} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white border-b p-4">
          <div className="grid grid-cols-2 gap-4">
            <select className="p-2 border rounded-lg text-sm">
              <option>Age: Any</option>
              <option>18-25</option>
              <option>26-35</option>
              <option>36+</option>
            </select>
            <select className="p-2 border rounded-lg text-sm">
              <option>Distance: Any</option>
              <option>Under 5km</option>
              <option>Under 10km</option>
              <option>Under 25km</option>
            </select>
          </div>
        </div>
      )}

      <div className="p-4">
        {currentProfile && (
          <div className={`transition-transform duration-300 ${
            swipeDirection === 'left' ? '-translate-x-full opacity-0' :
            swipeDirection === 'right' ? 'translate-x-full opacity-0' : ''
          }`}>
            <ProfileCard
              profile={currentProfile}
              onLike={handleLike}
              onPass={handlePass}
              onViewProfile={onViewProfile}
            />
          </div>
        )}
      </div>

      <div className="fixed bottom-24 left-4 right-4">
        <div className="bg-black/70 text-white text-xs p-2 rounded-lg text-center">
          <p>Use ← or X to pass, → or Space to like</p>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4">
            <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowsePage;
