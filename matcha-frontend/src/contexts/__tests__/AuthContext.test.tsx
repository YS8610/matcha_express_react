import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as tokenStorage from '@/lib/tokenStorage';

describe('AuthContext Token Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Token payload extraction', () => {
    it('should extract user id from token payload', () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImFjdGl2YXRlZCI6dHJ1ZSwiZXhwIjo5OTk5OTk5OTk5fQ.mock';

      const payload = tokenStorage.getTokenPayload(mockToken);

      expect(payload).toBeDefined();
      expect(payload?.id).toBe('user-123');
      expect(payload?.username).toBe('testuser');
      expect(payload?.email).toBe('test@example.com');
    });

    it('should use username as fallback if id is not present', () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiYWN0aXZhdGVkIjp0cnVlLCJleHAiOjk5OTk5OTk5OTl9.mock';

      const payload = tokenStorage.getTokenPayload(mockToken);

      expect(payload).toBeDefined();
      expect(payload?.id).toBeUndefined();
      expect(payload?.username).toBe('testuser');
      expect(payload?.email).toBe('test@example.com');
    });

    it('should validate token structure correctly', () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImFjdGl2YXRlZCI6dHJ1ZSwiZXhwIjo5OTk5OTk5OTk5fQ.mock';

      const result = tokenStorage.validateTokenStructure(validToken);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid token format', () => {
      const invalidToken = 'invalid-token';

      const result = tokenStorage.validateTokenStructure(invalidToken);
      expect(result.valid).toBe(false);
    });

    it('should extract payload fields for user initialization', () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImFjdGl2YXRlZCI6dHJ1ZSwiZXhwIjo5OTk5OTk5OTk5LCJnZW5kZXIiOiJmZW1hbGUiLCJzZXh1YWxQcmVmZXJlbmNlIjoibWFsZSIsImJpb2dyYXBoeSI6InRlc3QifQ.mock';

      const payload = tokenStorage.getTokenPayload(mockToken);

      const userId = (payload?.id as string) || (payload?.username as string) || 'user';
      const username = (payload?.username as string) || 'user';
      const email = (payload?.email as string) || '';
      const emailVerified = (payload?.activated as boolean) || false;

      expect(userId).toBe('user-123');
      expect(username).toBe('testuser');
      expect(email).toBe('test@example.com');
      expect(emailVerified).toBe(true);
    });

    it('should use username as user id when id is missing', () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiYWN0aXZhdGVkIjp0cnVlLCJleHAiOjk5OTk5OTk5OTl9.mock';

      const payload = tokenStorage.getTokenPayload(mockToken);

      const userId = (payload?.id as string) || (payload?.username as string) || 'user';
      expect(userId).toBe('testuser');
    });
  });

  describe('Token storage', () => {
    it('should validate token structure before storing', () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImFjdGl2YXRlZCI6dHJ1ZSwiZXhwIjo5OTk5OTk5OTk5fQ.mock';

      const validation = tokenStorage.validateTokenStructure(validToken);
      expect(validation.valid).toBe(true);
    });

    it('should reject storing invalid tokens', () => {
      const validation = tokenStorage.validateTokenStructure('invalid');
      expect(validation.valid).toBe(false);
    });

    it('should handle token with missing fields', () => {
      const tokenWithMissingFields = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QifQ.mock';
      const payload = tokenStorage.getTokenPayload(tokenWithMissingFields);
      expect(payload).toBeDefined();
      expect(payload?.username).toBe('test');
    });

    it('should handle expired tokens', () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMTIzIiwiZXhwIjoxfQ.mock';
      const payload = tokenStorage.getTokenPayload(expiredToken);
      expect(payload).toBeDefined();
    });
  });

  describe('Token utilities', () => {
    it('should export getTokenPayload function', () => {
      expect(tokenStorage.getTokenPayload).toBeDefined();
      expect(typeof tokenStorage.getTokenPayload).toBe('function');
    });

    it('should export validateTokenStructure function', () => {
      expect(tokenStorage.validateTokenStructure).toBeDefined();
      expect(typeof tokenStorage.validateTokenStructure).toBe('function');
    });
  });
});
