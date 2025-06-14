// src/components/MainApp.tsx
import React, { useState, useEffect } from 'react';
import { Heart, Search, MessageCircle, User } from 'lucide-react';
import BrowsePage from './browse/BrowsePage';
import SearchPage from './search/SearchPage';
import ChatPage from './chat/ChatPage';
import ProfilePage from './profile/ProfilePage';
import * as api from '../utils/api';

interface MainAppProps {
  currentUser: any;
  notifications: any[];
  unreadCount: number;
  onLogout: () => void;
}

const mockProfiles = [
  {
    id: 2,
    name: 'Emma',
    age: 24,
    gender: 'female',
    bio: 'Yoga instructor and mindfulness advocate. Looking for someone who values wellness and personal growth.',
    location: 'Marina Bay, Singapore',
    distance: '2.5km away',
    photos: ['https://picsum.photos/seed/emma1/400/600'],
    tags: ['#yoga', '#wellness', '#meditation', '#nature'],
    fameRating: 4.1,
    isOnline: true,
    lastSeen: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Alex',
    age: 28,
    gender: 'male',
    bio: 'Tech professional by day, foodie by night. Always up for discovering new restaurants and experiences.',
    location: 'Orchard, Singapore',
    distance: '3.2km away',
    photos: ['https://picsum.photos/seed/alex1/400/600'],
    tags: ['#tech', '#foodie', '#travel', '#coffee'],
    fameRating: 4.3,
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 4,
    name: 'Maya',
    age: 26,
    gender: 'female',
    bio: 'Travel blogger who\'s been to 30+ countries. Ready to explore the world with the right person.',
    location: 'Chinatown, Singapore',
    distance: '1.8km away',
    photos: ['https://picsum.photos/seed/maya1/400/600'],
    tags: ['#travel', '#photography', '#adventure', '#writing'],
    fameRating: 4.5,
    isOnline: true,
    lastSeen: new Date().toISOString()
  }
];

const mockChatRooms = [
  {
    id: 1,
    otherUser: {
      id: 2,
      name: 'Emma',
      avatar: 'https://picsum.photos/seed/emma1/100/100',
      isOnline: true,
      lastSeen: new Date().toISOString()
    },
    messages: [
      {
        id: 1,
        senderId: 2,
        receiverId: 1,
        content: 'Hi there! Love your travel photos!',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'read' as const,
        type: 'text' as const
      },
      {
        id: 2,
        senderId: 1,
        receiverId: 2,
        content: 'Thank you! I see you\'re into yoga, that\'s awesome!',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        status: 'read' as const,
        type: 'text' as const
      }
    ],
    lastMessage: {
      id: 2,
      senderId: 1,
      receiverId: 2,
      content: 'Thank you! I see you\'re into yoga, that\'s awesome!',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: 'read' as const,
      type: 'text' as const
    },
    unreadCount: 0,
    isMatched: true,
    matchedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const MainApp: React.FC<MainAppProps> = ({ currentUser, notifications, unreadCount, onLogout }) => {
  const [currentPage, setCurrentPage] = useState<'browse' | 'search' | 'chat' | 'profile'>('browse');
  const [profiles, setProfiles] = useState(mockProfiles);
  const [chatRooms, setChatRooms] = useState(mockChatRooms);
  const [currentChatId, setCurrentChatId] = useState<number>();

  useEffect(() => {
    console.log('Loading data...');
  }, []);

  const handleLike = async (profileId: number) => {
    try {
      console.log('Liked profile:', profileId);
      setProfiles(prev => prev.filter((p: any) => p.id !== profileId));
      
      if (Math.random() > 0.7) {
        alert('🎉 It\'s a match! Start chatting now.');
      }
    } catch (error) {
      console.error('Like failed:', error);
    }
  };

  const handlePass = (profileId: number) => {
    setProfiles(prev => prev.filter((p: any) => p.id !== profileId));
  };

  const handleSearch = async (filters: any) => {
    try {
      console.log('Searching with filters:', filters);
      return mockProfiles.filter(profile => 
        !filters.query || 
        profile.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        profile.bio.toLowerCase().includes(filters.query.toLowerCase()) ||
        profile.tags.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()))
      );
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  };

  const handleSendMessage = async (chatId: number, content: string) => {
    try {
      const newMessage = {
        id: Date.now(),
        senderId: currentUser.id,
        receiverId: chatRooms.find(c => c.id === chatId)?.otherUser.id || 0,
        content,
        timestamp: new Date().toISOString(),
        status: 'sent' as const,
        type: 'text' as const
      };

      setChatRooms(prev => prev.map((chat: any) =>
        chat.id === chatId 
          ? { ...chat, messages: [...chat.messages, newMessage], lastMessage: newMessage } 
          : chat
      ));
    } catch (error) {
      console.error('Send message failed:', error);
    }
  };

  const handleRefreshProfiles = () => {
    setProfiles(mockProfiles);
  };

  const unreadMessages = chatRooms.reduce((total: number, chat: any) => total + chat.unreadCount, 0);

  const navItems = [
    { key: 'browse', icon: Heart, label: 'Browse' },
    { key: 'search', icon: Search, label: 'Search' },
    { key: 'chat', icon: MessageCircle, label: 'Chat', badge: unreadMessages },
    { key: 'profile', icon: User, label: 'Profile' }
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'browse':
        return (
          <BrowsePage
            profiles={profiles}
            onLike={handleLike}
            onPass={handlePass}
            onRefresh={handleRefreshProfiles}
            currentUser={currentUser}
          />
        );
      case 'search':
        return <SearchPage onSearch={handleSearch} currentUser={currentUser} />;
      case 'chat':
        return (
          <ChatPage
            chatRooms={chatRooms}
            currentChatId={currentChatId}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onSelectChat={setCurrentChatId}
            onBack={() => setCurrentChatId(undefined)}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            currentUser={currentUser}
            onLogout={onLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
      
      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center px-4 py-2">
          {navItems.map(({ key, icon: Icon, label, badge }) => (
            <button
              key={key}
              onClick={() => setCurrentPage(key as any)}
              className={`flex flex-col items-center p-2 relative transition-colors ${
                currentPage === key ? 'text-green-500' : 'text-gray-500'
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {badge && badge > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                    {badge > 99 ? '99+' : badge}
                  </div>
                )}
              </div>
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainApp;
