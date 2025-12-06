import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import ProfileSetup from '@/components/profile/ProfileSetup';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    pathname: '/',
  })),
  usePathname: vi.fn(() => '/'),
}));

vi.mock('@/lib/api', () => ({
  api: {
    getProfile: vi.fn().mockResolvedValue({ data: null }),
    updateProfile: vi.fn().mockResolvedValue({}),
    uploadPhoto: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('browser-image-compression', () => ({
  default: {
    compress: vi.fn().mockResolvedValue(new Blob()),
  },
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />;
  },
}));

describe('ProfileSetup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <ToastProvider>
        <AuthProvider>
          <ProfileSetup />
        </AuthProvider>
      </ToastProvider>
    );
    expect(container).toBeTruthy();
  });

  // Add more tests here
});
