import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import Content from '@/app/bad-request/content';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
    pathname: '/',
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(() => null),
  })),
  usePathname: vi.fn(() => '/'),
}));

describe('Content Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(<Content />);
    expect(container).toBeTruthy();
  });

  // Add more tests here
});
