'use client';

import { useState } from 'react';
import { SearchFilters } from '@/types';

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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Age Range</label>
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
              className="w-20 px-2 py-1 border rounded"
            />
            <span>-</span>
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
              className="w-20 px-2 py-1 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Distance (km)</label>
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
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Fame Rating</label>
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
              className="w-20 px-2 py-1 border rounded"
            />
            <span>-</span>
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
              className="w-20 px-2 py-1 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sort By</label>
          <select
            value={localFilters.sortBy || 'distance'}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              sortBy: e.target.value as any
            })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="age">Age</option>
            <option value="distance">Distance</option>
            <option value="fame">Fame Rating</option>
            <option value="commonTags">Common Interests</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Order</label>
          <select
            value={localFilters.order || 'asc'}
            onChange={(e) => setLocalFilters({
              ...localFilters,
              order: e.target.value as any
            })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={() => setLocalFilters({})}
            className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}