// src/components/WebMatchaApp.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';

import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import ProfileSetup from './auth/ProfileSetup';
import BrowsePage from './browse/BrowsePage';
import SearchPage from './search/SearchPage';
import ChatPage from './chat/ChatPage';
import ProfilePage from './profile/ProfilePage';
import Navigation from './navigation/Navigation';
import Modal from './common/Modal';

import { Profile, SearchFilters, ChatRoom } from '../types/types';

import * as api from '../utils/api';

type AppPage = 'browse' | 'search' | 'chat' | 'profile';
type AuthPage = 'login' | 'register' | 'setup';

interface AppState {
  currentPage: AppPage;
  profiles: Profile[];
  chatRooms: ChatRoom[];
  currentChatId?: number;
  selectedProfile?: Profile;
  showProfileModal: boolean;
}

const WebMatchaApp: React.FC = () => {
  const { 
    user, 
    isAuthenticated, 
    isProfileComplete, 
    isLoading: authLoading,
    login,
    register,
    completeProfile,
    logout
  } = useAuth();

  const { 
    notifications, 
    unreadCount 
  } = useNotifications(user?.id);

  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [authError, setAuthError] = useState('');

  const [appState, setAppState] = useState<AppState>({
    currentPage: 'browse',
    profiles: [],
    chatRooms: [],
    showProfileModal: false
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isProfileComplete) {
      loadInitialData();
    }
  }, [isAuthenticated, isProfileComplete]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [profiles, chatRooms] = await Promise.all([
        api.getProfiles(),
        api.getChatRooms()
      ]);
      
      setAppState(prev => ({
        ...prev,
        profiles,
        chatRooms
      }));
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      setAuthError('');
      await login(credentials);
    } catch (error) {
      setAuthError('Invalid username or password');
      throw error;
    }
  };

  const handleRegister = async (data: any) => {
    try {
      setAuthError('');
      await register(data);
    } catch (error) {
      setAuthError('Registration failed. Please try again.');
      throw error;
    }
  };

  const handleCompleteProfile = async (data: any) => {
    try {
      setAuthError('');
      await completeProfile(data);
    } catch (error) {
      setAuthError('Failed to complete profile. Please try again.');
      throw error;
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  const handlePageChange = (page: AppPage) => {
    setAppState(prev => ({ ...prev, currentPage: page }));
  };

  const handleLikeProfile = async (profileId: number) => {
    try {
      const result = await api.likeProfile(profileId);
      
      setAppState(prev => ({
        ...prev,
        profiles: prev.profiles.filter(p => p.id !== profileId)
      }));

      if (result.matched) {
        console.log('It\'s a match!');
      }
    } catch (error) {
      console.error('Failed to like profile:', error);
    }
  };

  const handlePassProfile = async (profileId: number) => {
    setAppState(prev => ({
      ...prev,
      profiles: prev.profiles.filter(p => p.id !== profileId)
    }));
  };

  const handleRefreshProfiles = async () => {
    try {
      const profiles = await api.getProfiles();
      setAppState(prev => ({ ...prev, profiles }));
    } catch (error) {
      console.error('Failed to refresh profiles:', error);
    }
  };

  const handleSearch = async (filters: SearchFilters): Promise<Profile[]> => {
    try {
      const results = await api.getProfiles(filters);
      return results;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  };

  const handleViewProfile = (profileId: number) => {
    const profile = appState.profiles.find(p => p.id === profileId);
    if (profile) {
      setAppState(prev => ({
        ...prev,
        selectedProfile: profile,
        showProfileModal: true
      }));
    }
  };

  const handleSendMessage = async (chatId: number, content: string) => {
    try {
      const message = await api.sendMessage(chatId, content);
      
      setAppState(prev => ({
        ...prev,
        chatRooms: prev.chatRooms.map(chat =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, message],
                lastMessage: message
              }
            : chat
        )
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const handleSelectChat = (chatId: number) => {
    setAppState(prev => ({ ...prev, currentChatId: chatId }));
  };

  const handleBackFromChat = () => {
    setAppState(prev => ({ ...prev, currentChatId: undefined }));
  };

  const handleEditProfile = () => {
    console.log('Edit profile');
  };

  const handleViewVisitors = () => {
    console.log('View visitors');
  };

  const handleViewLikes = () => {
    console.log('View likes');
  };

  const handleSettings = () => {
    console.log('Settings');
  };

  const unreadMessages = appState.chatRooms.reduce(
    (total, chat) => total + chat.unreadCount, 
    0
  );

  const profileStats = {
    totalMatches: appState.chatRooms.length,
    profileViews: 42,
    likesReceived: 28,
    messagesCount: appState.chatRooms.reduce(
      (total, chat) => total + chat.messages.length, 
      0
    )
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authPage === 'login') {
      return (
        <LoginPage
          onLogin={handleLogin}
          onShowRegister={() => setAuthPage('register')}
          onForgotPassword={handleForgotPassword}
        />
      );
    }

    if (authPage === 'register') {
      return (
        <RegisterPage
          onRegister={handleRegister}
          onShowLogin={() => setAuthPage('login')}
        />
      );
    }
  }

  if (isAuthenticated && !isProfileComplete) {
    return (
      <ProfileSetup
        onComplete={handleCompleteProfile}
      />
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (appState.currentPage) {
      case 'browse':
        return (
          <BrowsePage
            profiles={appState.profiles}
            onLike={handleLikeProfile}
            onPass={handlePassProfile}
            onRefresh={handleRefreshProfiles}
            onViewProfile={handleViewProfile}
            currentUser={user}
          />
        );

      case 'search':
        return (
          <SearchPage
            onSearch={handleSearch}
            onViewProfile={handleViewProfile}
            currentUser={user}
          />
        );

      case 'chat':
        return (
          <ChatPage
            chatRooms={appState.chatRooms}
            currentChatId={appState.currentChatId}
            currentUser={user}
            onSendMessage={handleSendMessage}
            onSelectChat={handleSelectChat}
            onBack={handleBackFromChat}
          />
        );

      case 'profile':
        return (
          <ProfilePage
            currentUser={user}
            onEditProfile={handleEditProfile}
            onViewVisitors={handleViewVisitors}
            onViewLikes={handleViewLikes}
            onSettings={handleSettings}
            onLogout={logout}
            profileStats={profileStats}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentPage()}
      
      <Navigation
        currentPage={appState.currentPage}
        onPageChange={handlePageChange}
        unreadMessages={unreadMessages}
      />

      <Modal
        isOpen={appState.showProfileModal}
        onClose={() => setAppState(prev => ({ ...prev, showProfileModal: false }))}
        title="Profile Details"
        size="lg"
      >
        {appState.selectedProfile && (
          <div className="space-y-4">
            <div className="text-center">
              <img
                src={appState.selectedProfile.photos[0]}
                alt={appState.selectedProfile.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-2xl font-bold">{appState.selectedProfile.name}</h2>
              <p className="text-gray-600">{appState.selectedProfile.age} years old</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-gray-600">{appState.selectedProfile.bio}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {appState.selectedProfile.tags.map((tag, index) => (
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
      </Modal>

      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4">
            <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebMatchaApp;
