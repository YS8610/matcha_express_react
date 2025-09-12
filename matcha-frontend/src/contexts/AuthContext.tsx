'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';
import { getCookie, deleteCookie } from '@/lib/cookies';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: {username: string, email: string, firstName: string, lastName: string, password: string}) => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token') || getCookie('token');
      if (token) {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          setUser({
            id: payload.email || 'user',
            username: payload.username || payload.email?.split('@')[0] || 'user',
            email: payload.email || '',
            firstName: '',
            lastName: '',
            emailVerified: false,
            profileComplete: false,
            lastSeen: new Date(),
            isOnline: false
          });
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      deleteCookie('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    if (response.msg) {
      const token = response.msg;
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        setUser({
          id: payload.email || 'user',
          username: payload.username || payload.email?.split('@')[0] || 'user',
          email: payload.email || email,
          firstName: '',
          lastName: '',
          emailVerified: false,
          profileComplete: false,
          lastSeen: new Date(),
          isOnline: false
        });
      }
    }
  };

  const logout = async () => {
    try {
      api.clearToken();
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (data: {username: string, email: string, firstName: string, lastName: string, password: string}) => {
    await api.register(data);
  };

  const updateUser = (user: User) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
