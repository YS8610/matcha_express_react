import { describe, it, expect, beforeEach, vi } from 'vitest';
import type {
  User,
  Profile,
  Message,
  ChatMessage,
  Conversation,
  Notification,
  SearchFilters,
  RegisterData,
  LoginRequest,
  ApiResponse,
  Theme,
  Socket,
  TokenPayload,
  ProfileViewed,
  UserPhotosResponse,
  UserTagsResponse,
  ChatHistoryResponse,
} from '@/types/index';

describe('Types', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('User Type', () => {
    it('should have User type with required fields', () => {
      const user: User = {
        id: 'test-id',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: true,
        profileComplete: true,
        lastSeen: new Date(),
        isOnline: true,
      };
      expect(user.id).toBeDefined();
      expect(user.username).toBeDefined();
      expect(user.email).toBeDefined();
    });

    it('should allow optional User fields', () => {
      const user: User = {
        id: 'test-id',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: true,
        profileComplete: false,
        lastSeen: new Date(),
        isOnline: false,
        latitude: 40.7128,
        longitude: -74.006,
        birthDate: '1990-01-01',
        lastOnline: 1640000000,
      };
      expect(user.latitude).toBeDefined();
      expect(user.longitude).toBeDefined();
    });
  });

  describe('Profile Type', () => {
    it('should have Profile type with required fields', () => {
      const profile: Profile = {
        id: 'profile-id',
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        gender: 1,
        sexualPreference: 1,
        biography: 'Test bio',
        birthDate: '1990-01-01',
        fameRating: 100,
        photo0: 'photo0.jpg',
        photo1: 'photo1.jpg',
        photo2: 'photo2.jpg',
        photo3: 'photo3.jpg',
        photo4: 'photo4.jpg',
        lastOnline: 1640000000,
      };
      expect(profile.id).toBeDefined();
      expect(profile.username).toBeDefined();
      expect(profile.biography).toBeDefined();
    });
  });

  describe('Message Types', () => {
    it('should have Message type', () => {
      const message: Message = {
        id: 'msg-id',
        fromUserId: 'user1',
        toUserId: 'user2',
        content: 'Hello',
        createdAt: new Date(),
        read: false,
      };
      expect(message.fromUserId).toBeDefined();
      expect(message.content).toBeDefined();
    });

    it('should have ChatMessage type', () => {
      const chatMsg: ChatMessage = {
        fromUserId: 'user1',
        toUserId: 'user2',
        content: 'Hello',
        timestamp: Date.now(),
      };
      expect(chatMsg.content).toBeDefined();
      expect(typeof chatMsg.timestamp).toBe('number');
    });
  });

  describe('Notification Type', () => {
    it('should have Notification with valid types', () => {
      const notification: Notification = {
        id: 'notif-id',
        userId: 'user-id',
        type: 'like',
        message: 'User liked your profile',
        read: false,
        createdAt: Date.now(),
      };
      expect(['like', 'view', 'message', 'match', 'unlike']).toContain(
        notification.type
      );
    });
  });

  describe('API Response Type', () => {
    it('should support generic ApiResponse', () => {
      const response: ApiResponse<User> = {
        msg: 'Success',
        data: {
          id: 'user-id',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          emailVerified: true,
          profileComplete: true,
          lastSeen: new Date(),
          isOnline: true,
        },
      };
      expect(response.data?.username).toBe('testuser');
    });
  });

  describe('Theme Type', () => {
    it('should support light and dark themes', () => {
      const lightTheme: Theme = 'light';
      const darkTheme: Theme = 'dark';
      expect(['light', 'dark']).toContain(lightTheme);
      expect(['light', 'dark']).toContain(darkTheme);
    });
  });

  describe('TokenPayload Type', () => {
    it('should have TokenPayload with user identity', () => {
      const token: TokenPayload = {
        id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
        activated: true,
      };
      expect(token.id).toBeDefined();
      expect(token.username).toBeDefined();
    });

    it('should support optional token fields', () => {
      const token: TokenPayload = {
        id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
        activated: true,
        iat: 1640000000,
        exp: 1640086400,
        nbf: 1640000000,
      };
      expect(token.iat).toBeDefined();
      expect(token.exp).toBeDefined();
    });
  });

  describe('Search and Filter Types', () => {
    it('should have SearchFilters with optional criteria', () => {
      const filters: SearchFilters = {
        ageMin: 18,
        ageMax: 65,
        distanceMax: 50,
        fameMin: 20,
      };
      expect(filters.ageMin).toBe(18);
      expect(filters.distanceMax).toBe(50);
    });

    it('should allow RegisterData with passwords', () => {
      const regData: RegisterData = {
        username: 'newuser',
        email: 'new@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        birthDate: '1995-05-15',
        password: 'SecurePass123!',
        password2: 'SecurePass123!',
      };
      expect(regData.username).toBeDefined();
      expect(regData.password).toBeDefined();
    });
  });

  describe('Response Types', () => {
    it('should have UserPhotosResponse', () => {
      const photoResponse: UserPhotosResponse = {
        photoNames: ['photo1.jpg', 'photo2.jpg'],
      };
      expect(Array.isArray(photoResponse.photoNames)).toBe(true);
    });

    it('should have UserTagsResponse', () => {
      const tagResponse: UserTagsResponse = {
        tags: ['gaming', 'reading', 'hiking'],
      };
      expect(Array.isArray(tagResponse.tags)).toBe(true);
    });

    it('should have ChatHistoryResponse', () => {
      const chatHistory: ChatHistoryResponse = {
        data: [
          {
            fromUserId: 'user1',
            toUserId: 'user2',
            content: 'Hello',
            timestamp: Date.now(),
          },
        ],
      };
      expect(Array.isArray(chatHistory.data)).toBe(true);
    });
  });
});
