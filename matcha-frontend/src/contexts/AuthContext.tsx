'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';
import { deleteCookie } from '@/lib/cookies';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: {
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    birthDate: string,
    password: string,
    password2?: string}) => Promise<void>;
  activateAccount: (token: string) => Promise<void>;
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
      const token = localStorage.getItem('token');
      if (token) {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));

          const currentTime = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < currentTime) {
            console.log('Token expired, clearing authentication');
            localStorage.removeItem('token');
            deleteCookie('token');
            setUser(null);
            setLoading(false);
            return;
          }

          if (!payload.activated || !payload.email || !payload.username) {
            console.log('Token missing required fields');
            localStorage.removeItem('token');
            deleteCookie('token');
            setUser(null);
            setLoading(false);
            return;
          }

          setUser({
            id: payload.username || 'user',
            username: payload.username || 'user',
            email: payload.email || '',
            firstName: '',
            lastName: '',
            emailVerified: payload.activated || false,
            profileComplete: false,
            lastSeen: new Date(),
            isOnline: false,
            latitude: payload.latitude,
            longitude: payload.longitude,
            birthDate: payload.birthDate
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

  const login = async (username: string, password: string) => {
    const response = await api.login(username, password);
    if (response.msg) {
      const token = response.msg;
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        setUser({
          id: payload.username || 'user',
          username: payload.username || username,
          email: payload.email || '',
          firstName: '',
          lastName: '',
          emailVerified: payload.activated || false,
          profileComplete: false,
          lastSeen: new Date(),
          isOnline: false,
          latitude: payload.latitude,
          longitude: payload.longitude,
          birthDate: payload.birthDate
        });
      }
    }
  };

  const logout = async () => {
    try {
      api.clearToken();
      localStorage.clear();
      sessionStorage.clear();

      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (data: {username: string, email: string, firstName: string, lastName: string, birthDate: string, password: string, password2?: string}) => {
    await api.register(data);
  };

  const activateAccount = async (token: string) => {
    const response = await api.activateAccount(token);
    if (response.msg) {
      const newToken = response.msg;
      const tokenParts = newToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        setUser({
          id: payload.username || 'user',
          username: payload.username || 'user',
          email: payload.email || '',
          firstName: '',
          lastName: '',
          emailVerified: true,
          profileComplete: false,
          lastSeen: new Date(),
          isOnline: false,
          latitude: payload.latitude,
          longitude: payload.longitude,
          birthDate: payload.birthDate
        });
      }
    }
  };

  const updateUser = (user: User) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, activateAccount, updateUser }}>
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
