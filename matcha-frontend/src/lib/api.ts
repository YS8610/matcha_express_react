import { setCookie, deleteCookie } from './cookies';

const API_URL = '';

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
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      if (errorData.errors && errorData.errors[0]) {
        throw new Error(errorData.errors[0].message || `HTTP error! status: ${response.status}`);
      }
      if (errorData.msg) {
        throw new Error(errorData.msg);
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async register(data: {username: string, email: string, firstName: string, lastName: string, password: string, password2?: string, birthDate: string}) {
    const requestData = {
      email: data.email,
      pw: data.password,
      pw2: data.password2 || data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      birthDate: data.birthDate
    };
    return this.request('/pubapi/register', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async login(username: string, password: string) {
    const response = await this.request('/pubapi/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (response.msg) {
      this.setToken(response.msg);
    }
    return response;
  }

  async logout() {
    this.clearToken();
  }

  async activateAccount(token: string) {
    const response = await this.request(`/pubapi/activate/${token}`);
    if (response.msg) {
      this.setToken(response.msg);
    }
    return response;
  }

  async requestPasswordReset(email: string, username: string) {
    return this.request('/pubapi/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, username }),
    });
  }

  async confirmPasswordReset(id: string, token: string, newPassword: string, newPassword2: string) {
    return this.request(`/pubapi/reset-password/${id}/${token}`, {
      method: 'POST',
      body: JSON.stringify({ newPassword, newPassword2 }),
    });
  }

  async getProfile(userId?: string) {
    const endpoint = userId && userId !== 'undefined' ? `/profiles/${userId}` : '/profiles/me';
    return this.request(endpoint);
  }

  async updateProfile(data: Record<string, unknown>) {
    return this.request('/api/user/profile', {
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
      body: formData as BodyInit,
    });
  }

  async getSuggestions(filters?: Record<string, unknown>) {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    return this.request(`/browse/suggestions?${params}`);
  }

  async search(criteria: Record<string, unknown>) {
    const params = new URLSearchParams(criteria as Record<string, string>).toString();
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

  async ping() {
    return this.request('/pubapi/ping');
  }
}

export const api = new ApiClient();

export function generateAvatarUrl(name?: string, id?: string): string {
  const displayName = name || id || 'User';

  const initials = displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colors = [
    '007bff',
    '28a745',
    'dc3545',
    'ffc107',
    '17a2b8',
    '6610f2',
    'e83e8c',
    '20c997',
    'fd7e14',
    '6f42c1',
  ];

  const hash = (displayName || '').split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const colorIndex = Math.abs(hash) % colors.length;
  const bgColor = colors[colorIndex];

  const params = new URLSearchParams({
    name: initials,
    background: bgColor,
    color: 'ffffff',
    size: '400',
    font: '0.5',
    bold: 'true',
    format: 'svg',
  });

  return `https://ui-avatars.com/api/?${params.toString()}`;
}

export function generatePlaceholderImage(width = 400, height = 400, text = 'No Image'): string {
  return `https://via.placeholder.com/${width}x${height}/e0e0e0/666666?text=${encodeURIComponent(text)}`;
}
