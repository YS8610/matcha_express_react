'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Heart, Eye, MessageCircle, UserX, AlertCircle } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useToast } from '@/contexts/ToastContext';
import { Notification } from '@/types';
import { api } from '@/lib/api';
import { getLastSeenString } from '@/lib/neo4j-utils';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'like':
      return <Heart className="w-5 h-5 text-red-500" />;
    case 'view':
      return <Eye className="w-5 h-5 text-blue-500" />;
    case 'message':
      return <MessageCircle className="w-5 h-5 text-green-500" />;
    case 'match':
      return <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />;
    case 'unlike':
      return <UserX className="w-5 h-5 text-gray-500" />;
    default:
      return <Bell className="w-5 h-5 text-gray-500" />;
  }
};

export default function NotificationCenter() {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { notifications: wsNotifications, isConnected, markNotificationRead, clearNotifications } = useWebSocket();
  const [apiNotifications, setApiNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seenNotificationIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getNotifications(20, 0);
      const notifications = Array.isArray(response.data) ? response.data : response.data && typeof response.data === 'object' ? Object.values(response.data) : [];
      setApiNotifications(notifications as Notification[]);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load notifications';
      setError(errorMsg);
      addToast(errorMsg, 'error', 3000);
    } finally {
      setLoading(false);
    }
  };

  const allNotifications = (() => {
    const seenIds = new Set<string>();
    const deduplicated: Notification[] = [];

    for (const notif of wsNotifications) {
      if (!seenIds.has(notif.id)) {
        seenIds.add(notif.id);
        deduplicated.push(notif);
      }
    }

    for (const notif of apiNotifications) {
      if (!seenIds.has(notif.id)) {
        seenIds.add(notif.id);
        deduplicated.push(notif);
      }
    }

    for (const id of seenIds) {
      seenNotificationIds.add(id);
    }

    return deduplicated.sort((a, b) => {
      const timeA = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt).getTime();
      const timeB = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt).getTime();
      return timeB - timeA;
    });
  })();

  const unreadCount = allNotifications.filter(n => !n.read).length;

  const handleNotificationClick = async (notification: Notification) => {
    try {
      await api.markNotificationAsRead(notification.id);
      markNotificationRead(notification.id);
      setApiNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
    } catch (error) {
      const errorMsg = 'Failed to mark notification as read';
      addToast(errorMsg, 'error', 3000);
    }
  };

  const handleDeleteNotification = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setError('');
      await api.deleteNotification(notificationId);
      setApiNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete notification';
      setError(errorMsg);
      addToast(errorMsg, 'error', 3000);
    }
  };

  const handleClearAll = async () => {
    try {
      setError('');
      for (const notification of apiNotifications) {
        await api.deleteNotification(notification.id);
      }
      setApiNotifications([]);
      clearNotifications();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to clear notifications';
      setError(errorMsg);
      addToast(errorMsg, 'error', 3000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {isConnected && (
          <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-lg shadow-2xl z-50 border border-gray-200 dark:border-slate-700 max-h-[600px] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                {!isConnected && (
                  <span className="text-xs text-red-500 dark:text-red-400 font-medium">Disconnected</span>
                )}
              </div>
              {allNotifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
                <button
                  onClick={() => setError('')}
                  className="text-red-600 dark:text-red-400 hover:opacity-70 transition-opacity flex-shrink-0"
                  aria-label="Close error"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-200 mx-auto"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading notifications...</p>
                </div>
              ) : allNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-slate-700">
                  {allNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {getLastSeenString(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                            </div>
                          )}
                          <button
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                            className="text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            title="Delete notification"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
