'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import * as tokenStorage from '@/lib/tokenStorage';
import type { User, AuthContextType, RegisterData, LoginRequest } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = tokenStorage.getToken();
      if (token) {
        const validation = tokenStorage.validateTokenStructure(token);
        if (!validation.valid) {
          console.log('Token validation failed:', validation.reason);
          tokenStorage.clearToken();
          setUser(null);
          setLoading(false);
          return;
        }

        if (tokenStorage.hasTokenBeenTampered(token)) {
          console.log('Token tampering detected');
          tokenStorage.clearToken();
          setUser(null);
          setLoading(false);
          return;
        }

        const payload = tokenStorage.getTokenPayload(token);

        if (!payload || !payload.activated || !payload.email || !payload.username) {
          console.log('Token missing required fields');
          tokenStorage.clearToken();
          setUser(null);
          setLoading(false);
          return;
        }

        const profileCompleteFromStorage = typeof window !== 'undefined' && localStorage.getItem('profileComplete') === 'true';
        setUser({
          id: payload.username || 'user',
          username: payload.username || 'user',
          email: payload.email || '',
          firstName: '',
          lastName: '',
          emailVerified: payload.activated || false,
          profileComplete: profileCompleteFromStorage,
          lastSeen: new Date(),
          isOnline: false,
          latitude: payload.latitude,
          longitude: payload.longitude,
          birthDate: payload.birthDate
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      tokenStorage.clearToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const credentials: LoginRequest = { username, password };
    const response = await api.login(credentials);
    if (response.msg) {
      const token = response.msg;

      const stored = tokenStorage.storeToken(token);
      if (!stored) {
        throw new Error('Failed to store authentication token');
      }

      const payload = tokenStorage.getTokenPayload(token);
      if (payload) {
        const profileCompleteFromStorage = typeof window !== 'undefined' && localStorage.getItem('profileComplete') === 'true';
        setUser({
          id: payload.username || 'user',
          username: payload.username || username,
          email: payload.email || '',
          firstName: '',
          lastName: '',
          emailVerified: payload.activated || false,
          profileComplete: profileCompleteFromStorage,
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

  const register = async (data: RegisterData) => {
    await api.register(data);
  };

  const activateAccount = async (token: string) => {
    const response = await api.activateAccount(token);
    if (response.msg) {
      const newToken = response.msg;

      const stored = tokenStorage.storeToken(newToken);
      if (!stored) {
        throw new Error('Failed to store authentication token');
      }

      const tokenParts = newToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const profileCompleteFromStorage = typeof window !== 'undefined' && localStorage.getItem('profileComplete') === 'true';
        setUser({
          id: payload.username || 'user',
          username: payload.username || 'user',
          email: payload.email || '',
          firstName: '',
          lastName: '',
          emailVerified: true,
          profileComplete: profileCompleteFromStorage,
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
