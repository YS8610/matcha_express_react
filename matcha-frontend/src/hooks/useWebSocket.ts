'use client';

import { useEffect } from 'react';
import { useWebSocket as useWSContext } from '@/contexts/WebSocketContext';

interface UseWebSocketOptions {
  onNotification?: (notification: unknown) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  checkOnlineUsers?: string[];
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    isConnected,
    notifications,
    onlineUsers,
    checkOnlineStatus,
    markNotificationRead,
    clearNotifications
  } = useWSContext();

  const { onNotification, onConnect, onDisconnect, checkOnlineUsers } = options;

  useEffect(() => {
    if (isConnected && onConnect) {
      onConnect();
    }
  }, [isConnected, onConnect]);

  useEffect(() => {
    if (!isConnected && onDisconnect) {
      onDisconnect();
    }
  }, [isConnected, onDisconnect]);

  useEffect(() => {
    if (notifications.length > 0 && onNotification) {
      const latestNotification = notifications[0];
      if (!latestNotification.read) {
        onNotification(latestNotification);
      }
    }
  }, [notifications, onNotification]);

  useEffect(() => {
    if (checkOnlineUsers && checkOnlineUsers.length > 0 && isConnected) {
      checkOnlineStatus(checkOnlineUsers);
    }
  }, [checkOnlineUsers, isConnected, checkOnlineStatus]);

  return {
    isConnected,
    notifications,
    onlineUsers,
    checkOnlineStatus,
    markNotificationRead,
    clearNotifications
  };
}
