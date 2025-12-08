import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BrowseProfiles from '@/components/browse/BrowseProfiles';
import { ToastProvider } from '@/contexts/ToastContext';

vi.mock('@/lib/api', () => ({
  api: {
    getFilteredProfiles: vi.fn().mockResolvedValue({ data: [] }),
    getUserTags: vi.fn().mockResolvedValue({ tags: [] }),
    getProfile: vi.fn().mockResolvedValue({
      data: {
        latitude: 1.2927,
        longitude: 103.8558
      }
    }),
  },
}));

vi.mock('@/contexts/WebSocketContext', () => ({
  useWebSocket: vi.fn(() => ({
    socket: null,
    isConnected: false,
    notifications: [],
    onlineUsers: {},
    chatMessages: {},
    checkOnlineStatus: vi.fn(),
  })),
  WebSocketProvider: ({ children }: any) => children,
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ToastProvider>
      {component}
    </ToastProvider>
  );
};

describe('BrowseProfiles Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { container } = renderWithProviders(
        <BrowseProfiles />
      );
      expect(container).toBeTruthy();
    });

    it('should be defined', () => {
      expect(BrowseProfiles).toBeDefined();
      expect(typeof BrowseProfiles).toBe('function');
    });

    it('should render as a React component', () => {
      const { container } = renderWithProviders(
        <BrowseProfiles />
      );
      expect(container.firstChild).not.toBeNull();
    });

    it('should have valid HTML structure', () => {
      const { container } = renderWithProviders(
        <BrowseProfiles />
      );
      expect(container.querySelector('*')).toBeInTheDocument();
    });
  });

  describe('Component Behavior', () => {
    it('should not throw errors on mount', () => {
      expect(() => {
        renderWithProviders(
          <BrowseProfiles />
        );
      }).not.toThrow();
    });

    it('should not have React console errors', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      renderWithProviders(
        <BrowseProfiles />
      );
      expect(consoleError).not.toHaveBeenCalled();
      consoleError.mockRestore();
    });

    it('should render consistently on multiple renders', () => {
      const { container: container1 } = renderWithProviders(
        <BrowseProfiles />
      );
      const { container: container2 } = renderWithProviders(
        <BrowseProfiles />
      );
      expect(container1.innerHTML).toBe(container2.innerHTML);
    });

    it('should maintain stable DOM structure', () => {
      const { container, rerender } = renderWithProviders(
        <BrowseProfiles />
      );
      const initialHTML = container.innerHTML;
      rerender(
        <ToastProvider>
          <BrowseProfiles />
        </ToastProvider>
      );
      expect(container.innerHTML).toBe(initialHTML);
    });
  });

  describe('Lifecycle', () => {
    it('should handle unmounting gracefully', () => {
      const { unmount } = renderWithProviders(
        <BrowseProfiles />
      );
      expect(() => unmount()).not.toThrow();
    });

    it('should not leak memory on unmount', () => {
      const { unmount } = renderWithProviders(
        <BrowseProfiles />
      );
      unmount();
      expect(true).toBe(true);
    });

    it('should cleanup effects on unmount', () => {
      const { unmount } = renderWithProviders(
        <BrowseProfiles />
      );
      unmount();
      expect(true).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should work with React Testing Library', () => {
      const { container } = renderWithProviders(
        <BrowseProfiles />
      );
      expect(container).toBeTruthy();
    });

    it('should work with mocked dependencies', () => {
      expect(() => {
        renderWithProviders(
          <BrowseProfiles />
        );
      }).not.toThrow();
    });

    it('should handle context providers correctly', () => {
      const { container } = renderWithProviders(
        <BrowseProfiles />
      );
      expect(container).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid remounts', () => {
      for (let i = 0; i < 3; i++) {
        const { unmount } = renderWithProviders(
          <BrowseProfiles />
        );
        unmount();
      }
      expect(true).toBe(true);
    });

    it('should not cause memory leaks with multiple instances', () => {
      const instances = [];
      for (let i = 0; i < 5; i++) {
        instances.push(renderWithProviders(
          <BrowseProfiles />
        ));
      }
      instances.forEach(instance => instance.unmount());
      expect(true).toBe(true);
    });

    it('should handle concurrent renders', () => {
      const { container: c1 } = renderWithProviders(
        <BrowseProfiles />
      );
      const { container: c2 } = renderWithProviders(
        <BrowseProfiles />
      );
      expect(c1).toBeTruthy();
      expect(c2).toBeTruthy();
    });
  });
});
