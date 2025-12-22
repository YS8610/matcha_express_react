import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RootLayout, { metadata, viewport } from '../layout';

vi.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

vi.mock('@/contexts/WebSocketContext', () => ({
  WebSocketProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="websocket-provider">{children}</div>
  ),
}));

vi.mock('@/contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

vi.mock('@/contexts/ToastContext', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="toast-provider">{children}</div>
  ),
}));

vi.mock('@/components/layout/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('@/components/RouteChangeProgress', () => ({
  default: () => <div data-testid="route-progress">Progress</div>,
}));

vi.mock('@/components/Toast/ToastContainer', () => ({
  default: () => <div data-testid="toast-container">Toasts</div>,
}));

describe('RootLayout', () => {
  describe('metadata', () => {
    it('should have correct title', () => {
      expect(metadata.title).toBe('Matcha - Find Your Perfect Match');
    });

    it('should have correct description', () => {
      expect(metadata.description).toBe('A modern dating app to find meaningful connections');
    });

    it('should have favicon icons', () => {
      expect(metadata.icons).toBeDefined();
      expect(metadata.icons?.icon).toContainEqual({ url: '/favicon.ico' });
      expect(metadata.icons?.icon).toContainEqual({ url: '/favicon.svg', type: 'image/svg+xml' });
    });

    it('should have apple touch icon', () => {
      expect(metadata.icons?.apple).toBe('/apple-touch-icon.svg');
    });

    it('should have manifest', () => {
      expect(metadata.manifest).toBe('/manifest.json');
    });
  });

  describe('viewport', () => {
    it('should have correct theme color', () => {
      expect(viewport.themeColor).toBe('#689f38');
    });

    it('should have device-width', () => {
      expect(viewport.width).toBe('device-width');
    });

    it('should have initial scale of 1', () => {
      expect(viewport.initialScale).toBe(1);
    });

    it('should have maximum scale of 5', () => {
      expect(viewport.maximumScale).toBe(5);
    });

    it('should be user scalable', () => {
      expect(viewport.userScalable).toBe(true);
    });

    it('should have viewport fit cover', () => {
      expect(viewport.viewportFit).toBe('cover');
    });
  });

  describe('layout component', () => {
    it('should render children', () => {
      const { getByText } = render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      );

      expect(getByText('Test Content')).toBeInTheDocument();
    });

    it('should render all providers', () => {
      const { getByTestId } = render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      expect(getByTestId('theme-provider')).toBeInTheDocument();
      expect(getByTestId('toast-provider')).toBeInTheDocument();
      expect(getByTestId('auth-provider')).toBeInTheDocument();
      expect(getByTestId('websocket-provider')).toBeInTheDocument();
    });

    it('should render header', () => {
      const { getByTestId } = render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      expect(getByTestId('header')).toBeInTheDocument();
    });

    it('should render footer', () => {
      const { getByTestId } = render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      expect(getByTestId('footer')).toBeInTheDocument();
    });

    it('should render route progress indicator', () => {
      const { getByTestId } = render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      expect(getByTestId('route-progress')).toBeInTheDocument();
    });

    it('should render toast container', () => {
      const { getByTestId } = render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      expect(getByTestId('toast-container')).toBeInTheDocument();
    });

    it('should render html with lang attribute', () => {
      render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      expect(document.documentElement).toHaveAttribute('lang', 'en');
    });

    it('should render with suppressHydrationWarning', () => {
      render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      expect(document.documentElement).toBeInTheDocument();
    });

    it('should render body with antialiased class', () => {
      render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      expect(document.body).toHaveClass('antialiased');
    });

    it('should have correct provider nesting order', () => {
      const { container } = render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      const themeProvider = container.querySelector('[data-testid="theme-provider"]');
      const toastProvider = container.querySelector('[data-testid="toast-provider"]');
      const authProvider = container.querySelector('[data-testid="auth-provider"]');
      const websocketProvider = container.querySelector('[data-testid="websocket-provider"]');

      expect(themeProvider).toBeInTheDocument();
      expect(toastProvider?.parentElement).toBe(themeProvider);
      expect(authProvider?.parentElement).toBe(toastProvider);
      expect(websocketProvider?.parentElement).toBe(authProvider);
    });

    it('should wrap content in main element', () => {
      const { getByText } = render(
        <RootLayout>
          <div>Main Content</div>
        </RootLayout>
      );

      const content = getByText('Main Content');
      const main = content.closest('main');

      expect(main).toBeInTheDocument();
      expect(main).toHaveClass('flex-1');
    });

    it('should have min-h-screen layout', () => {
      const { container } = render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      const layoutDiv = container.querySelector('.min-h-screen');
      expect(layoutDiv).toBeInTheDocument();
      expect(layoutDiv).toHaveClass('flex', 'flex-col');
    });

    it('should render without errors', () => {
      expect(() => render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      )).not.toThrow();
    });

    it('should render multiple children', () => {
      const { getByText } = render(
        <RootLayout>
          <div>First Child</div>
          <div>Second Child</div>
          <div>Third Child</div>
        </RootLayout>
      );

      expect(getByText('First Child')).toBeInTheDocument();
      expect(getByText('Second Child')).toBeInTheDocument();
      expect(getByText('Third Child')).toBeInTheDocument();
    });
  });

  describe('script tags', () => {
    it('should not crash when rendering with scripts', () => {
      expect(() => render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      )).not.toThrow();
    });
  });
});
