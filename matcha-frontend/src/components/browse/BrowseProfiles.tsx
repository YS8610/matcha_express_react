'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Profile, SearchFilters } from '@/types';
import ProfileCard from './ProfileCard';
import FilterPanel from './FilterPanel';

export default function BrowseProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'distance',
    order: 'asc',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, [filters]);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const data = await api.getSuggestions(filters);
      
      // Ensure unique profiles by ID
      const uniqueProfiles = data.filter((profile: Profile, index: number, self: Profile[]) =>
        index === self.findIndex((p) => p.id === profile.id)
      );
      
      if (data.length !== uniqueProfiles.length) {
        console.warn(`Removed ${data.length - uniqueProfiles.length} duplicate profiles`);
      }
      
      setProfiles(uniqueProfiles);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Discover</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="mb-6">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading profiles...</div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No profiles found</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profiles.map((profile, index) => (
            <ProfileCard key={`${profile.id}-${index}`} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}