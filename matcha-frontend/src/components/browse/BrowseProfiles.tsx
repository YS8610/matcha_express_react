'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProfileShort, SearchFilters } from '@/types';
import ProfileCard from './ProfileCard';
import FilterPanel from './FilterPanel';
import { Filter, Sparkles, ChevronLeft, ChevronRight, ArrowUp, Users } from 'lucide-react';
import { api } from '@/lib/api';

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
  const [allProfiles, setAllProfiles] = useState<ProfileShort[]>([]);
  const [displayedProfiles, setDisplayedProfiles] = useState<ProfileShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [profilesPerPage, setProfilesPerPage] = useState(12);

  const totalPages = Math.ceil(totalProfiles / profilesPerPage);

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const requestFilters: any = {
        skip: 0,
        limit: 1000,
      };

      if (filters.ageMin !== undefined) requestFilters.minAge = filters.ageMin;
      if (filters.ageMax !== undefined) requestFilters.maxAge = filters.ageMax;
      if (filters.distanceMax !== undefined) requestFilters.distancekm = filters.distanceMax;
      if (filters.fameMin !== undefined) requestFilters.minFameRating = filters.fameMin;
      if (filters.fameMax !== undefined) requestFilters.maxFameRating = filters.fameMax;

      const response = await api.getFilteredProfiles(requestFilters);

      const profiles = Array.isArray(response) ? response : response.data || [];
      setAllProfiles(profiles);
      setTotalProfiles(profiles.length);
      setCurrentPage(1);
    } catch (error) {
      console.error('Failed to load profiles:', error);
      setAllProfiles([]);
      setTotalProfiles(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

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
    const startIdx = (currentPage - 1) * profilesPerPage;
    const endIdx = startIdx + profilesPerPage;
    setDisplayedProfiles(allProfiles.slice(startIdx, endIdx));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [allProfiles, currentPage, profilesPerPage]);

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

  const getPageNumbers = () => {
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
  };

  return (
    <div className="max-w-7xl mx-auto p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">Discover Your Match</h1>
          </div>
          {!loading && allProfiles.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950 px-3 py-1 rounded-full">
              <Users className="w-4 h-4" />
              <span>{allProfiles.length} profiles</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full hover:from-green-700 hover:to-green-600 font-medium transition-all transform hover:scale-105 shadow-md flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
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
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 dark:border-green-400 border-t-transparent"></div>
          <p className="mt-4 text-green-700 dark:text-green-300">Brewing your perfect matches...</p>
        </div>
      ) : allProfiles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-green-700 dark:text-green-300 text-lg">No profiles found</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">Try adjusting your filters to find your perfect blend</p>
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
                setCurrentPage(1);
              }}
            />
          )}

          <div className="mb-4 text-sm text-green-700 dark:text-green-300">
            Showing {((currentPage - 1) * profilesPerPage) + 1}-{Math.min(currentPage * profilesPerPage, allProfiles.length)} of {allProfiles.length} profiles
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8">
            {displayedProfiles.map((profile, index) => (
              <ProfileCard key={`${profile.id}-${index}`} profile={profile} />
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
