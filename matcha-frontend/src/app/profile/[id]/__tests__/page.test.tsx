import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import Page from '@/app/profile/[id]/page';

vi.mock('next/navigation', () => ({
  useParams: vi.fn(() => ({ id: 'test-id' })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    pathname: '/',
  })),
  usePathname: vi.fn(() => '/'),
}));

describe('Page Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <ToastProvider>
        <AuthProvider>
        <Page />
      </AuthProvider>
        </ToastProvider>
    );
    expect(container).toBeTruthy();
  });

  // Add more tests here
});
