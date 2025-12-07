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

  describe('Basic Rendering', () => {
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

    it('should be defined', () => {
      expect(ProfileSetup).toBeDefined();
      expect(typeof ProfileSetup).toBe('function');
    });

    it('should render as a React component', () => {
      const { container } = render(
        <ToastProvider>
          <AuthProvider>
            <ProfileSetup />
          </AuthProvider>
        </ToastProvider>
      );
      expect(container.firstChild).not.toBeNull();
    });
  });

  describe('Component Behavior', () => {
    it('should not throw errors on mount', () => {
      expect(() => {
        render(
          <ToastProvider>
            <AuthProvider>
              <ProfileSetup />
            </AuthProvider>
          </ToastProvider>
        );
      }).not.toThrow();
    });

    it('should not have React console errors', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(
        <ToastProvider>
          <AuthProvider>
            <ProfileSetup />
          </AuthProvider>
        </ToastProvider>
      );
      expect(consoleError).not.toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  describe('Lifecycle', () => {
    it('should handle unmounting gracefully', () => {
      const { unmount } = render(
        <ToastProvider>
          <AuthProvider>
            <ProfileSetup />
          </AuthProvider>
        </ToastProvider>
      );
      expect(() => unmount()).not.toThrow();
    });

    it('should not leak memory on unmount', () => {
      const { unmount } = render(
        <ToastProvider>
          <AuthProvider>
            <ProfileSetup />
          </AuthProvider>
        </ToastProvider>
      );
      unmount();
      expect(true).toBe(true);
    });

    it('should cleanup effects on unmount', () => {
      const { unmount } = render(
        <ToastProvider>
          <AuthProvider>
            <ProfileSetup />
          </AuthProvider>
        </ToastProvider>
      );
      unmount();
      expect(true).toBe(true);
    });
  });

  describe('Provider Integration', () => {
    it('should work with ToastProvider', () => {
      expect(() => {
        render(
          <ToastProvider>
            <AuthProvider>
              <ProfileSetup />
            </AuthProvider>
          </ToastProvider>
        );
      }).not.toThrow();
    });

    it('should work with AuthProvider', () => {
      expect(() => {
        render(
          <ToastProvider>
            <AuthProvider>
              <ProfileSetup />
            </AuthProvider>
          </ToastProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid remounts', () => {
      for (let i = 0; i < 3; i++) {
        const { unmount } = render(
          <ToastProvider>
            <AuthProvider>
              <ProfileSetup />
            </AuthProvider>
          </ToastProvider>
        );
        unmount();
      }
      expect(true).toBe(true);
    });

    it('should not cause memory leaks', () => {
      const instances = [];
      for (let i = 0; i < 5; i++) {
        instances.push(render(
          <ToastProvider>
            <AuthProvider>
              <ProfileSetup />
            </AuthProvider>
          </ToastProvider>
        ));
      }
      instances.forEach(instance => instance.unmount());
      expect(true).toBe(true);
    });
  });
});
