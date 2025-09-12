import { setCookie, deleteCookie } from './cookies';
import { allMockUsers } from './mockDataGenerator';

const mockUsers = allMockUsers;

const mockConversations = [
  {
    id: '1',
    userId: '2',
    username: mockUsers[1].username,
    profilePhoto: mockUsers[1].photos[0].url,
    lastMessage: {
      id: '3',
      fromUserId: '2',
      toUserId: '1',
      content: 'Hey, how are you?',
      createdAt: new Date(Date.now() - 1800000),
      read: false,
    },
    unreadCount: 2,
    isOnline: mockUsers[1].isOnline,
  },
  {
    id: '2',
    userId: '3',
    username: mockUsers[2].username,
    profilePhoto: mockUsers[2].photos[0].url,
    lastMessage: {
      id: '4',
      fromUserId: '3',
      toUserId: '1',
      content: 'Great photo!',
      createdAt: new Date(Date.now() - 7200000),
      read: true,
    },
    unreadCount: 0,
    isOnline: mockUsers[2].isOnline,
  },
];

const mockMessages = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    message: 'Hi there!',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    message: 'Hey! How are you?',
    timestamp: new Date(Date.now() - 3000000).toISOString(),
  },
  {
    id: '3',
    senderId: '2',
    receiverId: '1',
    message: 'Hey, how are you?',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
];

