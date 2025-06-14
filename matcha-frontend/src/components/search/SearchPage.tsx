// src/components/search/SearchPage.tsx
import React, { useState } from 'react';
import { Search, MapPin, Star } from 'lucide-react';

interface SearchPageProps {
  onSearch: (filters: any) => Promise<any[]>;
  currentUser: any;
}

const SearchPage: React.FC<SearchPageProps> = ({ onSearch, currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const searchResults = await onSearch({ query: searchQuery });
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold mb-4">Search</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by interests, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No results found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {results.map((profile) => (
              <div key={profile.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={profile.photos[0]} alt={profile.name} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <h3 className="font-semibold text-sm">{profile.name}, {profile.age}</h3>
                  <div className="flex items-center text-xs text-gray-600 mt-1">
                    <MapPin size={12} className="mr-1" />
                    {profile.distance}
                  </div>
                  <div className="flex items-center mt-2">
                    <Star size={12} className="text-yellow-400 fill-current" />
                    <span className="text-xs ml-1">{profile.fameRating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
