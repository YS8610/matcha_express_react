// src/components/profile/ProfilePage.tsx
import React from 'react';
import { Edit, Eye, Heart, MessageCircle, MapPin, Star, LogOut, Settings, Info } from 'lucide-react';

interface ProfilePageProps {
  currentUser: any;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onLogout }) => {
  const stats = [
    { icon: Heart, value: 12, label: 'Matches', color: 'text-green-500' },
    { icon: Eye, value: 85, label: 'Views', color: 'text-blue-500' },
    { icon: MessageCircle, value: 24, label: 'Messages', color: 'text-purple-500' },
    { icon: Star, value: currentUser.fameRating, label: 'Rating', color: 'text-yellow-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <img
              src={currentUser.photos[0]}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
            />
            <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-3 border-white ${
              currentUser.isOnline ? 'bg-green-300' : 'bg-gray-400'
            }`} />
          </div>
          
          <h2 className="text-2xl font-bold">{currentUser.name}</h2>
          <p className="text-green-100">{currentUser.age} years old</p>
          
          <div className="flex items-center justify-center mt-2 text-green-100">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">{currentUser.location}</span>
          </div>

          <div className="flex items-center justify-center mt-2">
            <Star className="text-yellow-300 fill-current" size={16} />
            <span className="ml-1 text-sm font-medium">{currentUser.fameRating}</span>
          </div>
        </div>
      </div>

      <div className="p-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="bg-white rounded-lg p-4 text-center shadow-sm">
              <Icon size={24} className={`mx-auto mb-2 ${color}`} />
              <div className="text-2xl font-bold text-gray-800">{value}</div>
              <div className="text-sm text-gray-600">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="font-semibold mb-3 text-gray-800">About</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">{currentUser.bio}</p>
          
          <h3 className="font-semibold mb-3 text-gray-800">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.tags.map((tag: string, index: number) => (
              <span key={index} className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full bg-white rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-green-50 transition-all text-left flex items-center space-x-3">
            <Edit size={20} className="text-green-600" />
            <div>
              <div className="font-medium text-gray-800">Edit Profile</div>
              <div className="text-sm text-gray-500">Update your photos and information</div>
            </div>
          </button>

          <button className="w-full bg-white rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-blue-50 transition-all text-left flex items-center space-x-3">
            <Eye size={20} className="text-blue-600" />
            <div>
              <div className="font-medium text-gray-800">Who Viewed Me</div>
              <div className="text-sm text-gray-500">See who's been checking you out</div>
            </div>
          </button>

          <button className="w-full bg-white rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-purple-50 transition-all text-left flex items-center space-x-3">
            <Heart size={20} className="text-purple-600" />
            <div>
              <div className="font-medium text-gray-800">Likes & Matches</div>
              <div className="text-sm text-gray-500">See who liked your profile</div>
            </div>
          </button>

          <button className="w-full bg-white rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-left flex items-center space-x-3">
            <Settings size={20} className="text-gray-600" />
            <div>
              <div className="font-medium text-gray-800">Settings</div>
              <div className="text-sm text-gray-500">Privacy, notifications, and preferences</div>
            </div>
          </button>

          <button className="w-full bg-white rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-left flex items-center space-x-3">
            <Info size={20} className="text-gray-600" />
            <div>
              <div className="font-medium text-gray-800">Help & Support</div>
              <div className="text-sm text-gray-500">FAQs, contact us, and community guidelines</div>
            </div>
          </button>

          <button
            onClick={onLogout}
            className="w-full bg-white rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-red-50 transition-all text-left flex items-center space-x-3"
          >
            <LogOut size={20} className="text-red-500" />
            <div>
              <div className="font-medium text-red-600">Sign Out</div>
              <div className="text-sm text-gray-500">Sign out of your account</div>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">Web Matcha v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">Find your perfect blend ☕️</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