const initialMockNotifications = [
  {
    id: '1',
    type: 'like',
    fromUserId: '2',
    fromUsername: 'jane_smith',
    message: 'Jane Smith liked your profile',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    read: false,
  },
  {
    id: '2',
    type: 'view',
    fromUserId: '3',
    fromUsername: 'alex_wilson',
    message: 'Alex Wilson viewed your profile',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    read: true,
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApiClient {
  private token: string | null = null;
  private currentUser = { ...mockUsers[0], password: 'password123' };
  private notifications: typeof initialMockNotifications = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
      
      const storedNotifications = localStorage.getItem('mockNotifications');
      if (storedNotifications) {
        try {
          this.notifications = JSON.parse(storedNotifications);
        } catch {
          this.notifications = [...initialMockNotifications];
        }
      } else {
        this.notifications = [...initialMockNotifications];
      }
    }
  }
  
  private saveNotifications() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mockNotifications', JSON.stringify(this.notifications));
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
      localStorage.removeItem('mockNotifications');
      this.notifications = [...initialMockNotifications];
    }
  }

  async request(endpoint: string, options: RequestInit = {}) {
    await delay(300);
    
    if (!this.token && !endpoint.includes('/auth/')) {
      throw new Error('Unauthorized');
    }

    console.log(`[MOCK API] ${options.method || 'GET'} ${endpoint}`);
    return this.handleRequest(endpoint, options);
  }

  private async handleRequest(endpoint: string, options: RequestInit) {
    const method = options.method || 'GET';
    
    if (endpoint === '/auth/register' && method === 'POST') {
      return { success: true, message: 'Registration successful. Please check your email.' };
    }
    
    if (endpoint === '/auth/login' && method === 'POST') {
      const body = JSON.parse(options.body as string);
      if (body.username === 'demo' && body.password === 'password') {
        return { 
          token: 'mock-jwt-token-12345',
          user: this.currentUser 
        };
      }
      throw new Error('Invalid credentials');
    }
    
    if (endpoint === '/auth/logout' && method === 'POST') {
      return { success: true };
    }
    
    if (endpoint.startsWith('/auth/verify/') && method === 'POST') {
      return { success: true, message: 'Email verified successfully' };
    }
    
    if (endpoint === '/auth/forgot-password' && method === 'POST') {
      return { success: true, message: 'Password reset email sent' };
    }
    
    if (endpoint === '/auth/reset-password' && method === 'POST') {
      return { success: true, message: 'Password reset successful' };
    }
    
    if (endpoint === '/profiles/me') {
      if (method === 'GET') {
        return this.currentUser;
      }
      if (method === 'PUT') {
        const updates = JSON.parse(options.body as string);
        Object.assign(this.currentUser, updates);
        return this.currentUser;
      }
    }
    
    if (endpoint.match(/^\/profiles\/(.+)$/)) {
      const userId = endpoint.split('/').pop();
      if (!userId || userId === 'undefined') {
        console.error('Invalid user ID:', userId);
        throw new Error('Invalid user ID');
      }
      
      console.log('[MOCK API] Looking for user with ID:', userId);
      const user = mockUsers.find(u => u.id === userId);
      
      if (user) {
        // Return user with proper profile structure
        return {
          ...user,
          userId: user.id,
          profilePhoto: user.photos[0]?.url,
        };
      }
      
      console.warn(`[MOCK API] User not found with ID: ${userId}. Available IDs:`, mockUsers.map(u => u.id));
      
      // Return a default/placeholder user instead of throwing error
      return {
        id: userId,
        userId: userId,
        username: `user_${userId}`,
        email: `user${userId}@example.com`,
        firstName: 'Unknown',
        lastName: 'User',
        age: 25,
        gender: 'other',
        sexualPreference: 'bisexual',
        biography: 'This user profile is not available.',
        interests: [],
        photos: [],
        profilePhoto: null,
        location: { lat: 40.7128, lng: -74.0060 },
        fameRating: 0,
        isOnline: false,
        lastSeen: new Date().toISOString(),
      };
    }
    
    if (endpoint === '/profiles/photos' && method === 'POST') {
      return { 
        success: true, 
        photoUrl: `https://picsum.photos/seed/${Date.now()}/400/400`,
        message: 'Photo uploaded successfully' 
      };
    }
    
    if (endpoint.startsWith('/browse/suggestions')) {
      return mockUsers
        .filter(u => u.id !== this.currentUser.id)
        .map(u => ({
          ...u,
          userId: u.id,  // Add userId field for compatibility
          profilePhoto: u.photos[0]?.url,
        }));
    }
    
    if (endpoint.startsWith('/search')) {
      return mockUsers
        .filter(u => u.id !== this.currentUser.id)
        .map(u => ({
          ...u,
          userId: u.id,  // Add userId field for compatibility
          profilePhoto: u.photos[0]?.url,
        }));
    }
    
    if (endpoint.match(/^\/interactions\/like\/(.+)$/) && method === 'POST') {
      const userId = endpoint.split('/').pop();
      if (!userId || userId === 'undefined') {
        throw new Error('Invalid user ID for like action');
      }
      return { success: true, message: 'Profile liked' };
    }
    
    if (endpoint.match(/^\/interactions\/unlike\/(.+)$/) && method === 'POST') {
      const userId = endpoint.split('/').pop();
      if (!userId || userId === 'undefined') {
        throw new Error('Invalid user ID for unlike action');
      }
      return { success: true, message: 'Profile unliked' };
    }
    
    if (endpoint.match(/^\/interactions\/block\/(.+)$/) && method === 'POST') {
      const userId = endpoint.split('/').pop();
      if (!userId || userId === 'undefined') {
        throw new Error('Invalid user ID for block action');
      }
      return { success: true, message: 'User blocked' };
    }
    
    if (endpoint.match(/^\/interactions\/report\/(.+)$/) && method === 'POST') {
      const userId = endpoint.split('/').pop();
      if (!userId || userId === 'undefined') {
        throw new Error('Invalid user ID for report action');
      }
      return { success: true, message: 'User reported' };
    }
    
    // Chat endpoints
    if (endpoint === '/chat/conversations') {
      return mockConversations;
    }
    
    if (endpoint.match(/^\/chat\/messages\/\d+$/)) {
      if (method === 'GET') {
        return mockMessages;
      }
      if (method === 'POST') {
        const body = JSON.parse(options.body as string);
        const newMessage = {
          id: String(mockMessages.length + 1),
          senderId: this.currentUser.id,
          receiverId: endpoint.split('/').pop()!,
          message: body.message,
          timestamp: new Date().toISOString(),
        };
        mockMessages.push(newMessage);
        return newMessage;
      }
    }
    
    if (endpoint === '/notifications') {
      return this.notifications;
    }
    
    if (endpoint.match(/^\/notifications\/\d+\/read$/) && method === 'POST') {
      const notificationId = endpoint.split('/')[2];
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        this.saveNotifications(); // Persist the change
        return { success: true };
      }
      throw new Error('Notification not found');
    }
    
    if (endpoint === '/stats/views') {
      return [
        { userId: '2', user: mockUsers[1], timestamp: new Date(Date.now() - 1800000).toISOString() },
        { userId: '3', user: mockUsers[2], timestamp: new Date(Date.now() - 3600000).toISOString() },
      ];
    }
    
    if (endpoint === '/stats/likes') {
      return [
        { userId: '2', user: mockUsers[1], timestamp: new Date(Date.now() - 1800000).toISOString() },
      ];
    }
    
    throw new Error(`Endpoint not found: ${endpoint}`);
  }

  async register(data: {username: string, email: string, firstName: string, lastName: string, password: string}) {
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
    if (response && typeof response === 'object' && 'token' in response) {
      this.setToken((response as { token: string }).token);
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

  async updateProfile(data: Record<string, unknown>) {
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
}
