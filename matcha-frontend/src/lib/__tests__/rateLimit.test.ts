import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { isRateLimited, resetRateLimit, getRemainingAttempts, getResetTime } from '@/lib/rateLimit';

describe('Rate Limit Utilities', () => {
  const testKey = 'test-key';

  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimit(testKey);
  });

  afterEach(() => {
    resetRateLimit(testKey);
  });

  describe('Function Exports', () => {
    it('should export isRateLimited function', () => {
      expect(isRateLimited).toBeDefined();
      expect(typeof isRateLimited).toBe('function');
    });

    it('should export resetRateLimit function', () => {
      expect(resetRateLimit).toBeDefined();
      expect(typeof resetRateLimit).toBe('function');
    });

    it('should export getRemainingAttempts function', () => {
      expect(getRemainingAttempts).toBeDefined();
      expect(typeof getRemainingAttempts).toBe('function');
    });

    it('should export getResetTime function', () => {
      expect(getResetTime).toBeDefined();
      expect(typeof getResetTime).toBe('function');
    });
  });

  describe('isRateLimited', () => {
    it('should return false on first attempt', () => {
      expect(isRateLimited(testKey)).toBe(false);
    });

    it('should return false within limit', () => {
      isRateLimited(testKey);
      isRateLimited(testKey);
      isRateLimited(testKey);
      expect(isRateLimited(testKey)).toBe(false);
    });

    it('should return true when limit exceeded', () => {
      for (let i = 0; i < 5; i++) {
        isRateLimited(testKey);
      }
      expect(isRateLimited(testKey)).toBe(true);
    });

    it('should respect custom max attempts', () => {
      const maxAttempts = 3;
      for (let i = 0; i < maxAttempts; i++) {
        expect(isRateLimited(testKey, maxAttempts)).toBe(false);
      }
      expect(isRateLimited(testKey, maxAttempts)).toBe(true);
    });

    it('should handle different keys independently', () => {
      const key1 = 'key1';
      const key2 = 'key2';

      for (let i = 0; i < 5; i++) {
        isRateLimited(key1);
      }

      expect(isRateLimited(key1)).toBe(true);
      expect(isRateLimited(key2)).toBe(false);

      resetRateLimit(key1);
      resetRateLimit(key2);
    });

    it('should reset after window expires', () => {
      vi.useFakeTimers();
      const windowMs = 1000;

      for (let i = 0; i < 5; i++) {
        isRateLimited(testKey, 5, windowMs);
      }
      expect(isRateLimited(testKey, 5, windowMs)).toBe(true);

      vi.advanceTimersByTime(windowMs + 1);
      expect(isRateLimited(testKey, 5, windowMs)).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('resetRateLimit', () => {
    it('should reset rate limit for a key', () => {
      for (let i = 0; i < 5; i++) {
        isRateLimited(testKey);
      }
      expect(isRateLimited(testKey)).toBe(true);

      resetRateLimit(testKey);
      expect(isRateLimited(testKey)).toBe(false);
    });

    it('should not affect other keys', () => {
      const key1 = 'key1';
      const key2 = 'key2';

      for (let i = 0; i < 5; i++) {
        isRateLimited(key1);
        isRateLimited(key2);
      }

      resetRateLimit(key1);
      expect(isRateLimited(key1)).toBe(false);
      expect(isRateLimited(key2)).toBe(true);

      resetRateLimit(key2);
    });
  });

  describe('getRemainingAttempts', () => {
    it('should return max attempts for new key', () => {
      expect(getRemainingAttempts(testKey, 5)).toBe(5);
    });

    it('should decrease remaining attempts', () => {
      isRateLimited(testKey, 5);
      expect(getRemainingAttempts(testKey, 5)).toBe(4);

      isRateLimited(testKey, 5);
      expect(getRemainingAttempts(testKey, 5)).toBe(3);
    });

    it('should return 0 when limit exceeded', () => {
      for (let i = 0; i < 5; i++) {
        isRateLimited(testKey, 5);
      }
      expect(getRemainingAttempts(testKey, 5)).toBe(0);
    });

    it('should reset to max after window expires', () => {
      vi.useFakeTimers();
      const windowMs = 1000;

      isRateLimited(testKey, 5, windowMs);
      expect(getRemainingAttempts(testKey, 5)).toBe(4);

      vi.advanceTimersByTime(windowMs + 1);
      expect(getRemainingAttempts(testKey, 5)).toBe(5);

      vi.useRealTimers();
    });
  });

  describe('getResetTime', () => {
    it('should return null for new key', () => {
      expect(getResetTime(testKey)).toBe(null);
    });

    it('should return time remaining', () => {
      vi.useFakeTimers();
      const windowMs = 5000;

      isRateLimited(testKey, 5, windowMs);
      const resetTime = getResetTime(testKey);

      expect(resetTime).toBeGreaterThan(0);
      expect(resetTime).toBeLessThanOrEqual(windowMs);

      vi.useRealTimers();
    });

    it('should return null after window expires', () => {
      vi.useFakeTimers();
      const windowMs = 1000;

      isRateLimited(testKey, 5, windowMs);
      vi.advanceTimersByTime(windowMs + 1);

      expect(getResetTime(testKey)).toBe(null);

      vi.useRealTimers();
    });
  });
});
