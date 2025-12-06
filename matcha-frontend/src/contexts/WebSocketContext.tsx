'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { io, Socket as SocketIOSocket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getToken } from '@/lib/tokenStorage';
import { useToast } from './ToastContext';
import type { Notification, ChatMessage, WebSocketContextType, Socket } from '@/types';

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080';

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [socket, setSocket] = useState<SocketIOSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});

  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const connectionAttemptShown = useRef(false);

  useEffect(() => {
    if (!user) {
      setSocket((prevSocket) => {
        if (prevSocket) {
          prevSocket.disconnect();
        }
        return null;
      });
      setIsConnected(false);
      return;
    }

    const token = getToken();
    const newSocket = io(WS_URL, {
      auth: {
        token: token || '',
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      reconnectAttempts.current++;

      if (reconnectAttempts.current >= maxReconnectAttempts) {
        addToast('Failed to connect to messaging service', 'error', 5000);
        connectionAttemptShown.current = true;
      } else if (!connectionAttemptShown.current && reconnectAttempts.current === 1) {
        addToast('Connecting to messaging service...', 'info', 3000);
      }
    });

    newSocket.on('notification', (data: unknown) => {

      const notifData = data as {
        id?: string;
        userId?: string;
        type?: string;
        message?: string;
        createdAt?: number;
        read?: boolean;
      };

      const notification: Notification = {
        id: notifData.id || `notif-${Date.now()}`,
        userId: notifData.userId || '',
        type: (notifData.type as Notification['type']) || 'message',
        message: notifData.message || 'New notification',
        read: notifData.read || false,
        createdAt: notifData.createdAt || Date.now()
      };

      setNotifications(prev => {
        if (prev.some(n => n.id === notification.id)) {
          return prev;
        }
        const updated = [notification, ...prev];
        return updated.slice(0, 50);
      });
    });

    newSocket.on('onlineStatus', (statuses: Record<string, boolean>) => {
      setOnlineUsers(prev => ({ ...prev, ...statuses }));
    });

    const handleChatMessage = (data: ChatMessage) => {
      const otherUserId = data.fromUserId === user?.id ? data.toUserId : data.fromUserId;
      setChatMessages(prev => ({
        ...prev,
        [otherUserId]: [...(prev[otherUserId] || []), data]
      }));
    };

    newSocket.on('serverChatmsg', handleChatMessage);

    newSocket.on('error', (error: unknown) => {
      const errorData = error as { msg?: string };
      if (errorData.msg === 'Authentication error') {
        addToast('Session expired, please login again', 'error', 4000);
        newSocket.disconnect();
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.off('serverChatmsg', handleChatMessage);
      newSocket.disconnect();
    };
  }, [user]);

  const checkOnlineStatus = useCallback((userIds: string[]) => {
    if (socket && isConnected && userIds.length > 0) {
      socket.emit('isOnline', userIds);
    }
  }, [socket, isConnected]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const sendChatMessage = useCallback((toUserId: string, content: string) => {
    if (socket && isConnected && user) {
      const message: ChatMessage = {
        fromUserId: user.id,
        toUserId,
        content,
        timestamp: Date.now()
      };
      socket.emit('chatMessage', message);
    } else {
      console.warn('[WebSocket] Cannot send message: socket not connected');
    }
  }, [socket, isConnected, user]);

  const getChatHistory = useCallback((userId: string): ChatMessage[] => {
    return chatMessages[userId] || [];
  }, [chatMessages]);

  const contextValue = useMemo(
    () => ({
      socket: socket as unknown as Socket | null,
      isConnected,
      notifications,
      onlineUsers,
      chatMessages,
      checkOnlineStatus,
      markNotificationRead,
      clearNotifications,
      sendChatMessage,
      getChatHistory
    } as WebSocketContextType),
    [socket, isConnected, notifications, onlineUsers, chatMessages, checkOnlineStatus, markNotificationRead, clearNotifications, sendChatMessage, getChatHistory]
  );

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
