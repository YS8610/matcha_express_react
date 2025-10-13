'use client';

import { useEffect, useCallback } from 'react';
import { useWebSocket as useWSContext } from '@/contexts/WebSocketContext';

interface UseWebSocketOptions {
  onNotification?: (notification: unknown) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  checkOnlineUsers?: string[];
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    socket,
    isConnected,
    notifications,
    onlineUsers,
    checkOnlineStatus,
    addNotification,
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

  const emit = useCallback((event: string, data?: unknown) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.warn('[useWebSocket] Cannot emit: socket not connected');
    }
  }, [socket, isConnected]);

  const on = useCallback((event: string, callback: (data: unknown) => void) => {
    if (socket) {
      socket.on(event, callback);
      return () => {
        socket.off(event, callback);
      };
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    notifications,
    onlineUsers,
    checkOnlineStatus,
    addNotification,
    markNotificationRead,
    clearNotifications,
    emit,
    on
  };
}
