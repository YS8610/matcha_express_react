import { describe, it, expect, beforeEach } from 'vitest';
import { clearLocationCache } from '../geolocation';

describe('geolocation', () => {
  beforeEach(() => {
    clearLocationCache();
  });

  describe('clearLocationCache', () => {
    it('should be a function', () => {
      expect(typeof clearLocationCache).toBe('function');
    });

    it('should execute without throwing errors', () => {
      expect(() => clearLocationCache()).not.toThrow();
    });

    it('should be callable multiple times', () => {
      clearLocationCache();
      clearLocationCache();
      clearLocationCache();
      expect(() => clearLocationCache()).not.toThrow();
    });

    it('should return undefined', () => {
      const result = clearLocationCache();
      expect(result).toBeUndefined();
    });

    it('should be idempotent', () => {
      const result1 = clearLocationCache();
      const result2 = clearLocationCache();
      const result3 = clearLocationCache();

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });

  describe('module structure', () => {
    it('should export clearLocationCache function', () => {
      expect(clearLocationCache).toBeDefined();
    });
  });
});
