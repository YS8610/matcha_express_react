import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  storeToken,
  getToken,
  clearToken,
  getTokenPayload,
  validateTokenStructure,
} from '@/lib/tokenStorage';

const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiYWN0aXZhdGVkIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6OTk5OTk5OTk5OX0.mock';

describe('Token Storage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear?.();
  });

  describe('storeToken', () => {
    it('should store token in localStorage', () => {
      storeToken(mockToken);

      expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
    });
  });

  describe('getToken', () => {
    it('should retrieve token from localStorage', () => {
      (localStorage.getItem as jest.Mock).mockReturnValueOnce(mockToken);

      const token = getToken();

      expect(localStorage.getItem).toHaveBeenCalledWith('token');
      expect(token).toBe(mockToken);
    });

    it('should return null if no token is stored', () => {
      (localStorage.getItem as jest.Mock).mockReturnValueOnce(null);

      const token = getToken();

      expect(token).toBeNull();
    });
  });

  describe('clearToken', () => {
    it('should remove token from localStorage', () => {
      clearToken();

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('validateTokenStructure', () => {
    it('should return invalid for empty token', () => {
      const result = validateTokenStructure('');

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Token is empty');
    });

    it('should return invalid for malformed token', () => {
      const result = validateTokenStructure('invalid-token');

      expect(result.valid).toBe(false);
    });

    it('should return valid for properly formatted token', () => {
      const result = validateTokenStructure(mockToken);

      expect(result.valid).toBe(true);
    });
  });

  describe('getTokenPayload', () => {
    it('should extract payload from token', () => {
      const payload = getTokenPayload(mockToken);

      expect(payload).toBeDefined();
      expect(payload?.email).toBe('test@example.com');
      expect(payload?.username).toBe('testuser');
    });

    it('should return null for invalid token', () => {
      const payload = getTokenPayload('invalid-token');

      expect(payload).toBeNull();
    });

    it('should exclude standard JWT claims from payload', () => {
      const payload = getTokenPayload(mockToken);

      expect(payload).not.toHaveProperty('iat');
      expect(payload).not.toHaveProperty('exp');
      expect(payload).not.toHaveProperty('nbf');
    });
  });
});
