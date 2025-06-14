// src/hooks/useAuth.tsx
import { useState, useEffect } from 'react';
import { User } from '../types/types';
import * as api from '../utils/api';

export const useAuth = () => {
  const [authState, setAuthState] = useState<{
    user: User | null;
    isAuthenticated: boolean;
    isProfileComplete: boolean;
    isLoading: boolean;
  }>({
    user: null,
    isAuthenticated: false,
    isProfileComplete: false,
    isLoading: true
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const user = await api.getCurrentUser();
      setAuthState({
        user,
        isAuthenticated: true,
        isProfileComplete: isUserComplete(user),
        isLoading: false
      });
    } catch (error) {
      localStorage.removeItem('authToken');
      setAuthState({ user: null, isAuthenticated: false, isProfileComplete: false, isLoading: false });
    }
  };

  const isUserComplete = (user: User): boolean => {
    return !!(user.gender && user.sexualPreference && user.bio && user.tags?.length && user.photos?.length && user.age && user.location);
  };

  const login = async (credentials: { username: string; password: string }) => {
    const response = await api.login(credentials);
    localStorage.setItem('authToken', response.token);
    setAuthState({
      user: response.user,
      isAuthenticated: true,
      isProfileComplete: isUserComplete(response.user),
      isLoading: false
    });
  };

  const register = async (data: any) => {
    const response = await api.register(data);
    localStorage.setItem('authToken', response.token);
    setAuthState({
      user: response.user,
      isAuthenticated: true,
      isProfileComplete: false,
      isLoading: false
    });
  };

  const completeProfile = async (data: any) => {
    const user = await api.updateProfile(data);
    setAuthState(prev => ({ ...prev, user, isProfileComplete: isUserComplete(user) }));
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({ user: null, isAuthenticated: false, isProfileComplete: false, isLoading: false });
  };

  return { ...authState, login, register, completeProfile, logout };
};
