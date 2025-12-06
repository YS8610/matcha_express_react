import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getLocationName } from '@/lib/geolocation';

describe('Geolocation Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export getLocationName function', () => {
    expect(getLocationName).toBeDefined();
  });
});
