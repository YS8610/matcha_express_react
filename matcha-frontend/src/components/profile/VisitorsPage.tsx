// src/components/profile/VisitorsPage.tsx
import React, { useState, useEffect } from 'react';
import { Eye, ArrowLeft, Clock, MapPin } from 'lucide-react';
import { Profile } from '../../types/types';
import { FameRatingDisplay } from '../common/FameRatingDisplay';
import * as api from '../../utils/api';

interface VisitorsPageProps {
  onBack: () => void;
  onViewProfile: (profileId: number) => void;
}

interface ProfileVisitor extends Profile {
  visitedAt: string;
  viewCount: number;
}

export const VisitorsPage: React.FC<VisitorsPageProps> = ({ onBack, onViewProfile }) => {
  const [visitors, setVisitors] = useState<ProfileVisitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    loadVisitors();
  }, []);

  const loadVisitors = async () => {
    try {
      setIsLoading(true);
      const visitorsData = await api.getProfileVisitors();
      setVisitors(visitorsData);
    } catch (error) {
      console.error('Failed to load visitors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredVisitors = () => {
    const now = new Date();
    return visitors.filter(visitor => {
      const visitDate = new Date(visitor.visitedAt);
      const diffDays = Math.floor((now.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));

      switch (filter) {
        case 'today':
          return diffDays === 0;
        case 'week':
          return diffDays <= 7;
        case 'month':
          return diffDays <= 30;
        default:
          return true;
      }
    });
  };

  const formatVisitTime = (visitedAt: string): string => {
    const date = new Date(visitedAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) { 
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredVisitors = getFilteredVisitors();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Profile Visitors</h1>
            <p className="text-sm text-gray-600">{visitors.length} total visits</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="p-4 border-b">
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All Time' },
                { key: 'today', label: 'Today' },
                { key: 'week', label: 'This Week' },
                { key: 'month', label: 'This Month' }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { 
                  label: 'Total Visits', 
                  value: visitors.length,
                  icon: Eye,
                  color: 'text-blue-600'
                },
                { 
                  label: 'Unique Visitors', 
                  value: new Set(visitors.map(v => v.id)).size,
                  icon: Eye,
                  color: 'text-green-600'
                },
                { 
                  label: 'This Week', 
                  value: visitors.filter(v => {
                    const diffDays = Math.floor((new Date().getTime() - new Date(v.visitedAt).getTime()) / (1000 * 60 * 60 * 24));
                    return diffDays <= 7;
                  }).length,
                  icon: Clock,
                  color: 'text-purple-600'
                }
              ].map((stat, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredVisitors.length === 0 ? (
          <div className="text-center py-12">
            <Eye size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No visitors yet</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'Your profile hasn\'t been viewed yet. Keep improving your profile!' 
                : `No visitors found for ${filter === 'today' ? 'today' : filter === 'week' ? 'this week' : 'this month'}`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredVisitors.map((visitor, index) => (
              <div
                key={`${visitor.id}-${index}`}
                onClick={() => onViewProfile(visitor.id)}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={visitor.photos[0]}
                      alt={visitor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {visitor.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">
                        {visitor.name}, {visitor.age}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatVisitTime(visitor.visitedAt)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={14} className="mr-1" />
                        {visitor.distance}
                      </div>
                      
                      <FameRatingDisplay rating={visitor.fameRating} size="sm" />
                      
                      {visitor.viewCount > 1 && (
                        <span className="text-sm text-pink-600 bg-pink-100 px-2 py-1 rounded-full">
                          {visitor.viewCount} visits
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {visitor.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {visitor.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{visitor.tags.length - 3} more
                        </span>
                      )}
                    </div>
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
