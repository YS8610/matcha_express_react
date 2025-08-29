'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Profile } from '@/types';
import ProfileCard from '@/components/browse/ProfileCard';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SearchPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  
  const [criteria, setCriteria] = useState({
    ageMin: '',
    ageMax: '',
    fameMin: '',
    fameMax: '',
    location: '',
    interests: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    const searchCriteria: any = {};
    if (criteria.ageMin) searchCriteria.ageMin = parseInt(criteria.ageMin);
    if (criteria.ageMax) searchCriteria.ageMax = parseInt(criteria.ageMax);
    if (criteria.fameMin) searchCriteria.fameMin = parseInt(criteria.fameMin);
    if (criteria.fameMax) searchCriteria.fameMax = parseInt(criteria.fameMax);
    if (criteria.location) searchCriteria.location = criteria.location;
    if (criteria.interests) {
      searchCriteria.interests = criteria.interests.split(',').map(i => i.trim());
    }

    try {
      const data = await api.search(searchCriteria);
      setProfiles(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Advanced Search</h1>
      
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Age Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="18"
                max="120"
                placeholder="Min"
                value={criteria.ageMin}
                onChange={(e) => setCriteria({ ...criteria, ageMin: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <input
                type="number"
                min="18"
                max="120"
                placeholder="Max"
                value={criteria.ageMax}
                onChange={(e) => setCriteria({ ...criteria, ageMax: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fame Rating</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Min"
                value={criteria.fameMin}
                onChange={(e) => setCriteria({ ...criteria, fameMin: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Max"
                value={criteria.fameMax}
                onChange={(e) => setCriteria({ ...criteria, fameMax: e.target.value })}
                className="flex-1 px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              placeholder="City or area"
              value={criteria.location}
              onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Interests</label>
            <input
              type="text"
              placeholder="e.g., music, sports, travel (comma separated)"
              value={criteria.interests}
              onChange={(e) => setCriteria({ ...criteria, interests: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searched && (
        loading ? (
          <div className="text-center py-12">Searching...</div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No profiles found</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )
      )}
    </div>
  );
}