'use client';

import { useState } from 'react';
import { SearchFilters } from '@/types';
import { X, Calendar, MapPin, Star, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onClose: () => void;
}

export default function FilterPanel({ filters, onFilterChange, onClose }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 border border-green-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-green-800 flex items-center gap-2">
          <Filter className="w-5 h-5 text-green-600" />
          Filter Your Matches
        </h2>
        <button
          onClick={onClose}
          className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-green-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Age Range
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="18"
              max="120"
              value={localFilters.ageMin || ''}
              onChange={(e) => setLocalFilters({
                ...localFilters,
                ageMin: e.target.value ? parseInt(e.target.value) : undefined
              })}
              placeholder="Min"
              className="w-20 px-2 py-1 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
            <span className="text-green-600">-</span>
            <input
              type="number"
              min="18"
              max="120"
              value={localFilters.ageMax || ''}
              onChange={(e) => setLocalFilters({
                ...localFilters,
                ageMax: e.target.value ? parseInt(e.target.value) : undefined
              })}
              placeholder="Max"
              className="w-20 px-2 py-1 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-green-700 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Distance (km)
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={localFilters.distanceMax || ''}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              distanceMax: e.target.value ? parseInt(e.target.value) : undefined
            })}
            placeholder="Maximum distance"
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-green-700 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Fame Rating
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              max="100"
              value={localFilters.fameMin || ''}
              onChange={(e) => setLocalFilters({
                ...localFilters,
                fameMin: e.target.value ? parseInt(e.target.value) : undefined
              })}
              placeholder="Min"
              className="w-20 px-2 py-1 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
            <span className="text-green-600">-</span>
            <input
              type="number"
              min="0"
              max="100"
              value={localFilters.fameMax || ''}
              onChange={(e) => setLocalFilters({
                ...localFilters,
                fameMax: e.target.value ? parseInt(e.target.value) : undefined
              })}
              placeholder="Max"
              className="w-20 px-2 py-1 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-green-700 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Sort By
          </label>
          <select
            value={localFilters.sortBy || 'distance'}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              sortBy: e.target.value as 'age' | 'distance' | 'fame' | 'commonTags'
            })}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          >
            <option value="age">Age</option>
            <option value="distance">Distance</option>
            <option value="fame">Fame Rating</option>
            <option value="commonTags">Common Interests</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-green-700">Order</label>
          <select
            value={localFilters.order || 'asc'}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              order: e.target.value as 'asc' | 'desc'
            })}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={() => setLocalFilters({})}
            className="flex-1 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 font-medium transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full hover:from-green-700 hover:to-green-600 font-medium transition-all transform hover:scale-105 shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}