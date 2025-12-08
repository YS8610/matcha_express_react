import { describe, it, expect } from 'vitest';
import { calculateDistance, formatDistance } from '../distance';

describe('Distance Utilities', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points accurately', () => {
      const nyLat = 40.7128;
      const nyLon = -74.006;
      const laLat = 34.0522;
      const laLon = -118.2437;

      const distance = calculateDistance(nyLat, nyLon, laLat, laLon);

      expect(distance).toBeGreaterThan(3900);
      expect(distance).toBeLessThan(4000);
    });

    it('should calculate distance between nearby points accurately', () => {
      const lat1 = 37.7749;
      const lon1 = -122.4194;
      const lat2 = 37.8716;
      const lon2 = -122.2727;

      const distance = calculateDistance(lat1, lon1, lat2, lon2);

      expect(distance).toBeGreaterThan(14);
      expect(distance).toBeLessThan(17);
    });

    it('should return 0 for the same coordinates', () => {
      const lat = 51.5074;
      const lon = -0.1278;

      const distance = calculateDistance(lat, lon, lat, lon);

      expect(distance).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const londonLat = 51.5074;
      const londonLon = -0.1278;
      const sydneyLat = -33.8688;
      const sydneyLon = 151.2093;

      const distance = calculateDistance(londonLat, londonLon, sydneyLat, sydneyLon);

      expect(distance).toBeGreaterThan(16000);
      expect(distance).toBeLessThan(18000);
    });

    it('should handle coordinates near the equator', () => {
      const lat1 = 0;
      const lon1 = 0;
      const lat2 = 0;
      const lon2 = 1;

      const distance = calculateDistance(lat1, lon1, lat2, lon2);

      expect(distance).toBeGreaterThan(110);
      expect(distance).toBeLessThan(112);
    });

    it('should handle coordinates near the poles', () => {
      const lat1 = 89;
      const lon1 = 0;
      const lat2 = 89;
      const lon2 = 180;

      const distance = calculateDistance(lat1, lon1, lat2, lon2);

      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(500);
    });
  });

  describe('formatDistance', () => {
    it('should format distances less than 1 km in meters', () => {
      expect(formatDistance(0.5)).toBe('500 m');
      expect(formatDistance(0.123)).toBe('123 m');
      expect(formatDistance(0.999)).toBe('999 m');
    });

    it('should format distances between 1 and 10 km with one decimal', () => {
      expect(formatDistance(1.5)).toBe('1.5 km');
      expect(formatDistance(5.234)).toBe('5.2 km');
      expect(formatDistance(9.99)).toBe('10.0 km');
    });

    it('should format distances over 10 km as whole numbers', () => {
      expect(formatDistance(10)).toBe('10 km');
      expect(formatDistance(15.6)).toBe('16 km');
      expect(formatDistance(100.49)).toBe('100 km');
      expect(formatDistance(3944.7)).toBe('3945 km');
    });

    it('should handle edge cases', () => {
      expect(formatDistance(0)).toBe('0 m');
      expect(formatDistance(0.001)).toBe('1 m');
      expect(formatDistance(0.9999)).toBe('1000 m');
      expect(formatDistance(1)).toBe('1.0 km');
    });
  });
});
