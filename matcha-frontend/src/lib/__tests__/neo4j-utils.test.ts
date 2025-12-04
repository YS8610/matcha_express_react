import { describe, it, expect } from 'vitest';
import {
  toNumber,
  toGenderString,
  toSexualPreferenceString,
  toDateString,
  getLastSeenString,
} from '@/lib/neo4j-utils';
import type { Neo4jInteger, Neo4jDate } from '@/types';

describe('Neo4j Utilities', () => {
  describe('toNumber', () => {
    it('should return null for null input', () => {
      expect(toNumber(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(toNumber(undefined)).toBeNull();
    });

    it('should return the same number if input is already a number', () => {
      expect(toNumber(42)).toBe(42);
      expect(toNumber(0)).toBe(0);
      expect(toNumber(-10)).toBe(-10);
    });

    it('should extract low value from Neo4jInteger', () => {
      const neo4jInt: Neo4jInteger = { low: 123, high: 0 };
      expect(toNumber(neo4jInt)).toBe(123);
    });

    it('should return null for non-integer objects', () => {
      expect(toNumber({})).toBeNull();
      expect(toNumber({ value: 42 })).toBeNull();
    });

    it('should return null for strings', () => {
      expect(toNumber('123')).toBeNull();
    });
  });

  describe('toGenderString', () => {
    it('should return "Other" for gender 0', () => {
      expect(toGenderString(0)).toBe('Other');
    });

    it('should return "Male" for gender 1', () => {
      expect(toGenderString(1)).toBe('Male');
    });

    it('should return "Female" for gender 2', () => {
      expect(toGenderString(2)).toBe('Female');
    });

    it('should return "Not set" for unknown gender numbers', () => {
      expect(toGenderString(99)).toBe('Not set');
    });

    it('should return "Not set" for null', () => {
      expect(toGenderString(null)).toBe('Not set');
    });

    it('should handle Neo4jInteger input', () => {
      const neo4jInt: Neo4jInteger = { low: 1, high: 0 };
      expect(toGenderString(neo4jInt)).toBe('Male');
    });
  });

  describe('toSexualPreferenceString', () => {
    it('should return "Male" for preference 1', () => {
      expect(toSexualPreferenceString(1)).toBe('Male');
    });

    it('should return "Female" for preference 2', () => {
      expect(toSexualPreferenceString(2)).toBe('Female');
    });

    it('should return "Both" for preference 3', () => {
      expect(toSexualPreferenceString(3)).toBe('Both');
    });

    it('should return "Not set" for unknown preference numbers', () => {
      expect(toSexualPreferenceString(99)).toBe('Not set');
    });

    it('should return "Not set" for null', () => {
      expect(toSexualPreferenceString(null)).toBe('Not set');
    });

    it('should handle Neo4jInteger input', () => {
      const neo4jInt: Neo4jInteger = { low: 3, high: 0 };
      expect(toSexualPreferenceString(neo4jInt)).toBe('Both');
    });
  });

  describe('toDateString', () => {
    it('should return empty string for null/undefined', () => {
      expect(toDateString(null)).toBe('');
      expect(toDateString(undefined)).toBe('');
    });

    it('should return string dates as-is', () => {
      const dateString = '2024-01-15';
      expect(toDateString(dateString)).toBe(dateString);
    });

    it('should convert Neo4jDate with number fields', () => {
      const date: Neo4jDate = {
        year: 2024,
        month: 1,
        day: 15,
      };
      expect(toDateString(date)).toBe('2024-01-15');
    });

    it('should convert Neo4jDate with Neo4jInteger fields', () => {
      const date: Neo4jDate = {
        year: { low: 2024, high: 0 },
        month: { low: 12, high: 0 },
        day: { low: 25, high: 0 },
      };
      expect(toDateString(date)).toBe('2024-12-25');
    });

    it('should pad single digit months and days', () => {
      const date: Neo4jDate = {
        year: 2024,
        month: 1,
        day: 5,
      };
      expect(toDateString(date)).toBe('2024-01-05');
    });

    it('should return empty string if date fields are missing', () => {
      const date: Neo4jDate = {
        year: 2024,
        month: 1,
        day: 0,
      };
      expect(toDateString(date)).toBe('');
    });

    it('should return empty string for empty string input', () => {
      expect(toDateString('')).toBe('');
    });
  });

  describe('getLastSeenString', () => {
    it('should return "Never" for null/undefined', () => {
      expect(getLastSeenString(null)).toBe('Never');
      expect(getLastSeenString(undefined)).toBe('Never');
    });

    it('should return "Now" for future timestamps', () => {
      const futureTime = Date.now() + 10000;
      expect(getLastSeenString(futureTime)).toBe('Now');
    });

    it('should return "Just now" for timestamps less than 60 seconds ago', () => {
      const time = Date.now() - 30000;
      expect(getLastSeenString(time)).toBe('Just now');
    });

    it('should return "1 minute ago" for timestamps about 60 seconds ago', () => {
      const time = Date.now() - 60000;
      expect(getLastSeenString(time)).toBe('1 minute ago');
    });

    it('should return "X minutes ago" for timestamps less than 1 hour ago', () => {
      const time = Date.now() - 5 * 60 * 1000;
      expect(getLastSeenString(time)).toBe('5 minutes ago');
    });

    it('should return "1 hour ago" for timestamps about 1 hour ago', () => {
      const time = Date.now() - 60 * 60 * 1000;
      expect(getLastSeenString(time)).toBe('1 hour ago');
    });

    it('should return "X hours ago" for timestamps less than 24 hours ago', () => {
      const time = Date.now() - 5 * 60 * 60 * 1000;
      expect(getLastSeenString(time)).toBe('5 hours ago');
    });

    it('should return "1 day ago" for timestamps about 1 day ago', () => {
      const time = Date.now() - 24 * 60 * 60 * 1000;
      expect(getLastSeenString(time)).toBe('1 day ago');
    });

    it('should return "X days ago" for timestamps less than 7 days ago', () => {
      const time = Date.now() - 5 * 24 * 60 * 60 * 1000;
      expect(getLastSeenString(time)).toBe('5 days ago');
    });

    it('should return "1 week ago" for timestamps about 7 days ago', () => {
      const time = Date.now() - 7 * 24 * 60 * 60 * 1000;
      expect(getLastSeenString(time)).toBe('1 week ago');
    });

    it('should return "X weeks ago" for timestamps less than 30 days ago', () => {
      const time = Date.now() - 14 * 24 * 60 * 60 * 1000;
      expect(getLastSeenString(time)).toBe('2 weeks ago');
    });

    it('should return "1 month ago" for timestamps about 30 days ago', () => {
      const time = Date.now() - 30 * 24 * 60 * 60 * 1000;
      expect(getLastSeenString(time)).toBe('1 month ago');
    });

    it('should return "X months ago" for timestamps less than 365 days ago', () => {
      const time = Date.now() - 60 * 24 * 60 * 60 * 1000;
      expect(getLastSeenString(time)).toBe('2 months ago');
    });

    it('should return "1 year ago" for timestamps about 365 days ago', () => {
      const time = Date.now() - 365 * 24 * 60 * 60 * 1000;
      expect(getLastSeenString(time)).toBe('1 year ago');
    });

    it('should return "X years ago" for timestamps more than 365 days ago', () => {
      const time = Date.now() - 730 * 24 * 60 * 60 * 1000;
      expect(getLastSeenString(time)).toBe('2 years ago');
    });

    it('should handle Neo4jInteger timestamps', () => {
      const neo4jTime: Neo4jInteger = { low: Date.now() - 60000, high: 0 };
      expect(getLastSeenString(neo4jTime)).toBe('1 minute ago');
    });
  });
});
