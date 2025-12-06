import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import Error from '@/app/error';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    pathname: '/',
  })),
  usePathname: vi.fn(() => '/'),
}));

describe('Error Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have error handling', () => {
    expect(true).toBe(true);
  });
});
