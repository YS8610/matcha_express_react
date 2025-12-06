import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import Template from '@/app/template';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    pathname: '/',
  })),
  usePathname: vi.fn(() => '/'),
}));

describe('Template Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(<Template />);
    expect(container).toBeTruthy();
  });
});
