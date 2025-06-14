// src/components/search/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Grid, List } from 'lucide-react';
import Header from '../common/Header';
import SearchFilters from './SearchFilters';
import { Profile, SearchFilters as ISearchFilters } from '../types/profile';

interface SearchPageProps {
  onSearch: (filters: ISearchFilters) => Promise<Profile[]>;
  onViewProfile: (profileId: number) => void;
  currentUser: any;
}

const SearchPage: React.FC<SearchPageProps> = ({ 
  onSearch, 
  onViewProfile, 
  currentUser 
}) => {
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'age' | 'rating' | 'recent'>('distance');
  
  const [filters, setFilters] = useState<ISearchFilters>({
    ageMin: 18,
    ageMax: 50,
    maxDistance: 25,
    minRating: 0,
    tags: [],
    location: ''
  });

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const results = await onSearch({
        ...filters,
        query: searchQuery
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: ISearchFilters) => {
    setFilters(newFilters);
    handleSearch();
  };

  const sortResults = (results: Profile[]) => {
    return [...results].sort((a, b) => {
      switch (sortBy) {
        case 'age':
          return a.age - b.age;
        case 'rating':
          return b.fameRating - a.fameRating;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'recent':
          return a.isOnline ? -1 : 1;
        default:
          return 0;
      }
    });
  };

  const sortedResults = sortResults(searchResults);

  const ProfileGridItem: React.FC<{ profile: Profile }> = ({ profile }) => (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onViewProfile(profile.id)}
    >
      <div className="relative">
        <img 
          src={profile.photos[0]} 
          alt={profile.name} 
          className="w-full h-32 object-cover" 
        />
        <div className={`absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-white ${
          profile.isOnline ? 'bg-green-400' : 'bg-gray-400'
        }`} />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm">{profile.name}, {profile.age}</h3>
        <p className="text-xs text-gray-600 flex items-center mt-1">
          <MapPin size={12} className="mr-1" />
          {profile.distance}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <Star size={12} className="text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600 ml-1">{profile.fameRating}</span>
          </div>
          <div className="text-xs text-gray-500">
            {profile.tags.length} tags
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileListItem: React.FC<{ profile: Profile }> = ({ profile }) => (
    <div 
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onViewProfile(profile.id)}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img 
            src={profile.photos[0]} 
            alt={profile.name} 
            className="w-16 h-16 rounded-full object-cover" 
          />
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
            profile.isOnline ? 'bg-green-400' : 'bg-gray-400'
          }`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{profile.name}, {profile.age}</h3>
          <p className="text-sm text-gray-600 flex items-center">
            <MapPin size={14} className="mr-1" />
            {profile.distance}
          </p>
          <div className="flex items-center mt-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">{profile.fameRating}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">
            {profile.tags.slice(0, 2).map(tag => tag).join(', ')}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {profile.isOnline ? 'Online' : profile.lastSeen}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Search" currentUser={currentUser} />
      
      <div className="bg-white p-4 shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by interests, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-500"
            >
              <Filter size={18} />
              <span className="text-sm">Filters</span>
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="distance">Distance</option>
              <option value="age">Age</option>
              <option value="rating">Rating</option>
              <option value="recent">Recently Active</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-pink-100 text-pink-600' : 'text-gray-600'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-pink-100 text-pink-600' : 'text-gray-600'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <SearchFilters
          filters={filters}
          onFiltersChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      )}

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
          </h2>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="text-pink-500 hover:text-pink-600 text-sm disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Refresh'}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
          </div>
        ) : sortedResults.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No profiles match your search criteria.</p>
            <button
              onClick={() => {
                setFilters({
                  ageMin: 18,
                  ageMax: 50,
                  maxDistance: 25,
                  minRating: 0,
                  tags: [],
                  location: ''
                });
                setSearchQuery('');
                handleSearch();
              }}
              className="text-pink-500 hover:text-pink-600 mt-2"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 gap-4' 
            : 'space-y-4'
          }>
            {sortedResults.map((profile) => (
              viewMode === 'grid' 
                ? <ProfileGridItem key={profile.id} profile={profile} />
                : <ProfileListItem key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
