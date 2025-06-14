// src/components/notifications/NotificationCenter.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Heart, Eye, MessageCircle, X, Check, Users, HeartCrack } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationItem {
  id: number;
  type: 'like' | 'match' | 'message' | 'profile_view' | 'unlike';
  fromUserId: number;
  fromUser: {
    id: number;
    name: string;
    avatar: string;
  };
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
  priority: 'low' | 'normal' | 'high';
}

interface NotificationCenterProps {
  userId: number;
  onNotificationClick?: (notification: NotificationItem) => void;
  showToasts?: boolean;
  maxToasts?: number;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  userId,
  onNotificationClick,
  showToasts = true,
  maxToasts = 3
}) => {
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead
  } = useNotifications(userId);

  const [isOpen, setIsOpen] = useState(false);
  const [toastNotifications, setToastNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'likes' | 'messages' | 'views'>('all');

  useEffect(() => {
    if (!showToasts) return;

    const newNotifications = notifications
      .filter(n => !n.isRead && !toastNotifications.some(t => t.id === n.id))
      .slice(0, maxToasts);

    if (newNotifications.length > 0) {
      setToastNotifications(prev => [
        ...newNotifications.map(n => ({ ...n, priority: getNotificationPriority(n.type) } as NotificationItem)),
        ...prev
      ].slice(0, maxToasts));
    }
  }, [notifications, showToasts, maxToasts, toastNotifications]);

  useEffect(() => {
    toastNotifications.forEach(notification => {
      const delay = notification.priority === 'high' ? 8000 : 
                    notification.priority === 'normal' ? 6000 : 4000;
      
      setTimeout(() => {
        removeToast(notification.id);
      }, delay);
    });
  }, [toastNotifications]);

  const getNotificationPriority = (type: string): 'low' | 'normal' | 'high' => {
    switch (type) {
      case 'match':
        return 'high';
      case 'message':
        return 'high';
      case 'like':
        return 'normal';
      case 'unlike':
        return 'normal';
      case 'profile_view':
        return 'low';
      default:
        return 'normal';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="text-pink-500" size={20} />;
      case 'match':
        return <Users className="text-green-500" size={20} />;
      case 'message':
        return <MessageCircle className="text-blue-500" size={20} />;
      case 'profile_view':
        return <Eye className="text-purple-500" size={20} />;
      case 'unlike':
        return <HeartCrack className="text-red-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like':
        return 'border-l-pink-500 bg-pink-50';
      case 'match':
        return 'border-l-green-500 bg-green-50';
      case 'message':
        return 'border-l-blue-500 bg-blue-50';
      case 'profile_view':
        return 'border-l-purple-500 bg-purple-50';
      case 'unlike':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatNotificationTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    
    setIsOpen(false);
  };

  const removeToast = (notificationId: number) => {
    setToastNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getFilteredNotifications = () => {
    return notifications.filter(notification => {
      switch (filter) {
        case 'unread':
          return !notification.isRead;
        case 'likes':
          return ['like', 'match'].includes(notification.type);
        case 'messages':
          return notification.type === 'message';
        case 'views':
          return notification.type === 'profile_view';
        default:
          return true;
      }
    });
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-2 rounded-full transition-colors ${
            unreadCount > 0 
              ? 'text-pink-500 bg-pink-50 hover:bg-pink-100' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          <Bell size={20} className={unreadCount > 0 ? 'animate-pulse' : ''} />
          
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          
          {!isConnected && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>

        {/* Notification Panel */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 max-w-sm bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-pink-500 hover:text-pink-600"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              {/* Connection Status */}
              <div className="flex items-center space-x-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-xs text-gray-500">
                  {isConnected ? 'Real-time notifications active' : 'Connection interrupted'}
                </span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 p-2 border-b border-gray-200">
              {[
                { key: 'all', label: 'All', count: notifications.length },
                { key: 'unread', label: 'Unread', count: unreadCount },
                { key: 'likes', label: 'Likes', count: notifications.filter(n => ['like', 'match'].includes(n.type)).length },
                { key: 'messages', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
                { key: 'views', label: 'Views', count: notifications.filter(n => n.type === 'profile_view').length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === tab.key
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label} {tab.count > 0 && `(${tab.count})`}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                  <p className="text-sm">We'll notify you when something happens!</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={notification.fromUser.avatar}
                        alt={notification.fromUser.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {getNotificationIcon(notification.type)}
                          <span className="font-medium text-gray-800 text-sm truncate">
                            {notification.title}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <span className="text-xs text-gray-400 mt-1">
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      {showToasts && (
        <div className="fixed top-4 right-4 space-y-2 z-50">
          {toastNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-sm transform transition-all duration-300 ${getNotificationColor(notification.type)}`}
              style={{ animation: 'slideInRight 0.3s ease-out' }}
            >
              <div className="flex items-start space-x-3">
                <img
                  src={notification.fromUser.avatar}
                  alt={notification.fromUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {getNotificationIcon(notification.type)}
                    <span className="font-medium text-gray-800 text-sm">
                      {notification.title}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
                
                <button
                  onClick={() => removeToast(notification.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export const useRealtimeNotifications = (userId: number) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const playNotificationSound = useCallback((type: string) => {
    if ('Audio' in window) {
      try {
        const audio = new Audio(`/sounds/${type}.mp3`);
        audio.volume = 0.3;
        audio.play().catch(console.warn);
      } catch (error) {
        console.warn('Could not play notification sound:', error);
      }
    }
  }, []);

  const showDesktopNotification = useCallback((notification: NotificationItem) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const desktopNotif = new Notification(notification.title, {
        body: notification.message,
        icon: notification.fromUser.avatar,
        tag: `notification-${notification.id}`,
        requireInteraction: notification.priority === 'high',
        silent: false
      });

      desktopNotif.onclick = () => {
        window.focus();
        desktopNotif.close();
      };

      setTimeout(() => desktopNotif.close(), 8000);
    }
  }, []);

  const addNotification = useCallback((notification: NotificationItem) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    playNotificationSound(notification.type);
    showDesktopNotification(notification);
  }, [playNotificationSound, showDesktopNotification]);

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/notifications?userId=${userId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('📡 Notification WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'notification') {
          const delay = Math.random() * 10000;
          
          setTimeout(() => {
            addNotification({
              ...data.notification,
              priority: getNotificationPriority(data.notification.type)
            });
          }, delay);
        }
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('📡 Notification WebSocket disconnected');
      
      setTimeout(() => {
        if (document.visibilityState === 'visible') {
        }
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('Notification WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [userId, addNotification]);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead
  };
};
