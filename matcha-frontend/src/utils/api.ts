// src/utils/api.ts
import { API_BASE_URL } from './constants';
import { User } from '../types/user';
import { Profile, SearchFilters } from '../types/profile';
import { ChatRoom, Message } from '../types/message';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network request failed');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async uploadFile<T>(endpoint: string, file: File, additionalData?: any): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const token = localStorage.getItem('authToken');
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

export const login = async (credentials: { username: string; password: string }): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>('/auth/login', credentials);
};

export const register = async (userData: {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>('/auth/register', userData);
};

export const logout = async (): Promise<void> => {
  return apiClient.post<void>('/auth/logout');
};

export const forgotPassword = async (email: string): Promise<void> => {
  return apiClient.post<void>('/auth/forgot-password', { email });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  return apiClient.post<void>('/auth/reset-password', { token, newPassword });
};

export const getCurrentUser = async (): Promise<User> => {
  return apiClient.get<User>('/user/me');
};

export const updateUser = async (updates: Partial<User>): Promise<User> => {
  return apiClient.put<User>('/user/me', updates);
};

export const updateProfile = async (profileData: any): Promise<User> => {
  return apiClient.put<User>('/user/profile', profileData);
};

export const uploadProfilePhoto = async (file: File): Promise<{ url: string }> => {
  return apiClient.uploadFile<{ url: string }>('/user/photos', file);
};

export const deleteProfilePhoto = async (photoId: string): Promise<void> => {
  return apiClient.delete<void>(`/user/photos/${photoId}`);
};

export const getProfiles = async (filters?: SearchFilters): Promise<Profile[]> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, value.toString());
        }
      }
    });
  }
  
  const endpoint = params.toString() ? `/profiles?${params.toString()}` : '/profiles';
  return apiClient.get<Profile[]>(endpoint);
};

export const getProfile = async (profileId: number): Promise<Profile> => {
  return apiClient.get<Profile>(`/profiles/${profileId}`);
};

export const likeProfile = async (profileId: number): Promise<{ matched: boolean }> => {
  return apiClient.post<{ matched: boolean }>(`/profiles/${profileId}/like`);
};

export const unlikeProfile = async (profileId: number): Promise<void> => {
  return apiClient.delete<void>(`/profiles/${profileId}/like`);
};

export const blockProfile = async (profileId: number): Promise<void> => {
  return apiClient.post<void>(`/profiles/${profileId}/block`);
};

export const reportProfile = async (profileId: number, reason: string): Promise<void> => {
  return apiClient.post<void>(`/profiles/${profileId}/report`, { reason });
};

export const getChatRooms = async (): Promise<ChatRoom[]> => {
  return apiClient.get<ChatRoom[]>('/chat/rooms');
};

export const getChatRoom = async (chatId: number): Promise<ChatRoom> => {
  return apiClient.get<ChatRoom>(`/chat/rooms/${chatId}`);
};

export const sendMessage = async (chatId: number, content: string): Promise<Message> => {
  return apiClient.post<Message>(`/chat/rooms/${chatId}/messages`, { content });
};

export const markMessagesAsRead = async (chatId: number): Promise<void> => {
  return apiClient.put<void>(`/chat/rooms/${chatId}/read`);
};

export const getNotifications = async (): Promise<any[]> => {
  return apiClient.get<any[]>('/notifications');
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  return apiClient.put<void>(`/notifications/${notificationId}/read`);
};

export const getProfileStats = async (): Promise<{
  totalMatches: number;
  profileViews: number;
  likesReceived: number;
  messagesCount: number;
}> => {
  return apiClient.get('/user/stats');
};

export const getProfileVisitors = async (): Promise<Profile[]> => {
  return apiClient.get<Profile[]>('/user/visitors');
};

export const getProfileLikes = async (): Promise<Profile[]> => {
  return apiClient.get<Profile[]>('/user/likes');
};

export const updateLocation = async (latitude: number, longitude: number): Promise<void> => {
  return apiClient.put<void>('/user/location', { latitude, longitude });
};

export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
