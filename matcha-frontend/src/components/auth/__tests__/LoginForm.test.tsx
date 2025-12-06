import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import LoginForm from '@/components/auth/LoginForm';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    pathname: '/',
  })),
  usePathname: vi.fn(() => '/'),
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <ToastProvider>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </ToastProvider>
    );
    expect(container).toBeTruthy();
  });

  // Add more tests here
});
