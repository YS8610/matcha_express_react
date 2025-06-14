// src/components/WebMatchaApp.tsx
'use client';

import React, { useState, useEffect } from 'react';
import MainApp from './MainApp';

const mockUser = {
  id: 1,
  username: 'demo_user',
  email: 'demo@webmatcha.com',
  firstName: 'Demo',
  lastName: 'User',
  name: 'Demo User',
  age: 25,
  gender: 'non-binary',
  sexualPreference: 'both',
  bio: 'Love exploring new places and trying different cuisines. Looking for someone to share adventures with!',
  location: 'Singapore',
  latitude: 1.3521,
  longitude: 103.8198,
  photos: [
    'https://picsum.photos/seed/demo1/400/600',
    'https://picsum.photos/seed/demo2/400/600'
  ],
  tags: ['#travel', '#foodie', '#adventure', '#coffee'],
  fameRating: 4.2,
  isOnline: true,
  lastSeen: new Date().toISOString(),
  emailVerified: true,
  profileComplete: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const WebMatchaApp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user] = useState(mockUser);
  const [notifications] = useState([]);
  const [unreadCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="w-12 h-12 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Web Matcha</h1>
          <p className="text-green-100 mb-4">Find your perfect blend</p>
          <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <MainApp
      currentUser={user}
      notifications={notifications}
      unreadCount={unreadCount}
      onLogout={handleLogout}
    />
  );
};

export default WebMatchaApp;
