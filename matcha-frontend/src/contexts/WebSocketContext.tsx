'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket as SocketIOSocket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import type { Notification, ChatMessage, WebSocketContextType, Socket } from '@/types';

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080';

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<SocketIOSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

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

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    const newSocket = io(WS_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    newSocket.on('connect', () => {
      console.log('[WebSocket] Connected:', newSocket.id);
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error.message);
      reconnectAttempts.current++;

      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('[WebSocket] Max reconnection attempts reached');
      }
    });

    newSocket.on('notification', (data: unknown) => {
      console.log('[WebSocket] Notification received:', data);

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

      setNotifications(prev => [notification, ...prev]);
    });

    newSocket.on('onlineStatus', (statuses: Record<string, boolean>) => {
      console.log('[WebSocket] Online status update:', statuses);
      setOnlineUsers(prev => ({ ...prev, ...statuses }));
    });

    newSocket.on('serverChatmsg', (data: ChatMessage) => {
      console.log('[WebSocket] Chat message received:', data);
      const otherUserId = data.fromUserId === user?.id ? data.toUserId : data.fromUserId;
      setChatMessages(prev => ({
        ...prev,
        [otherUserId]: [...(prev[otherUserId] || []), data]
      }));
    });

    newSocket.on('error', (error: unknown) => {
      console.error('[WebSocket] Error:', error);

      const errorData = error as { msg?: string };
      if (errorData.msg === 'Authentication error') {
        newSocket.disconnect();
      }
    });

    setSocket(newSocket);

    return () => {
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

  return (
    <WebSocketContext.Provider
      value={{
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
      } as WebSocketContextType}
    >
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
