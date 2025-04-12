'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { type User, type AuthState } from '@/types/auth';

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
};

const AuthContext = createContext<{
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}>({
  isLoggedIn: false,
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  useEffect(() => {
    const token = localStorage.getItem('matchaAuthToken');
    if (token) {
      setAuthState({
        isLoggedIn: true,
        token,
        user: null,
      });
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const token = 'mock-jwt-token';
      localStorage.setItem('matchaAuthToken', token);
      
      setAuthState({
        isLoggedIn: true,
        token,
        user: {
          id: 1,
          name: 'Demo User',
          email,
          profileImageUrl: null,
        },
      });
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const token = 'mock-jwt-token';
      localStorage.setItem('matchaAuthToken', token);
      
      setAuthState({
        isLoggedIn: true,
        token,
        user: {
          id: 1,
          name,
          email,
          profileImageUrl: null,
        },
      });
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('matchaAuthToken');
    setAuthState(initialState);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: authState.isLoggedIn,
        user: authState.user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
