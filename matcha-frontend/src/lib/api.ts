import { setCookie, deleteCookie } from './cookies';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
    const headers: HeadersInit = {
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
      (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));

      console.error('API Request Failed:', {
        url,
        method: config.method || 'GET',
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        errorData,
        requestHeaders: config.headers,
        requestBody: options.body
      });

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
    const endpoint = userId && userId !== 'undefined' ? `/profiles/${userId}` : '/api/user/profile';
    return this.request(endpoint);
  }

  async updateProfile(data: Record<string, unknown>) {
    return this.request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadPhoto(file: File, photoNumber: number) {
    const formData = new FormData();
    formData.append('photo', file);

    return this.request(`/api/user/photo/${photoNumber}`, {
      method: 'PUT',
      body: formData as BodyInit,
    });
  }

  async getUserPhotos() {
    return this.request('/api/user/photo');
  }

  async deletePhoto(photoNumber: number) {
    return this.request(`/api/user/photo/${photoNumber}`, {
      method: 'DELETE',
    });
  }

  async reorderPhotos(newOrder: number[]) {
    return this.request('/api/user/photo/order', {
      method: 'PUT',
      body: JSON.stringify({ newOrder }),
    });
  }

  async likeUser(userid: string) {
    return this.request('/api/user/liked', {
      method: 'POST',
      body: JSON.stringify({ userid }),
    });
  }

  async unlikeUser(userid: string) {
    return this.request('/api/user/liked', {
      method: 'DELETE',
      body: JSON.stringify({ userid }),
    });
  }

  async getUsersWhoLikedMe() {
    return this.request('/api/user/liked/by');
  }

  async ping() {
    return this.request('/pubapi/ping');
  }

  getPhoto(photoName: string): string {
    const url = `${API_URL}/api/photo/${photoName}`;
    return url;
  }

  async getUserTags() {
    return this.request('/api/user/tag');
  }

  async addTag(tagName: string) {
    return this.request('/api/user/tag', {
      method: 'POST',
      body: JSON.stringify({ tagName }),
    });
  }

  async removeTag(tagName: string) {
    return this.request('/api/user/tag', {
      method: 'DELETE',
      body: JSON.stringify({ tagName }),
    });
  }

  async updatePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
    return this.request('/api/user/pw', {
      method: 'PUT',
      body: JSON.stringify({
        oldPassword,
        pw: newPassword,
        pw2: confirmPassword
      }),
    });
  }

  async getUsersViewed() {
    return this.request('/api/user/viewed');
  }

  async getUsersWhoViewedMe() {
    return this.request('/api/user/viewed/by');
  }

  async recordUserView(viewedUserID: string) {
    return this.request('/api/user/viewed', {
      method: 'POST',
      body: JSON.stringify({ viewedUserID }),
    });
  }

  getPublicPhoto(photoName: string): string {
    const url = `${API_URL}/pubapi/photo/${photoName}`;
    return url;
  }

  async testUploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('photo', file);

    return this.request('/pubapi/ping', {
      method: 'POST',
      body: formData as BodyInit,
    });
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
