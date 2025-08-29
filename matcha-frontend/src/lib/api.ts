import { MockApiClient } from './mockApi';
import { setCookie, deleteCookie } from './cookies';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const USE_MOCK = !API_URL || process.env.NEXT_PUBLIC_USE_MOCK === 'true';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      setCookie('token', token, 7);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      deleteCookie('token');
    }
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async register(data: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(username: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
  }

  async verifyEmail(token: string) {
    return this.request(`/auth/verify/${token}`, { method: 'POST' });
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async getProfile(userId?: string) {
    const endpoint = userId && userId !== 'undefined' ? `/profiles/${userId}` : '/profiles/me';
    return this.request(endpoint);
  }

  async updateProfile(data: any) {
    return this.request('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('photo', file);
    
    return this.request('/profiles/photos', {
      method: 'POST',
      headers: {},
      body: formData as any,
    });
  }

  async getSuggestions(filters?: any) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/browse/suggestions?${params}`);
  }

  async search(criteria: any) {
    const params = new URLSearchParams(criteria).toString();
    return this.request(`/search?${params}`);
  }

  async likeProfile(userId: string) {
    return this.request(`/interactions/like/${userId}`, { method: 'POST' });
  }

  async unlikeProfile(userId: string) {
    return this.request(`/interactions/unlike/${userId}`, { method: 'POST' });
  }

  async blockUser(userId: string) {
    return this.request(`/interactions/block/${userId}`, { method: 'POST' });
  }

  async reportUser(userId: string, reason: string) {
    return this.request(`/interactions/report/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getConversations() {
    return this.request('/chat/conversations');
  }

  async getMessages(userId: string) {
    return this.request(`/chat/messages/${userId}`);
  }

  async sendMessage(userId: string, message: string) {
    return this.request(`/chat/messages/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, { method: 'POST' });
  }

  async getProfileViews() {
    return this.request('/stats/views');
  }

  async getLikes() {
    return this.request('/stats/likes');
  }
}

export const api = USE_MOCK ? new MockApiClient() : new ApiClient();

if (typeof window !== 'undefined') {
  console.log(`[API] Using ${USE_MOCK ? 'MOCK' : 'REAL'} API${!USE_MOCK ? ` at ${API_URL}` : ''}`);
  if (USE_MOCK) {
    console.log('[API] Mock Mode: Login with username "demo" and password "password"');
  }
}
