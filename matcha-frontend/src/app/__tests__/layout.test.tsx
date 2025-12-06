import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootLayout from '@/app/layout';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
  })),
  usePathname: vi.fn(() => '/'),
}));

// Mock contexts
vi.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: vi.fn(() => ({ user: null, login: vi.fn(), logout: vi.fn() })),
}));

vi.mock('@/contexts/WebSocketContext', () => ({
  WebSocketProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="websocket-provider">{children}</div>,
  useWebSocket: vi.fn(),
}));

vi.mock('@/contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
  useTheme: vi.fn(() => ({ theme: 'light', toggleTheme: vi.fn(), setTheme: vi.fn() })),
}));

vi.mock('@/contexts/ToastContext', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="toast-provider">{children}</div>,
  useToast: vi.fn(() => ({ toasts: [], addToast: vi.fn(), removeToast: vi.fn() })),
}));

// Mock components
vi.mock('@/components/layout/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('@/components/RouteChangeProgress', () => ({
  default: () => <div data-testid="route-change-progress">RouteChangeProgress</div>,
}));

vi.mock('@/components/Toast/ToastContainer', () => ({
  default: () => <div data-testid="toast-container">ToastContainer</div>,
}));

describe('Layout Page', () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock localStorage
    localStorageMock = {};
    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      length: 0,
      key: vi.fn(),
    } as Storage;

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should be defined', () => {
      expect(RootLayout).toBeDefined();
      expect(typeof RootLayout).toBe('function');
    });

    it('should render without crashing', () => {
      const { container } = render(
        <RootLayout>
          <div>Test content</div>
        </RootLayout>
      );
      expect(container).toBeTruthy();
    });

    it('should render children content', () => {
      render(
        <RootLayout>
          <div data-testid="test-child">Test content</div>
        </RootLayout>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <RootLayout>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
          <div data-testid="child3">Child 3</div>
        </RootLayout>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
      expect(screen.getByTestId('child3')).toBeInTheDocument();
    });
  });

  describe('HTML Structure', () => {
    it('should render html element with lang attribute', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      const html = container.querySelector('html');
      expect(html).toBeInTheDocument();
      expect(html).toHaveAttribute('lang', 'en');
    });

    it('should render html with suppressHydrationWarning', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      const html = container.querySelector('html');
      expect(html).toHaveAttribute('suppressHydrationWarning');
    });

    it('should render body element', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      const body = container.querySelector('body');
      expect(body).toBeInTheDocument();
    });

    it('should render body with antialiased class', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      const body = container.querySelector('body');
      expect(body).toHaveClass('antialiased');
    });

    it('should render body with font-family style', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      const body = container.querySelector('body');
      expect(body).toHaveStyle({
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      });
    });
  });

  describe('Provider Hierarchy', () => {
    it('should render ThemeProvider', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    });

    it('should render ToastProvider', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      expect(screen.getByTestId('toast-provider')).toBeInTheDocument();
    });

    it('should render AuthProvider', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    });

    it('should render WebSocketProvider', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      expect(screen.getByTestId('websocket-provider')).toBeInTheDocument();
    });

    it('should nest providers in correct order', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      // ThemeProvider should be outermost
      const themeProvider = container.querySelector('[data-testid="theme-provider"]');
      expect(themeProvider).toBeInTheDocument();

      // ToastProvider should be inside ThemeProvider
      const toastProvider = themeProvider?.querySelector('[data-testid="toast-provider"]');
      expect(toastProvider).toBeInTheDocument();

      // AuthProvider should be inside ToastProvider
      const authProvider = toastProvider?.querySelector('[data-testid="auth-provider"]');
      expect(authProvider).toBeInTheDocument();

      // WebSocketProvider should be inside AuthProvider
      const wsProvider = authProvider?.querySelector('[data-testid="websocket-provider"]');
      expect(wsProvider).toBeInTheDocument();
    });
  });

  describe('Component Rendering', () => {
    it('should render Header component', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText('Header')).toBeInTheDocument();
    });

    it('should render Footer component', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('should render RouteChangeProgress component', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      expect(screen.getByTestId('route-change-progress')).toBeInTheDocument();
    });

    it('should render ToastContainer component', () => {
      render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should render main container with min-h-screen', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      const mainContainer = container.querySelector('.min-h-screen');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should render main container with flex flex-col', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      const mainContainer = container.querySelector('.min-h-screen');
      expect(mainContainer).toHaveClass('flex', 'flex-col');
    });

    it('should render main element with flex-1 class', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass('flex-1');
    });

    it('should render children inside main element', () => {
      render(
        <RootLayout>
          <div data-testid="main-content">Main Content</div>
        </RootLayout>
      );

      const mainContent = screen.getByTestId('main-content');
      const mainElement = mainContent.closest('main');
      expect(mainElement).toBeInTheDocument();
    });

    it('should render Header before main', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      const header = screen.getByTestId('header');
      const main = container.querySelector('main');

      const headerPosition = Array.from(container.querySelectorAll('*')).indexOf(header.closest('header')!);
      const mainPosition = Array.from(container.querySelectorAll('*')).indexOf(main!);

      expect(headerPosition).toBeLessThan(mainPosition);
    });

    it('should render Footer after main', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      const footer = screen.getByTestId('footer');
      const main = container.querySelector('main');

      const mainPosition = Array.from(container.querySelectorAll('*')).indexOf(main!);
      const footerPosition = Array.from(container.querySelectorAll('*')).indexOf(footer.closest('footer')!);

      expect(mainPosition).toBeLessThan(footerPosition);
    });
  });

  describe('Edge Cases', () => {
    it('should render with empty children', () => {
      const { container } = render(
        <RootLayout>
          {null}
        </RootLayout>
      );

      expect(container).toBeTruthy();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should render with fragment children', () => {
      render(
        <RootLayout>
          <>
            <div data-testid="fragment-child-1">Fragment 1</div>
            <div data-testid="fragment-child-2">Fragment 2</div>
          </>
        </RootLayout>
      );

      expect(screen.getByTestId('fragment-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-child-2')).toBeInTheDocument();
    });

    it('should render with nested components', () => {
      render(
        <RootLayout>
          <div>
            <div>
              <div data-testid="deeply-nested">Deeply nested content</div>
            </div>
          </div>
        </RootLayout>
      );

      expect(screen.getByTestId('deeply-nested')).toBeInTheDocument();
    });
  });

  describe('Metadata and Viewport Exports', () => {
    it('should export metadata', async () => {
      const layout = await import('@/app/layout');
      expect(layout.metadata).toBeDefined();
    });

    it('should export viewport', async () => {
      const layout = await import('@/app/layout');
      expect(layout.viewport).toBeDefined();
    });

    it('should have correct metadata structure', async () => {
      const layout = await import('@/app/layout');
      expect(layout.metadata).toHaveProperty('title');
      expect(layout.metadata).toHaveProperty('description');
      expect(layout.metadata).toHaveProperty('icons');
      expect(layout.metadata).toHaveProperty('manifest');
    });

    it('should have correct metadata values', async () => {
      const layout = await import('@/app/layout');
      expect(layout.metadata.title).toBe('Matcha - Find Your Perfect Match');
      expect(layout.metadata.description).toBe('A modern dating app to find meaningful connections');
    });

    it('should have correct viewport structure', async () => {
      const layout = await import('@/app/layout');
      expect(layout.viewport).toHaveProperty('themeColor');
      expect(layout.viewport).toHaveProperty('width');
      expect(layout.viewport).toHaveProperty('initialScale');
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML elements', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('main')).toBeInTheDocument();
      expect(container.querySelector('footer')).toBeInTheDocument();
    });

    it('should maintain proper document structure', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>
      );

      expect(container.querySelector('html > body')).toBeInTheDocument();
    });
  });
});
