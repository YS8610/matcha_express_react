import type { RegisterData, LoginRequest, LoginResponse, ApiResponse, ProfileShort, ChatHistoryResponse } from '@/types';
import { storeToken, getToken, clearToken } from '@/lib/tokenStorage';
import { addCsrfToken, requiresCsrfToken } from '@/lib/csrf';

const API_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || '');

class ApiClient {
  constructor() {}

  async request<T = Record<string, unknown>>(endpoint: string, options: RequestInit = {}, suppressErrorLog = false): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;
    const method = options.method || 'GET';
    const token = typeof window !== 'undefined' ? getToken() : null;

    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
      (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    const headersWithCsrf = requiresCsrfToken(method)
      ? addCsrfToken(headers as Record<string, string>)
      : headers;

    const config: RequestInit = {
      ...options,
      headers: headersWithCsrf,
    };

    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type') || '';
    let responseData: Record<string, unknown> | string;

    try {
      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = { message: await response.text() };
      }
    } catch (e) {
      responseData = { message: 'Failed to parse response' };
    }

    if (!response.ok) {
      if (!suppressErrorLog) {
        let sanitizedBody = options.body;
        if (typeof options.body === 'string') {
          try {
            const parsedBody = JSON.parse(options.body);
            const sensitiveFields = ['password', 'pw', 'pw2', 'oldPassword', 'newPassword', 'confirmPassword', 'newPassword2'];
            const sanitized = { ...parsedBody };
            sensitiveFields.forEach(field => {
              if (field in sanitized) {
                sanitized[field] = '[REDACTED]';
              }
            });
            sanitizedBody = JSON.stringify(sanitized);
          } catch {
            sanitizedBody = options.body;
          }
        }

        console.error('API Request Failed:', {
          url,
          method: config.method || 'GET',
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          errorData: responseData,
          requestHeaders: config.headers,
          requestBody: sanitizedBody
        });
      }

      if (response.status === 401) {
        clearToken();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('unauthorized'));
          window.location.href = '/login';
        }
      }

      if (typeof responseData === 'object') {
        const data = responseData as Record<string, unknown>;
        if (response.status === 400 && data.message && (data.message as string).includes('User profile not found')) {
          clearToken();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('unauthorized'));
            window.location.href = '/login';
          }
        }

        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          const firstError = data.errors[0] as Record<string, unknown>;
          throw new Error((firstError.message as string) || `HTTP error! status: ${response.status}`);
        }
        if (data.msg) {
          throw new Error(data.msg as string);
        }
        throw new Error((data.message as string) || `HTTP error! status: ${response.status}`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return responseData as unknown as ApiResponse<T>;
  }

  async register(data: RegisterData) {
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

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request('/pubapi/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response as LoginResponse;
  }

  async activateAccount(token: string): Promise<LoginResponse> {
    const response = await this.request(`/pubapi/activate/${token}`);
    return response as LoginResponse;
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

  async ping() {
    return this.request('/pubapi/ping');
  }

  async resendActivationEmail(email: string, username: string) {
    return this.request('/pubapi/reactivation', {
      method: 'POST',
      body: JSON.stringify({ email, username }),
    });
  }

  async getProfile(userId?: string): Promise<{ data: Record<string, unknown> }> {
    const endpoint = userId && userId !== 'undefined' ? `/api/profile/${userId}` : '/api/user/profile';
    const response = await this.request<Record<string, unknown>>(endpoint);

    if (response && typeof response === 'object' && !('data' in response) && 'username' in response && 'id' in response) {
      return { data: response as unknown as Record<string, unknown> };
    }
    return response as unknown as { data: Record<string, unknown> };
  }

  async getShortProfile(userId: string): Promise<ProfileShort> {
    const response = await this.request<ProfileShort>(`/api/profile/short/${userId}`);
    return response as ProfileShort;
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
    return this.request<ProfileShort[]>('/api/user/liked/by');
  }

  async getMatchedUsers() {
    return this.request<ProfileShort[]>('/api/user/liked/matched');
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

  async getPopularTags(limit: number = 50) {
    try {
      return this.request<{ tags: string[] }>(`/api/tags/popular?limit=${limit}`);
    } catch {
      return { tags: [] };
    }
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
    return this.request<ProfileShort[]>('/api/user/viewed');
  }

  async getUsersWhoViewedMe() {
    return this.request<ProfileShort[]>('/api/user/viewed/by');
  }

  async recordUserView(viewedUserID: string) {
    return this.request('/api/user/viewed', {
      method: 'POST',
      body: JSON.stringify({ viewedUserID }),
    }, true);
  }

  async getBlockedUsers() {
    return this.request<ProfileShort[]>('/api/user/block');
  }

  async blockUser(userId: string) {
    return this.request('/api/user/block', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async unblockUser(userId: string) {
    return this.request('/api/user/block', {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  }

  async getNotifications(limit: number = 20, offset: number = 0) {
    return this.request<Record<string, unknown>[]>(`/api/user/notification?limit=${limit}&offset=${offset}`);
  }

  async deleteNotification(notificationId: string) {
    return this.request('/api/user/notification', {
      method: 'DELETE',
      body: JSON.stringify({ notificationId }),
    });
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request('/api/user/notification', {
      method: 'PUT',
      body: JSON.stringify({ notificationId }),
    });
  }


  async reportUser(userId: string, reason: string) {
    return this.request(`/api/user/report/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getChatHistory(otherId: string, limit: number = 50, skipno: number = 0) {
    return this.request<ChatHistoryResponse>(`/api/user/chat?otherid=${otherId}&limit=${limit}&skipno=${skipno}`, {
      method: 'GET',
    });
  }

  async updateUserLocation(latitude: number, longitude: number) {
    return this.request('/api/user/location', {
      method: 'PUT',
      body: JSON.stringify({ latitude, longitude }),
    });
  }

  async getFilteredProfiles(filters: {
    minAge?: number;
    maxAge?: number;
    distancekm?: number;
    minFameRating?: number;
    maxFameRating?: number;
    skip?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (filters.minAge !== undefined) queryParams.append('minAge', filters.minAge.toString());
    if (filters.maxAge !== undefined) queryParams.append('maxAge', filters.maxAge.toString());
    if (filters.distancekm !== undefined) queryParams.append('distancekm', filters.distancekm.toString());
    if (filters.minFameRating !== undefined) queryParams.append('minFameRating', filters.minFameRating.toString());
    if (filters.maxFameRating !== undefined) queryParams.append('maxFameRating', filters.maxFameRating.toString());
    if (filters.skip !== undefined) queryParams.append('skip', filters.skip.toString());
    if (filters.limit !== undefined) queryParams.append('limit', filters.limit.toString());

    return this.request<ProfileShort[]>(`/api/profile?${queryParams.toString()}`);
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

