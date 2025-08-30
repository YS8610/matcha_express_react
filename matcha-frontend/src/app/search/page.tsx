'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Profile } from '@/types';
import ProfileCard from '@/components/browse/ProfileCard';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Search, Leaf, MapPin, Star, Calendar, Heart } from 'lucide-react';

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
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-full">
          <Search className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">Find Your Perfect Matcha</h1>
      </div>
      
      <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 mb-8 border border-green-100">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-green-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Age Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="18"
                max="120"
                placeholder="Min"
                value={criteria.ageMin}
                onChange={(e) => setCriteria({ ...criteria, ageMin: e.target.value })}
                className="flex-1 px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
              <input
                type="number"
                min="18"
                max="120"
                placeholder="Max"
                value={criteria.ageMax}
                onChange={(e) => setCriteria({ ...criteria, ageMax: e.target.value })}
                className="flex-1 px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-green-700 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Fame Rating
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Min"
                value={criteria.fameMin}
                onChange={(e) => setCriteria({ ...criteria, fameMin: e.target.value })}
                className="flex-1 px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Max"
                value={criteria.fameMax}
                onChange={(e) => setCriteria({ ...criteria, fameMax: e.target.value })}
                className="flex-1 px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-green-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <input
              type="text"
              placeholder="City or area"
              value={criteria.location}
              onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-green-700 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Interests
            </label>
            <input
              type="text"
              placeholder="e.g., music, sports, travel (comma separated)"
              value={criteria.interests}
              onChange={(e) => setCriteria({ ...criteria, interests: e.target.value })}
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-full hover:from-green-700 hover:to-green-600 disabled:opacity-50 font-medium transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Brewing Results...
            </>
          ) : (
            <>
              <Leaf className="w-5 h-5" />
              Search Profiles
            </>
          )}
        </button>
      </form>

      {searched && (
        loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-4 text-green-700">Steeping through profiles...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-green-700 text-lg">No matches found</p>
            <p className="text-sm text-green-600 mt-2">Try adjusting your search criteria to find your perfect blend</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full inline-block">
              Found {profiles.length} perfect matches
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {profiles.map(profile => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
}