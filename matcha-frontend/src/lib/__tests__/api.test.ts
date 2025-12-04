import { describe, it, expect, beforeEach, vi } from 'vitest';
import { api } from '@/lib/api';
import * as tokenStorage from '@/lib/tokenStorage';

type MockFetch = ReturnType<typeof vi.fn>;

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('request method', () => {
    it('should make a GET request with proper headers', async () => {
      const mockResponse = { data: 'test' };
      (global.fetch as MockFetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.request('/api/test');

      expect(global.fetch).toHaveBeenCalled();
      const call = (global.fetch as MockFetch).mock.calls[0];
      expect(call[0]).toContain('/api/test');
      expect(call[1].headers).toHaveProperty('Content-Type', 'application/json');
      expect(result).toEqual(mockResponse);
    });

    it('should include Authorization header when token is present', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlciIsImV4cCI6OTk5OTk5OTk5OX0.mock';
      vi.spyOn(tokenStorage, 'getToken').mockReturnValue(token);

      const mockResponse = { data: 'test' };
      (global.fetch as MockFetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(mockResponse),
      });

      await api.request('/api/test');

      expect(global.fetch).toHaveBeenCalled();
      const call = (global.fetch as MockFetch).mock.calls[0];
      expect(call[1].headers['Authorization']).toBe(`Bearer ${token}`);
    });

    it('should handle JSON error responses', async () => {
      (global.fetch as MockFetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ message: 'Bad request' }),
      });

      await expect(api.request('/api/test')).rejects.toThrow('Bad request');
    });

    it('should handle 401 unauthorized responses', async () => {
      localStorage.getItem = vi.fn().mockReturnValueOnce('test-token');
      localStorage.removeItem = vi.fn();

      (global.fetch as MockFetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ message: 'Unauthorized' }),
      });

      await expect(api.request('/api/test')).rejects.toThrow();
      expect(localStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should send registration data with correct fields', async () => {
      (global.fetch as MockFetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ msg: 'success' }),
      });

      const registerData = {
        email: 'test@example.com',
        password: 'password123',
        password2: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        birthDate: '1990-01-01',
      };

      await api.register(registerData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/pubapi/register'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: registerData.email,
            pw: registerData.password,
            pw2: registerData.password2,
            firstName: registerData.firstName,
            lastName: registerData.lastName,
            username: registerData.username,
            birthDate: registerData.birthDate,
          }),
        })
      );
    });
  });

  describe('login', () => {
    it('should send login credentials and store token', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiYWN0aXZhdGVkIjp0cnVlLCJleHAiOjk5OTk5OTk5OTl9.mock';
      const storeTokenSpy = vi.spyOn(tokenStorage, 'storeToken').mockReturnValue(true);

      (global.fetch as MockFetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ msg: token }),
      });

      const credentials = { username: 'testuser', password: 'password123' };
      const result = await api.login(credentials);

      expect(global.fetch).toHaveBeenCalled();
      const call = (global.fetch as MockFetch).mock.calls[0];
      expect(call[0]).toContain('/pubapi/login');
      expect(call[1].method).toBe('POST');
      expect(storeTokenSpy).toHaveBeenCalledWith(token);
    });
  });

  describe('likeUser', () => {
    it('should send POST request with userid', async () => {
      (global.fetch as MockFetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ msg: 'success' }),
      });

      await api.likeUser('user-id-123');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/user/liked'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ userid: 'user-id-123' }),
        })
      );
    });
  });

  describe('blockUser', () => {
    it('should send POST request with userId', async () => {
      (global.fetch as MockFetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ msg: 'success' }),
      });

      await api.blockUser('user-id-123');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/user/block'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ userId: 'user-id-123' }),
        })
      );
    });
  });

  describe('getChatHistory', () => {
    it('should request chat history with correct parameters', async () => {
      (global.fetch as MockFetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ data: { data: [] } }),
      });

      await api.getChatHistory('user-id-123', 50, 0);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/user/chat?limit=50&skipno=0'),
        expect.objectContaining({
          method: 'GET',
          body: JSON.stringify({ otherid: 'user-id-123' }),
        })
      );
    });
  });

  describe('updateUserLocation', () => {
    it('should send location data with latitude and longitude', async () => {
      (global.fetch as MockFetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ msg: 'success' }),
      });

      await api.updateUserLocation(37.7749, -122.4194);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/user/location'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ latitude: 37.7749, longitude: -122.4194 }),
        })
      );
    });
  });
});

