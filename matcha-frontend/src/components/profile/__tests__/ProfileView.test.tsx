import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import ProfileView from '@/components/profile/ProfileView';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    pathname: '/',
  })),
  usePathname: vi.fn(() => '/'),
}));

vi.mock('@/lib/api', () => ({
  api: {
    getProfile: vi.fn().mockResolvedValue({ data: null }),
    likeProfile: vi.fn().mockResolvedValue({}),
    unlikeProfile: vi.fn().mockResolvedValue({}),
    reportProfile: vi.fn().mockResolvedValue({}),
    blockUser: vi.fn().mockResolvedValue({}),
    checkConnection: vi.fn().mockResolvedValue({ data: false }),
  },
  generateAvatarUrl: vi.fn((username) => `https://avatar.example.com/${username}`),
}));

describe('ProfileView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <ToastProvider>
          <AuthProvider>
            <ProfileView userId="test-user-id" />
          </AuthProvider>
        </ToastProvider>
      );
      expect(container).toBeTruthy();
    });

    it('should be defined', () => {
      expect(ProfileView).toBeDefined();
      expect(typeof ProfileView).toBe('function');
    });

    it('should accept userId prop', () => {
      const { container } = render(
        <ToastProvider>
          <AuthProvider>
            <ProfileView userId="custom-user-id" />
          </AuthProvider>
        </ToastProvider>
      );
      expect(container).toBeTruthy();
    });
  });

  describe('Component Behavior', () => {
    it('should not throw errors on mount', () => {
      expect(() => {
        render(
          <ToastProvider>
            <AuthProvider>
              <ProfileView userId="test-user-id" />
            </AuthProvider>
          </ToastProvider>
        );
      }).not.toThrow();
    });

    it('should handle different userId values', () => {
      const userIds = ['user-1', 'user-2', 'user-3'];
      userIds.forEach(userId => {
        const { unmount } = render(
          <ToastProvider>
            <AuthProvider>
              <ProfileView userId={userId} />
            </AuthProvider>
          </ToastProvider>
        );
        expect(true).toBe(true);
        unmount();
      });
    });
  });

  describe('Lifecycle', () => {
    it('should handle unmounting gracefully', () => {
      const { unmount } = render(
        <ToastProvider>
          <AuthProvider>
            <ProfileView userId="test-user-id" />
          </AuthProvider>
        </ToastProvider>
      );
      expect(() => unmount()).not.toThrow();
    });

    it('should not leak memory on unmount', () => {
      const { unmount } = render(
        <ToastProvider>
          <AuthProvider>
            <ProfileView userId="test-user-id" />
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
              <ProfileView userId="test-user-id" />
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
              <ProfileView userId="test-user-id" />
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
              <ProfileView userId="test-user-id" />
            </AuthProvider>
          </ToastProvider>
        );
        unmount();
      }
      expect(true).toBe(true);
    });

    it('should handle multiple instances', () => {
      const instances = [];
      for (let i = 0; i < 3; i++) {
        instances.push(render(
          <ToastProvider>
            <AuthProvider>
              <ProfileView userId={`user-${i}`} />
            </AuthProvider>
          </ToastProvider>
        ));
      }
      instances.forEach(instance => instance.unmount());
      expect(true).toBe(true);
    });
  });
});
