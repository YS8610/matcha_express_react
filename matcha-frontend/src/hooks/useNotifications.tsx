// src/hooks/useNotifications.tsx
import { useState, useEffect, useCallback } from 'react';
import { Notification } from '../types/types';
import * as api from '../utils/api';
import { NOTIFICATION_TYPES, REAL_TIME_DELAY_MAX } from '../utils/constants';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export const useNotifications = (userId?: number) => {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isLoading: true,
    error: null
  });

  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const notifications = await api.getNotifications();
      const unreadCount = notifications.filter(n => !n.isRead).length;
      
      setState(prev => ({
        ...prev,
        notifications,
        unreadCount,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch notifications',
        isLoading: false
      }));
    }
  }, [userId]);

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await api.markNotificationAsRead(notificationId);
      
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1)
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = state.notifications.filter(n => !n.isRead);
      
      await Promise.all(
        unreadNotifications.map(n => api.markNotificationAsRead(n.id))
      );
      
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0
      }));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, [state.notifications]);

  const addNotification = useCallback((notification: Notification) => {
    setState(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications],
      unreadCount: prev.unreadCount + 1
    }));

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: notification.fromUser.avatar,
        tag: `notification-${notification.id}`
      });
    }

    playNotificationSound(notification.type);
  }, []);

  const playNotificationSound = (type: string) => {
    try {
      const audio = new Audio();
      switch (type) {
        case NOTIFICATION_TYPES.MATCH:
          audio.src = '/sounds/match.mp3';
          break;
        case NOTIFICATION_TYPES.MESSAGE:
          audio.src = '/sounds/message.mp3';
          break;
        case NOTIFICATION_TYPES.LIKE:
          audio.src = '/sounds/like.mp3';
          break;
        default:
          audio.src = '/sounds/notification.mp3';
      }
      audio.play().catch(() => {
      });
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  useEffect(() => {
    if (!userId) return;

    const connectWebSocket = () => {
      try {
        const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/notifications?userId=${userId}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('Notification WebSocket connected');
          setWsConnection(ws);
        };

        ws.onmessage = (event) => {
          try {
            const notification: Notification = JSON.parse(event.data);
            
            const delay = Math.min(Math.random() * REAL_TIME_DELAY_MAX, REAL_TIME_DELAY_MAX);
            
            setTimeout(() => {
              addNotification(notification);
            }, delay);
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        };

        ws.onclose = () => {
          console.log('Notification WebSocket disconnected');
          setWsConnection(null);
          
          setTimeout(connectWebSocket, 3000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

      } catch (error) {
        console.error('Failed to connect to notification WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [userId, addNotification]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000); 
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    isLoading: state.isLoading,
    error: state.error,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
    requestNotificationPermission
  };
};
