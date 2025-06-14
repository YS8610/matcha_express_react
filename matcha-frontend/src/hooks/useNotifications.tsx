// src/hooks/useNotifications.tsx
import { useState, useEffect } from 'react';

export const useNotifications = (userId?: number) => {
  const [state, setState] = useState({
    notifications: [],
    unreadCount: 0,
    isConnected: false
  });

  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(async () => {
      try {
        const notifications = await fetch('/api/notifications', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        }).then(r => r.json());
        
        setState({
          notifications: notifications.data || [],
          unreadCount: notifications.data?.filter((n: any) => !n.isRead).length || 0,
          isConnected: true
        });
      } catch (error) {
        setState(prev => ({ ...prev, isConnected: false }));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  return state;
};
