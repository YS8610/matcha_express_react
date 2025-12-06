import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCsrfToken, addCsrfToken, requiresCsrfToken } from '@/lib/csrf';

describe('CSRF Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export getCsrfToken function', () => {
    expect(getCsrfToken).toBeDefined();
  });

  it('should export addCsrfToken function', () => {
    expect(addCsrfToken).toBeDefined();
  });

  it('should export requiresCsrfToken function', () => {
    expect(requiresCsrfToken).toBeDefined();
  });
});
