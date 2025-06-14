// src/components/search/SearchFilters.tsx
import React, { useState } from 'react';
import { X, MapPin, Star, Tag } from 'lucide-react';
import { SearchFilters as ISearchFilters } from '../../types/types';

interface SearchFiltersProps {
  filters: ISearchFilters;
  onFiltersChange: (filters: ISearchFilters) => void;
  onClose: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose
}) => {
  const [localFilters, setLocalFilters] = useState<ISearchFilters>(filters);

  const handleFilterChange = (key: keyof ISearchFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: ISearchFilters = {
      ageMin: 18,
      ageMax: 50,
      maxDistance: 25,
      minRating: 0,
      tags: [],
      location: ''
    };
    setLocalFilters(resetFilters);
  };

  const handleTagInput = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    handleFilterChange('tags', tags);
  };

  const popularTags = [
    '#hiking', '#travel', '#foodie', '#music', '#fitness', '#art',
    '#photography', '#books', '#gaming', '#yoga', '#coffee', '#movies'
  ];

  const addTag = (tag: string) => {
    if (!localFilters.tags.includes(tag)) {
      handleFilterChange('tags', [...localFilters.tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleFilterChange('tags', localFilters.tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="bg-white border-b shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Search Filters</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Age Range: {localFilters.ageMin} - {localFilters.ageMax}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min Age</label>
              <input
                type="range"
                min="18"
                max="80"
                value={localFilters.ageMin}
                onChange={(e) => handleFilterChange('ageMin', parseInt(e.target.value))}
                className="w-full accent-pink-500"
              />
              <span className="text-sm text-gray-600">{localFilters.ageMin}</span>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max Age</label>
              <input
                type="range"
                min="18"
                max="80"
                value={localFilters.ageMax}
                onChange={(e) => handleFilterChange('ageMax', parseInt(e.target.value))}
                className="w-full accent-pink-500"
              />
              <span className="text-sm text-gray-600">{localFilters.ageMax}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <MapPin size={16} className="mr-2" />
            Maximum Distance: {localFilters.maxDistance} km
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={localFilters.maxDistance}
            onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
            className="w-full accent-pink-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 km</span>
            <span>100 km</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Star size={16} className="mr-2" />
            Minimum Fame Rating: {localFilters.minRating.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={localFilters.minRating}
            onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
            className="w-full accent-pink-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.0</span>
            <span>5.0</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="Enter city or area"
            value={localFilters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Tag size={16} className="mr-2" />
            Interest Tags
          </label>
          
          {localFilters.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {localFilters.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-pink-400 hover:text-pink-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <input
            type="text"
            placeholder="Enter tags separated by commas"
            value={localFilters.tags.join(', ')}
            onChange={(e) => handleTagInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-3"
          />

          <div>
            <p className="text-xs text-gray-500 mb-2">Popular tags:</p>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  disabled={localFilters.tags.includes(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    localFilters.tags.includes(tag)
                      ? 'bg-pink-100 text-pink-600 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleResetFilters}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex-1 bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
