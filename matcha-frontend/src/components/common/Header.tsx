// src/components/common/Header.tsx
import React from 'react';
import { Bell, ArrowLeft, MoreVertical } from 'lucide-react';
import NotificationBadge from '../navigation/NotificationBadge';
import { User } from '../types/user';

interface HeaderProps {
  title: string;
  currentUser?: User;
  showNotifications?: boolean;
  notificationCount?: number;
  showBack?: boolean;
  onBack?: () => void;
  onNotificationClick?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  currentUser,
  showNotifications = true,
  notificationCount = 0,
  showBack = false,
  onBack,
  onNotificationClick,
  rightAction,
  className = ''
}) => {
  const handleNotificationClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    } else {
      console.log('Show notifications');
    }
  };

  return (
    <div className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {showBack && (
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            
            <div>
              <h1 className="text-xl font-bold text-gray-800">{title}</h1>
              {currentUser && (
                <p className="text-sm text-gray-500">
                  Welcome back, {currentUser.firstName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {rightAction ? (
              rightAction
            ) : (
              <>
                {showNotifications && (
                  <NotificationBadge
                    count={notificationCount}
                    onClick={handleNotificationClick}
                  />
                )}
                
                {currentUser && (
                  <div className="flex items-center space-x-3">
                    <button className="text-gray-600 hover:text-gray-800 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                    
                    <div className="relative">
                      <img
                        src={currentUser.photos?.[0] || '/default-avatar.png'}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      />
                      {currentUser.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
};

export default Header;
