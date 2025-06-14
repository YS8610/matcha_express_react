// src/components/navigation/Navigation.tsx
import React from 'react';
import { Heart, Search, MessageCircle, User } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  unreadMessages?: number;
  className?: string;
}

interface NavItem {
  key: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onPageChange,
  unreadMessages = 0,
  className = ''
}) => {
  const navItems: NavItem[] = [
    {
      key: 'browse',
      icon: Heart,
      label: 'Browse'
    },
    {
      key: 'search',
      icon: Search,
      label: 'Search'
    },
    {
      key: 'chat',
      icon: MessageCircle,
      label: 'Chat',
      badge: unreadMessages > 0 ? unreadMessages : undefined
    },
    {
      key: 'profile',
      icon: User,
      label: 'Profile'
    }
  ];

  const handleNavigation = (pageKey: string) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    onPageChange(pageKey);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 ${className}`}>
      <div className="px-4 py-2 pb-safe">
        <div className="flex justify-around items-center">
          {navItems.map(({ key, icon: Icon, label, badge }) => (
            <button
              key={key}
              onClick={() => handleNavigation(key)}
              className={`flex flex-col items-center p-2 min-w-0 relative transition-colors ${
                currentPage === key 
                  ? 'text-pink-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label={label}
            >
              <div className="relative">
                <Icon 
                  size={20} 
                  className={`transition-transform ${
                    currentPage === key ? 'scale-110' : 'scale-100'
                  }`}
                />
                
                {badge && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                    {badge > 99 ? '99+' : badge}
                  </div>
                )}
              </div>
              
              <span className={`text-xs mt-1 transition-colors ${
                currentPage === key ? 'font-medium' : 'font-normal'
              }`}>
                {label}
              </span>
              
              {currentPage === key && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center pb-1">
        <div className="w-32 h-1 bg-gray-300 rounded-full opacity-60" />
      </div>
    </div>
  );
};

export default Navigation;
