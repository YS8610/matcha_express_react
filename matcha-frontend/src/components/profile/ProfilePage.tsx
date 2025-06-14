// src/components/profile/ProfilePage.tsx
import React, { useState } from 'react';
import { Settings, Edit, Eye, Heart, MessageCircle, MapPin, Camera, Star, Shield, LogOut } from 'lucide-react';
import Header from '../common/Header';
import { User } from '../types/user';

interface ProfilePageProps {
  currentUser: User;
  onEditProfile: () => void;
  onViewVisitors: () => void;
  onViewLikes: () => void;
  onSettings: () => void;
  onLogout: () => void;
  profileStats: {
    totalMatches: number;
    profileViews: number;
    likesReceived: number;
    messagesCount: number;
  };
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onEditProfile,
  onViewVisitors,
  onViewLikes,
  onSettings,
  onLogout,
  profileStats
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'activity'>('overview');

  const menuItems = [
    {
      icon: Edit,
      label: 'Edit Profile',
      action: onEditProfile,
      description: 'Update your photos and information'
    },
    {
      icon: Eye,
      label: 'Who Viewed Me',
      action: onViewVisitors,
      description: `${profileStats.profileViews} recent views`,
      badge: profileStats.profileViews > 0 ? profileStats.profileViews : undefined
    },
    {
      icon: Heart,
      label: 'Who Liked Me',
      action: onViewLikes,
      description: `${profileStats.likesReceived} likes`,
      badge: profileStats.likesReceived > 0 ? profileStats.likesReceived : undefined
    },
    {
      icon: Settings,
      label: 'Settings',
      action: onSettings,
      description: 'Privacy, notifications, account'
    },
    {
      icon: Shield,
      label: 'Safety & Support',
      action: () => console.log('Safety'),
      description: 'Report, block, safety tips'
    },
    {
      icon: LogOut,
      label: 'Sign Out',
      action: onLogout,
      description: 'Sign out of your account',
      isDestructive: true
    }
  ];

  const StatCard: React.FC<{ icon: React.ElementType; value: number; label: string; color: string }> = ({ 
    icon: Icon, value, label, color 
  }) => (
    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
      <Icon size={24} className={`mx-auto mb-2 ${color}`} />
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );

  const PhotoGrid: React.FC = () => (
    <div className="grid grid-cols-3 gap-2">
      {currentUser.photos.map((photo, index) => (
        <div key={index} className="relative aspect-square">
          <img
            src={photo}
            alt={`Profile photo ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
          {index === 0 && (
            <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded">
              Main
            </div>
          )}
        </div>
      ))}
      {currentUser.photos.length < 5 && (
        <button
          onClick={onEditProfile}
          className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-pink-300 transition-colors"
        >
          <div className="text-center">
            <Camera size={24} className="mx-auto text-gray-400 mb-1" />
            <div className="text-xs text-gray-500">Add Photo</div>
          </div>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header 
        title="Profile" 
        currentUser={currentUser}
        rightAction={
          <button onClick={onSettings} className="text-gray-600">
            <Settings size={24} />
          </button>
        }
      />

      <div className="p-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={currentUser.photos[0]}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <div className={`absolute bottom-4 right-0 w-6 h-6 rounded-full border-3 border-white ${
                currentUser.isOnline ? 'bg-green-400' : 'bg-gray-400'
              }`} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800">{currentUser.name}</h2>
            <p className="text-gray-600">{currentUser.age} years old</p>
            
            <div className="flex items-center justify-center mt-2 text-gray-600">
              <MapPin size={16} className="mr-1" />
              <span className="text-sm">{currentUser.location}</span>
            </div>

            <div className="flex items-center justify-center mt-2">
              <Star className="text-yellow-400 fill-current" size={16} />
              <span className="ml-1 text-sm font-medium">{currentUser.fameRating}</span>
              <span className="ml-1 text-sm text-gray-500">fame rating</span>
            </div>

            <button
              onClick={onEditProfile}
              className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            icon={Heart}
            value={profileStats.totalMatches}
            label="Matches"
            color="text-pink-500"
          />
          <StatCard
            icon={Eye}
            value={profileStats.profileViews}
            label="Profile Views"
            color="text-blue-500"
          />
          <StatCard
            icon={MessageCircle}
            value={profileStats.messagesCount}
            label="Messages"
            color="text-green-500"
          />
          <StatCard
            icon={Star}
            value={Math.round(currentUser.fameRating * 10) / 10}
            label="Rating"
            color="text-yellow-500"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'photos', label: 'Photos' },
              { key: 'activity', label: 'Activity' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === tab.key
                    ? 'text-pink-500 border-b-2 border-pink-500'
                    : 'text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeTab === 'overview' && (
              <div>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-600">{currentUser.bio}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'photos' && <PhotoGrid />}

            {activeTab === 'activity' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Last active</span>
                  <span className="text-sm text-gray-500">
                    {currentUser.isOnline ? 'Online now' : currentUser.lastSeen}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Profile completion</span>
                  <span className="text-sm text-green-600">95%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Member since</span>
                  <span className="text-sm text-gray-500">January 2024</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className={`w-full bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left ${
                item.isDestructive ? 'hover:bg-red-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon 
                  size={20} 
                  className={item.isDestructive ? 'text-red-500' : 'text-gray-600'} 
                />
                <div className="flex-1">
                  <div className={`font-medium ${item.isDestructive ? 'text-red-600' : 'text-gray-800'}`}>
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
                {item.badge && (
                  <div className="bg-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
