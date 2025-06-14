// src/components/navigation/NotificationBadge.tsx
import React from 'react';
import { Bell, BellRing } from 'lucide-react';

interface NotificationBadgeProps {
  count: number;
  onClick?: () => void;
  showPulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  onClick,
  showPulse = true,
  size = 'md',
  className = ''
}) => {
  const hasNotifications = count > 0;

  const sizeClasses = {
    sm: {
      icon: 18,
      badge: 'w-4 h-4 text-xs',
      container: 'p-1'
    },
    md: {
      icon: 20,
      badge: 'w-5 h-5 text-xs',
      container: 'p-2'
    },
    lg: {
      icon: 24,
      badge: 'w-6 h-6 text-sm',
      container: 'p-3'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <button
      onClick={onClick}
      className={`relative ${currentSize.container} text-gray-600 hover:text-pink-500 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-full ${className}`}
      aria-label={`Notifications${hasNotifications ? ` (${count} unread)` : ''}`}
    >
      <div className="relative">
        {hasNotifications ? (
          <BellRing 
            size={currentSize.icon} 
            className={`${showPulse ? 'animate-pulse' : ''} text-pink-500`}
          />
        ) : (
          <Bell size={currentSize.icon} />
        )}
        
        {hasNotifications && (
          <div className={`absolute -top-1 -right-1 ${currentSize.badge} bg-red-500 text-white rounded-full flex items-center justify-center font-medium min-w-5`}>
            <span className="leading-none">
              {count > 99 ? '99+' : count}
            </span>
          </div>
        )}
        
        {hasNotifications && showPulse && (
          <div className="absolute -top-1 -right-1 w-3 h-3">
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75" />
          </div>
        )}
      </div>
    </button>
  );
};

export default NotificationBadge;
