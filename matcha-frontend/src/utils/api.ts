// src/utils/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
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
}

const apiClient = new ApiClient();

export const login = (credentials: { username: string; password: string }) => 
  apiClient.post('/auth/login', credentials);

export const register = (userData: any) => 
  apiClient.post('/auth/register', userData);

export const getCurrentUser = () => 
  apiClient.get('/user/me');

export const updateProfile = (data: any) => 
  apiClient.put('/user/profile', data);

export const getProfiles = (filters?: any) => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, Array.isArray(value) ? value.join(',') : value.toString());
      }
    });
  }
  return apiClient.get(`/profiles${params.toString() ? `?${params}` : ''}`);
};

export const likeProfile = (profileId: number) => 
  apiClient.post(`/profiles/${profileId}/like`);

export const getChatRooms = () => 
  apiClient.get('/chat/rooms');

export const sendMessage = (chatId: number, content: string) => 
  apiClient.post(`/chat/rooms/${chatId}/messages`, { content });

export const recordProfileView = (profileId: number) => 
  apiClient.post(`/profiles/${profileId}/view`);

export const unlikeProfile = (profileId: number) => 
  apiClient.delete(`/profiles/${profileId}/like`);

export const reportProfile = (profileId: number, reason: string, details?: string) => 
  apiClient.post(`/profiles/${profileId}/report`, { reason, details });

export const blockProfile = (profileId: number) => 
  apiClient.post(`/profiles/${profileId}/block`);

export const updateLocation = (latitude: number, longitude: number) => 
  apiClient.put('/user/location', { latitude, longitude });

export const verifyEmail = (token: string) => 
  apiClient.post('/auth/verify-email', { token });

export const forgotPassword = (email: string) => 
  apiClient.post('/auth/forgot-password', { email });

export const resetPassword = (token: string, password: string) => 
  apiClient.post('/auth/reset-password', { token, password });

export const getProfileVisitors = () => 
  apiClient.get('/user/visitors');

export const getProfileLikes = () => 
  apiClient.get('/user/likes');
