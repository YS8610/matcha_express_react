// src/components/browse/BrowsePage.tsx
import React, { useState } from 'react';
import { Heart, X, MapPin, Star, Shuffle, Filter } from 'lucide-react';

interface BrowsePageProps {
  profiles: any[];
  onLike: (id: number) => void;
  onPass: (id: number) => void;
  onRefresh: () => void;
  currentUser: any;
}

const BrowsePage: React.FC<BrowsePageProps> = ({ profiles, onLike, onPass, onRefresh, currentUser }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const currentProfile = profiles[currentIndex];

  const handleAction = (action: 'like' | 'pass') => {
    if (!currentProfile) return;
    
    if (action === 'like') {
      onLike(currentProfile.id);
    } else {
      onPass(currentProfile.id);
    }
    
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onRefresh();
      setCurrentIndex(0);
    }
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <Heart size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No more profiles</h3>
          <p className="text-gray-500 mb-6">Check back later for more matches!</p>
          <button
            onClick={onRefresh}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 shadow-sm border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">Discover</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="text-gray-600 hover:text-green-500 transition-colors"
          >
            <Filter size={20} />
          </button>
          <button 
            onClick={onRefresh}
            className="text-gray-600 hover:text-green-500 transition-colors"
          >
            <Shuffle size={20} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto">
          <div className="relative">
            <img
              src={currentProfile.photos[0]}
              alt={currentProfile.name}
              className="w-full h-96 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="text-white">
                <h3 className="text-xl font-bold">{currentProfile.name}, {currentProfile.age}</h3>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="flex items-center opacity-90 text-sm">
                    <MapPin size={14} className="mr-1" />
                    {currentProfile.distance}
                  </p>
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm ml-1">{currentProfile.fameRating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            {currentProfile.bio && (
              <p className="text-gray-600 text-sm mb-3">{currentProfile.bio}</p>
            )}

            {currentProfile.tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {currentProfile.tags.slice(0, 4).map((tag: string, index: number) => (
                  <span key={index} className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => handleAction('pass')}
                className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <X size={20} />
              </button>
              <button
                onClick={() => handleAction('like')}
                className="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
              >
                <Heart size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-gray-500 text-sm">
          {currentIndex + 1} of {profiles.length} profiles
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;
