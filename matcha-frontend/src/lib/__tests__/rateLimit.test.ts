import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isRateLimited, resetRateLimit, getRemainingAttempts, getResetTime } from '@/lib/rateLimit';

describe('Rate Limit Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export isRateLimited function', () => {
    expect(isRateLimited).toBeDefined();
  });

  it('should export resetRateLimit function', () => {
    expect(resetRateLimit).toBeDefined();
  });

  it('should export getRemainingAttempts function', () => {
    expect(getRemainingAttempts).toBeDefined();
  });

  it('should export getResetTime function', () => {
    expect(getResetTime).toBeDefined();
  });
});
