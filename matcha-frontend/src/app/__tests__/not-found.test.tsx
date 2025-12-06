import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import NotFound from '@/app/not-found';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    pathname: '/',
  })),
  usePathname: vi.fn(() => '/'),
}));

describe('NotFound Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(<NotFound />);
    expect(container).toBeTruthy();
  });
});
