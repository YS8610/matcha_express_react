// src/hooks/useAuth.tsx
import { useState, useEffect } from 'react';
import { User } from '../types/user';
import * as api from '../utils/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  isLoading: boolean;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface ProfileData {
  gender: string;
  preference: string;
  bio: string;
  tags: string;
  age: string;
  location: string;
  photos: File[];
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
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
        isProfileComplete: isUserProfileComplete(user),
        isLoading: false
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isProfileComplete: false,
        isLoading: false
      });
    }
  };

  const isUserProfileComplete = (user: User): boolean => {
    return !!(
      user.gender &&
      user.sexualPreference &&
      user.bio &&
      user.tags?.length > 0 &&
      user.photos?.length > 0 &&
      user.age &&
      user.location
    );
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await api.login(credentials);
      const { user, token } = response;

      localStorage.setItem('authToken', token);
      
      setAuthState({
        user,
        isAuthenticated: true,
        isProfileComplete: isUserProfileComplete(user),
        isLoading: false
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await api.register(data);
      const { user, token } = response;

      localStorage.setItem('authToken', token);
      
      setAuthState({
        user,
        isAuthenticated: true,
        isProfileComplete: false, 
        isLoading: false
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const completeProfile = async (data: ProfileData): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const updatedUser = await api.updateProfile(data);
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        isProfileComplete: isUserProfileComplete(updatedUser),
        isLoading: false
      }));
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    try {
      if (!authState.user) throw new Error('No user logged in');
      
      const updatedUser = await api.updateUser(updates);
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        isProfileComplete: isUserProfileComplete(updatedUser)
      }));
    } catch (error) {
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isProfileComplete: false,
        isLoading: false
      });
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (!authState.isAuthenticated) return;
      
      const user = await api.getCurrentUser();
      setAuthState(prev => ({
        ...prev,
        user,
        isProfileComplete: isUserProfileComplete(user)
      }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isProfileComplete: authState.isProfileComplete,
    isLoading: authState.isLoading,
    login,
    register,
    completeProfile,
    updateUser,
    logout,
    refreshUser
  };
};
