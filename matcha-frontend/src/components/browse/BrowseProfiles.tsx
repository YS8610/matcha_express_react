'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { ProfileShort, SearchFilters } from '@/types';
import ProfileCard from './ProfileCard';
import FilterPanel from './FilterPanel';
import { Alert } from '@/components/ui';
import { Filter, Sparkles, ChevronLeft, ChevronRight, ArrowUp, Users, ChevronDown, ChevronUp, Search, X, ArrowUpDown } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import {
  getBrowseSortPreference,
  setBrowseSortPreference,
  getBrowseItemsPerPagePreference,
  setBrowseItemsPerPagePreference
} from '@/lib/cookiePreferences';
import { calculateDistance } from '@/lib/distance';

const MemoizedProfileCard = memo(ProfileCard);

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  getPageNumbers: () => (number | string)[];
  profilesPerPage: number;
  onItemsPerPageChange: (count: number) => void;
}

function PaginationControls({ currentPage, totalPages, onPageChange, getPageNumbers, profilesPerPage, onItemsPerPageChange }: PaginationControlsProps) {
  return (
    <div className="flex justify-between items-center gap-4 mb-6 flex-wrap">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-green-700 dark:text-green-300">Items per page:</label>
        <select
          value={profilesPerPage}
          onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
          className="px-3 py-1 border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
        >
          <option value={6}>6</option>
          <option value={12}>12</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
        </select>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border)',
              color: 'var(--button-bg)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--input-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--card-bg)'}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-1">
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-green-700 dark:text-green-300">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`px-4 py-2 rounded-full font-medium transition-all border ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md border-green-600'
                      : ''
                  }`}
                  style={currentPage !== page ? {
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border)',
                    color: 'var(--button-bg)'
                  } : undefined}
                  onMouseEnter={(e) => {
                    if (currentPage !== (page as number)) {
                      e.currentTarget.style.backgroundColor = 'var(--input-bg)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== (page as number)) {
                      e.currentTarget.style.backgroundColor = 'var(--card-bg)';
                    }
                  }}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border)',
              color: 'var(--button-bg)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--input-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--card-bg)'}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function BrowseProfiles() {
  const { addToast } = useToast();
  const [allProfiles, setAllProfiles] = useState<ProfileShort[]>([]);
  const [displayedProfiles, setDisplayedProfiles] = useState<ProfileShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [profilesPerPage, setProfilesPerPage] = useState(() => {
    const saved = getBrowseItemsPerPagePreference();
    return saved ?? 12;
  });
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [sortBy, setSortBy] = useState<'age-asc' | 'age-desc' | 'distance-asc' | 'distance-desc' | 'fame-asc' | 'fame-desc' | 'tags-desc'>(() => {
    const saved = getBrowseSortPreference();
    if (saved === 'age-asc' || saved === 'age-desc' || saved === 'distance-asc' || saved === 'distance-desc' || saved === 'fame-asc' || saved === 'fame-desc' || saved === 'tags-desc') {
      return saved;
    }
    return 'distance-asc';
  });
  const [myTags, setMyTags] = useState<string[]>([]);

  const filteredProfiles = useMemo(() => {
    let profiles = allProfiles;

    if (searchName.trim()) {
      const searchLower = searchName.toLowerCase();
      profiles = profiles.filter(profile => {
        const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.toLowerCase();
        const username = (profile.username || '').toLowerCase();
        return fullName.includes(searchLower) || username.includes(searchLower);
      });
    }

    if (filters.interests && filters.interests.trim()) {
      const searchTags = filters.interests
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);

      if (searchTags.length > 0) {
        profiles = profiles.filter(profile => {
          const profileTags = (profile.userTags || []).map(tag => tag.toLowerCase());
          return searchTags.some(searchTag =>
            profileTags.some(profileTag => profileTag.includes(searchTag))
          );
        });
      }
    }

    return profiles;
  }, [allProfiles, searchName, filters.interests]);

  const calculateAge = (birthDate?: string | { year?: number; month?: number; day?: number }): number => {
    if (!birthDate) return 0;

    let year: number;
    let month: number;
    let day: number;

    if (typeof birthDate === 'object') {
      const bd = birthDate as { year?: number; month?: number; day?: number };
      year = Number(bd.year || 0);
      month = Number(bd.month || 1);
      day = Number(bd.day || 1);
    } else {
      const birth = new Date(birthDate);
      year = birth.getFullYear();
      month = birth.getMonth() + 1;
      day = birth.getDate();
    }

    const today = new Date();
    let age = today.getFullYear() - year;
    const monthDiff = today.getMonth() + 1 - month;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
      age--;
    }
    return age;
  };

  const getCommonTagsCount = useCallback((profileTags: string[] = []) => {
    if (!myTags.length || !profileTags.length) return 0;

    const myTagsLower = myTags.map(t => t.toLowerCase());
    const profileTagsLower = profileTags.map(t => t.toLowerCase());

    return profileTagsLower.filter(tag => myTagsLower.includes(tag)).length;
  }, [myTags]);

  const sortedProfiles = useMemo(() => {
    const profiles = [...filteredProfiles];

    switch (sortBy) {
      case 'age-asc':
        return profiles.sort((a, b) => calculateAge(a.birthDate) - calculateAge(b.birthDate));
      case 'age-desc':
        return profiles.sort((a, b) => calculateAge(b.birthDate) - calculateAge(a.birthDate));
      case 'distance-asc':
        return profiles.sort((a, b) => {
          const distA = a.distance !== undefined ? a.distance : Infinity;
          const distB = b.distance !== undefined ? b.distance : Infinity;
          return distA - distB;
        });
      case 'distance-desc':
        return profiles.sort((a, b) => {
          const distA = a.distance !== undefined ? a.distance : 0;
          const distB = b.distance !== undefined ? b.distance : 0;
          return distB - distA;
        });
      case 'fame-asc':
        return profiles.sort((a, b) => (a.fameRating || 0) - (b.fameRating || 0));
      case 'fame-desc':
        return profiles.sort((a, b) => (b.fameRating || 0) - (a.fameRating || 0));
      case 'tags-desc':
        return profiles.sort((a, b) => {
          const aCommonTags = getCommonTagsCount(a.userTags);
          const bCommonTags = getCommonTagsCount(b.userTags);
          return bCommonTags - aCommonTags;
        });
      default:
        return profiles;
    }
  }, [filteredProfiles, sortBy, getCommonTagsCount]);

  const totalPages = Math.ceil(sortedProfiles.length / profilesPerPage);

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const requestFilters: Record<string, number> = {
        skip: 0,
        limit: 1000,
      };

      if (filters.ageMin !== undefined) requestFilters.minAge = filters.ageMin;
      if (filters.ageMax !== undefined) requestFilters.maxAge = filters.ageMax;
      if (filters.distanceMax !== undefined) requestFilters.distancekm = filters.distanceMax * 1000;
      if (filters.fameMin !== undefined) requestFilters.minFameRating = filters.fameMin;
      if (filters.fameMax !== undefined) requestFilters.maxFameRating = filters.fameMax;

      const response = await api.getFilteredProfiles(requestFilters);

      let profiles = Array.isArray(response) ? response : Array.isArray(response.data) ? response.data : response.data ? [response.data] : [];

      try {
        const currentUserProfile = await api.getProfile();
        const userProfile = currentUserProfile.data as any;

        if (userProfile?.latitude !== undefined && userProfile?.longitude !== undefined) {
          profiles = profiles.map((profile: ProfileShort) => {
            if (profile.latitude !== undefined && profile.longitude !== undefined) {
              const distance = calculateDistance(
                userProfile.latitude,
                userProfile.longitude,
                profile.latitude,
                profile.longitude
              );
              return { ...profile, distance };
            }
            return profile;
          });
        }
      } catch (distanceError) {
        console.error('Failed to calculate distances:', distanceError);
      }

      setAllProfiles(profiles as ProfileShort[]);
      setTotalProfiles(profiles.length);
      setCurrentPage(1);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load profiles';
      setError(errorMsg);
      addToast(errorMsg, 'error', 4000);
      setAllProfiles([]);
      setTotalProfiles(0);
    } finally {
      setLoading(false);
    }
  }, [filters, addToast]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMyTags = async () => {
      try {
        const response = await api.getUserTags() as { tags?: string[] };
        setMyTags(response.tags || []);
      } catch (error) {
        console.error('Failed to fetch user tags:', error);
        setMyTags([]);
      }
    };

    fetchMyTags();
  }, []);

  useEffect(() => {
    const startIdx = (currentPage - 1) * profilesPerPage;
    const endIdx = startIdx + profilesPerPage;
    setDisplayedProfiles(sortedProfiles.slice(startIdx, endIdx));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [sortedProfiles, currentPage, profilesPerPage]);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
    setCurrentPage(1);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="max-w-7xl mx-auto p-6 relative">
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-4 flex-col sm:flex-row w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">Discover Your Match</h1>
          </div>
          {!loading && allProfiles.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950 px-3 py-1 rounded-full">
              <Users className="w-4 h-4" />
              <span>{sortedProfiles.length}/{allProfiles.length} profiles</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 w-full lg:w-auto flex-wrap">
          <div className="flex-1 min-w-[200px] max-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600 dark:text-green-400" />
            <input
              type="text"
              placeholder="Search by name or username..."
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-10 py-2 border border-green-300 dark:border-green-700 rounded-full bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors w-full"
            />
            {searchName && (
              <button
                onClick={() => {
                  setSearchName('');
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="relative min-w-[180px]">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600 dark:text-green-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => {
                const newSort = e.target.value as typeof sortBy;
                setSortBy(newSort);
                setBrowseSortPreference(newSort);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-green-300 dark:border-green-700 rounded-full bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none cursor-pointer w-full"
            >
              <option value="distance-asc">Distance (Near to Far)</option>
              <option value="distance-desc">Distance (Far to Near)</option>
              <option value="tags-desc">Common Interests</option>
              <option value="fame-desc">Fame (High to Low)</option>
              <option value="fame-asc">Fame (Low to High)</option>
              <option value="age-asc">Age (Young to Old)</option>
              <option value="age-desc">Age (Old to Young)</option>
            </select>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full hover:from-green-700 hover:to-green-600 font-medium transition-all transform hover:scale-105 shadow-md flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters ? (
              <ChevronUp className="w-4 h-4 transition-transform" />
            ) : (
              <ChevronDown className="w-4 h-4 transition-transform" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        </div>
      )}

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
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 dark:border-green-400 border-t-transparent"></div>
          <p className="mt-4 text-green-700 dark:text-green-300">Brewing your perfect matches...</p>
        </div>
      ) : allProfiles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-green-700 dark:text-green-300 text-lg">No profiles found</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">Try adjusting your filters to find your perfect blend</p>
        </div>
      ) : sortedProfiles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-green-700 dark:text-green-300 text-lg">No profiles match your search</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">Try searching with different keywords</p>
          <button
            onClick={() => setSearchName('')}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              getPageNumbers={getPageNumbers}
              profilesPerPage={profilesPerPage}
              onItemsPerPageChange={(count) => {
                setProfilesPerPage(count);
                setBrowseItemsPerPagePreference(count);
                setCurrentPage(1);
              }}
            />
          )}

          <div className="mb-4 text-sm text-green-700 dark:text-green-300">
            Showing {((currentPage - 1) * profilesPerPage) + 1}-{Math.min(currentPage * profilesPerPage, sortedProfiles.length)} of {sortedProfiles.length} profiles
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8">
            {displayedProfiles.map((profile, index) => (
              <MemoizedProfileCard key={`${profile.id}-${index}`} profile={profile} priority={index === 0} />
            ))}
          </div>

          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              getPageNumbers={getPageNumbers}
              profilesPerPage={profilesPerPage}
              onItemsPerPageChange={(count) => {
                setProfilesPerPage(count);
                setBrowseItemsPerPagePreference(count);
                setCurrentPage(1);
              }}
            />
          )}
        </>
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full shadow-lg hover:from-green-700 hover:to-green-600 transition-all transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