describe('API Response Handling', () => {
  interface ApiResponse<T> {
    data?: T;
    msg?: string;
    message?: string;
    errors?: Array<{ message: string }>;
    status?: number;
  }

  describe('Response parsing', () => {
    const parseApiResponse = <T,>(response: ApiResponse<T>): T | null => {
      if (response.data) {
        return response.data;
      }
      return null;
    };

    it('should extract data from response', () => {
      const response: ApiResponse<{ id: string; name: string }> = {
        data: { id: '123', name: 'Test' },
      };

      const result = parseApiResponse(response);
      expect(result).toEqual({ id: '123', name: 'Test' });
    });

    it('should return null if no data', () => {
      const response: ApiResponse<{ id: string }> = {
        msg: 'Success',
      };

      const result = parseApiResponse(response);
      expect(result).toBeNull();
    });
  });

  describe('Error handling', () => {
    const getErrorMessage = (response: ApiResponse<any>): string => {
      if (response.message) return response.message;
      if (response.msg) return response.msg;
      if (response.errors && response.errors.length > 0) {
        return response.errors[0].message;
      }
      return 'An unknown error occurred';
    };

    it('should extract message from response', () => {
      const response: ApiResponse<any> = {
        message: 'User not found',
      };

      expect(getErrorMessage(response)).toBe('User not found');
    });

    it('should extract msg field if message missing', () => {
      const response: ApiResponse<any> = {
        msg: 'Success message',
      };

      expect(getErrorMessage(response)).toBe('Success message');
    });

    it('should extract first error from errors array', () => {
      const response: ApiResponse<any> = {
        errors: [
          { message: 'First error' },
          { message: 'Second error' },
        ],
      };

      expect(getErrorMessage(response)).toBe('First error');
    });

    it('should return default message if none available', () => {
      const response: ApiResponse<any> = {};

      expect(getErrorMessage(response)).toBe('An unknown error occurred');
    });
  });

  describe('Data validation', () => {
    interface User {
      id: string;
      email: string;
      username: string;
    }

    const isValidUser = (data: any): data is User => {
      return (
        data !== null &&
        typeof data === 'object' &&
        typeof data.id === 'string' &&
        typeof data.email === 'string' &&
        typeof data.username === 'string'
      );
    };

    it('should validate correct user object', () => {
      const user = {
        id: '123',
        email: 'test@example.com',
        username: 'testuser',
      };

      expect(isValidUser(user)).toBe(true);
    });

    it('should reject object missing id', () => {
      const user = {
        email: 'test@example.com',
        username: 'testuser',
      };

      expect(isValidUser(user)).toBe(false);
    });

    it('should reject object with wrong type for email', () => {
      const user = {
        id: '123',
        email: 123,
        username: 'testuser',
      };

      expect(isValidUser(user)).toBe(false);
    });

    it('should reject null', () => {
      expect(isValidUser(null)).toBe(false);
    });
  });

  describe('Response array handling', () => {
    interface ProfileShort {
      id: string;
      username: string;
      distance?: number;
    }

    const parseProfileList = (
      response: ApiResponse<ProfileShort[]>
    ): ProfileShort[] => {
      return response.data || [];
    };

    it('should parse profile list', () => {
      const response: ApiResponse<ProfileShort[]> = {
        data: [
          { id: '1', username: 'user1' },
          { id: '2', username: 'user2' },
        ],
      };

      const profiles = parseProfileList(response);
      expect(profiles).toHaveLength(2);
      expect(profiles[0].username).toBe('user1');
    });

    it('should return empty array if no data', () => {
      const response: ApiResponse<ProfileShort[]> = {};

      const profiles = parseProfileList(response);
      expect(profiles).toEqual([]);
    });

    it('should handle profiles with optional distance field', () => {
      const response: ApiResponse<ProfileShort[]> = {
        data: [
          { id: '1', username: 'user1', distance: 5.5 },
          { id: '2', username: 'user2', distance: 12.3 },
        ],
      };

      const profiles = parseProfileList(response);
      expect(profiles[0].distance).toBe(5.5);
      expect(profiles[1].distance).toBe(12.3);
    });
  });

  describe('Pagination handling', () => {
    interface PaginatedResponse<T> extends ApiResponse<T> {
      limit?: number;
      offset?: number;
      total?: number;
    }

    const calculatePages = (
      response: PaginatedResponse<any[]>
    ): { current: number; total: number } => {
      const limit = response.limit || 10;
      const offset = response.offset || 0;
      const total = response.total || 0;

      return {
        current: Math.floor(offset / limit) + 1,
        total: Math.ceil(total / limit),
      };
    };

    it('should calculate correct page numbers', () => {
      const response: PaginatedResponse<any[]> = {
        data: [],
        limit: 10,
        offset: 20,
        total: 100,
      };

      const pages = calculatePages(response);
      expect(pages.current).toBe(3);
      expect(pages.total).toBe(10);
    });

    it('should default to first page if offset is 0', () => {
      const response: PaginatedResponse<any[]> = {
        data: [],
        limit: 10,
        offset: 0,
        total: 50,
      };

      const pages = calculatePages(response);
      expect(pages.current).toBe(1);
      expect(pages.total).toBe(5);
    });

    it('should handle fractional pages correctly', () => {
      const response: PaginatedResponse<any[]> = {
        data: [],
        limit: 10,
        offset: 0,
        total: 25,
      };

      const pages = calculatePages(response);
      expect(pages.total).toBe(3);
    });
  });

  describe('Token response handling', () => {
    interface LoginResponse {
      msg: string;
    }

    const extractToken = (response: LoginResponse): string | null => {
      return response.msg && response.msg.includes('.') ? response.msg : null;
    };

    it('should extract JWT token from response', () => {
      const response: LoginResponse = {
        msg: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature',
      };

      const token = extractToken(response);
      expect(token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature');
    });

    it('should return null if not a valid token format', () => {
      const response: LoginResponse = {
        msg: 'Invalid token',
      };

      const token = extractToken(response);
      expect(token).toBeNull();
    });
  });
});
