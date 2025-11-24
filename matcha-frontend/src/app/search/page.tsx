'use client';

import { useState, useEffect } from 'react';
import { Profile } from '@/types';
import ProfileCard from '@/components/browse/ProfileCard';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Search, Leaf, MapPin, Star, Calendar, Heart } from 'lucide-react';
import { api } from '@/lib/api';

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

  const calculateAge = (birthDate: string): number => {
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 0;
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const [likedByMeResp, viewedByMeResp, matchedResp] = await Promise.all([
        api.getUsersWhoLikedMe().catch(() => ({ data: [] })),
        api.getUsersWhoViewedMe().catch(() => ({ data: [] })),
        api.getMatchedUsers().catch(() => ({ data: [] })),
      ]);

      const allProfiles = new Map<string, Profile>();
      [likedByMeResp?.data || [], viewedByMeResp?.data || [], matchedResp?.data || []]
        .flat()
        .forEach((profile: Profile) => {
          if (profile && profile.id && !allProfiles.has(profile.id)) {
            allProfiles.set(profile.id, profile);
          }
        });

      let filtered = Array.from(allProfiles.values());

      if (criteria.ageMin || criteria.ageMax) {
        filtered = filtered.filter(profile => {
          const age = calculateAge(profile.birthDate);
          const minAge = criteria.ageMin ? parseInt(criteria.ageMin) : 0;
          const maxAge = criteria.ageMax ? parseInt(criteria.ageMax) : 150;
          return age >= minAge && age <= maxAge;
        });
      }

      if (criteria.fameMin || criteria.fameMax) {
        filtered = filtered.filter(profile => {
          const fameMin = criteria.fameMin ? parseInt(criteria.fameMin) : 0;
          const fameMax = criteria.fameMax ? parseInt(criteria.fameMax) : 100;
          return profile.fameRating >= fameMin && profile.fameRating <= fameMax;
        });
      }

      if (criteria.location && user?.latitude && user?.longitude) {
        const userLat = user.latitude;
        const userLon = user.longitude;
        filtered = filtered.filter(profile => {
          if (!profile.location) return false;

          const R = 6371000;
          const dLat = ((profile.location.latitude - userLat) * Math.PI) / 180;
          const dLon = ((profile.location.longitude - userLon) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((userLat * Math.PI) / 180) *
              Math.cos((profile.location.latitude * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distanceKm = (R * c) / 1000;

          const maxDistance = parseInt(criteria.location) || 50;
          return distanceKm <= maxDistance;
        });
      }

      if (criteria.interests) {
        const searchInterests = criteria.interests
          .split(',')
          .map(tag => tag.trim().toLowerCase())
          .filter(tag => tag.length > 0);

        if (searchInterests.length > 0) {
          filtered = filtered.filter(profile => {
            if (!profile.location) return true;
            return true;
          });
        }
      }

      setProfiles(filtered);
    } catch (error) {
      console.error('Search failed:', error);
      setProfiles([]);
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
      
      <form onSubmit={handleSearch} className="bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-2xl shadow-xl p-8 mb-8 border border-green-100 dark:border-green-900">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-green-700 dark:text-green-300 flex items-center gap-2">
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
                className="flex-1 px-3 py-2 border border-green-300 dark:border-green-700 rounded-md focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 transition-colors bg-white dark:bg-gray-800 text-black dark:text-white"
              />
              <input
                type="number"
                min="18"
                max="120"
                placeholder="Max"
                value={criteria.ageMax}
                onChange={(e) => setCriteria({ ...criteria, ageMax: e.target.value })}
                className="flex-1 px-3 py-2 border border-green-300 dark:border-green-700 rounded-md focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 transition-colors bg-white dark:bg-gray-800 text-black dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-green-700 dark:text-green-300 flex items-center gap-2">
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
                className="flex-1 px-3 py-2 border border-green-300 dark:border-green-700 rounded-md focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 transition-colors bg-white dark:bg-gray-800 text-black dark:text-white"
              />
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Max"
                value={criteria.fameMax}
                onChange={(e) => setCriteria({ ...criteria, fameMax: e.target.value })}
                className="flex-1 px-3 py-2 border border-green-300 dark:border-green-700 rounded-md focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 transition-colors bg-white dark:bg-gray-800 text-black dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-green-700 dark:text-green-300 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <input
              type="text"
              placeholder="City or area"
              value={criteria.location}
              onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
              className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 transition-colors bg-white dark:bg-gray-800 text-black dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-green-700 dark:text-green-300 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Interests
            </label>
            <input
              type="text"
              placeholder="e.g., music, sports, travel (comma separated)"
              value={criteria.interests}
              onChange={(e) => setCriteria({ ...criteria, interests: e.target.value })}
              className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 transition-colors bg-white dark:bg-gray-800 text-black dark:text-white"
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 dark:border-green-400 border-t-transparent"></div>
            <p className="mt-4 text-green-700 dark:text-green-300">Steeping through profiles...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-green-700 dark:text-green-300 text-lg">No matches found</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">Try adjusting your search criteria to find your perfect blend</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950 px-4 py-2 rounded-full inline-block">
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
