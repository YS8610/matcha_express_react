'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Notification } from '@/types';
import { Heart, Eye, MessageCircle, Sparkles, HeartCrack, Bell } from 'lucide-react';

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.notifications?.filter((n: Notification) => !n.read).length || 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.markNotificationRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-green-500 fill-green-500" />;
      case 'view': return <Eye className="w-5 h-5 text-green-600" />;
      case 'message': return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'match': return <Sparkles className="w-5 h-5 text-green-400" />;
      case 'unlike': return <HeartCrack className="w-5 h-5 text-green-700" />;
      default: return <Bell className="w-5 h-5 text-green-600" />;
    }
  };

  return (
    <div className="relative z-[9999]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-green-600 hover:text-green-800 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-green-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-green-100 max-h-96 overflow-y-auto z-[9999]">
          <div className="p-4 border-b border-green-200 bg-gradient-to-r from-green-50 to-green-100/50">
            <h3 className="font-semibold text-green-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-green-600" />
              Notifications
            </h3>
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-green-600">
              <Bell className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
              No notifications yet
            </div>
          ) : (
            <div className="divide-y divide-green-100">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-green-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-green-50/50' : ''
                  }`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm text-green-800">{notification.message}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1 animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
