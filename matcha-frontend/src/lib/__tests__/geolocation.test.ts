import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getLocationName, clearLocationCache } from '@/lib/geolocation';

global.fetch = vi.fn();

describe('Geolocation Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
    clearLocationCache();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should export getLocationName function', () => {
    expect(getLocationName).toBeDefined();
  });

  it('should be a function that takes latitude and longitude', () => {
    expect(typeof getLocationName).toBe('function');
  });

  it('should return a Promise', () => {
    const result = getLocationName(40.7128, -74.006);
    expect(result instanceof Promise).toBe(true);
  });

  describe('getLocationName', () => {
    it('should fetch location name from API for valid coordinates', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({
          address: {
            city: 'New York',
            state: 'New York',
            country: 'United States',
          },
        }),
      });

      const location = await getLocationName(40.7128, -74.006);
      expect(location).toContain('New York');
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should construct correct API URL with coordinates', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ address: { city: 'Paris' } }),
      });

      await getLocationName(48.8566, 2.3522);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/geocode?lat=48.8566&lon=2.3522'
      );
    });

    it('should call Next.js API route without custom headers', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({ address: {} }),
      });

      await getLocationName(0, 0);
      expect(global.fetch).toHaveBeenCalledWith('/api/geocode?lat=0&lon=0');
    });

    it('should return city name when available', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({
          address: { city: 'London' },
        }),
      });

      const location = await getLocationName(51.5074, -0.1278);
      expect(location).toContain('London');
    });

    it('should use town as fallback for city', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({
          address: { town: 'Oxford' },
        }),
      });

      const location = await getLocationName(51.7520, -1.2577);
      expect(location).toContain('Oxford');
    });

    it('should use village as fallback for city and town', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({
          address: { village: 'Godstone' },
        }),
      });

      const location = await getLocationName(51.2, -0.1);
      expect(location).toContain('Godstone');
    });

    it('should include state and country in location string', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({
          address: {
            city: 'Austin',
            state: 'Texas',
            country: 'United States',
          },
        }),
      });

      const location = await getLocationName(30.2672, -97.7431);
      expect(location).toContain('Austin');
      expect(location).toContain('Texas');
      expect(location).toContain('United States');
    });

    it('should return coordinates as fallback on API error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const location = await getLocationName(40.7128, -74.006);
      expect(location).toMatch(/40\.71.*-74\.01/);
    });

    it('should return coordinates on error response from API', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({
          error: 'Unable to geocode',
        }),
      });

      const location = await getLocationName(0, 0);
      expect(location).toMatch(/0\.00.*0\.00/);
    });

    it('should handle network errors gracefully', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        new Error('Network error')
      );

      const location = await getLocationName(10, 20);
      expect(location).toMatch(/10\.00.*20\.00/);
    });

    it('should cache location results', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({
          address: { city: 'Berlin' },
        }),
      });

      const location1 = await getLocationName(52.52, 13.405);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      const location2 = await getLocationName(52.52, 13.405);
      expect(location1).toBe(location2);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should round coordinates to 4 decimal places for caching', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({
          address: { city: 'Tokyo' },
        }),
      });

      await getLocationName(35.6762, 139.6503);
      await getLocationName(35.67625, 139.65035);

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should return formatted string with proper comma separation', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({
          address: {
            city: 'Sydney',
            state: 'New South Wales',
            country: 'Australia',
          },
        }),
      });

      const location = await getLocationName(-33.8688, 151.2093);
      expect(location).toBe('Sydney, New South Wales, Australia');
    });

    it('should handle missing address information', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({
          address: null,
        }),
      });

      const location = await getLocationName(45, 90);
      expect(location).toMatch(/45\.00.*90\.00/);
    });
  });
});
