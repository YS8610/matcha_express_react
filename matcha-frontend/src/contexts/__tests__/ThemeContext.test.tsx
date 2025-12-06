import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, renderHook, act, screen, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme, initializeTheme } from '@/contexts/ThemeContext';
import React from 'react';

describe('ThemeContext', () => {
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

    // Mock document.documentElement
    document.documentElement.classList.add = vi.fn();
    document.documentElement.classList.remove = vi.fn();
    document.documentElement.setAttribute = vi.fn();
    document.documentElement.getAttribute = vi.fn(() => null);

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

  describe('ThemeProvider - Basic Rendering', () => {
    it('should provide context', () => {
      const { container } = render(<ThemeProvider><div /></ThemeProvider>);
      expect(container).toBeTruthy();
    });

    it('should render children', () => {
      render(
        <ThemeProvider>
          <div data-testid="child">Test Child</div>
        </ThemeProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <ThemeProvider>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
          <div data-testid="child3">Child 3</div>
        </ThemeProvider>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
      expect(screen.getByTestId('child3')).toBeInTheDocument();
    });
  });

  describe('useTheme Hook - Basic Functionality', () => {
    it('should provide theme context value', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current).toBeDefined();
      expect(result.current.theme).toBeDefined();
      expect(result.current.toggleTheme).toBeDefined();
      expect(result.current.setTheme).toBeDefined();
    });

    it('should have light theme as default', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('light');
    });

    it('should throw error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Theme Toggle Functionality', () => {
    it('should toggle theme from light to dark', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('light');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should toggle theme from dark to light', () => {
      document.documentElement.getAttribute = vi.fn(() => 'dark');

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
    });

    it('should toggle theme multiple times', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe('light');

      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe('dark');
    });
  });

  describe('Theme Setting Functionality', () => {
    it('should set theme to dark', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should set theme to light', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
    });

    it('should persist theme to localStorage when set to dark', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should persist theme to localStorage when set to light', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('light');
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('DOM Manipulation', () => {
    it('should add dark class and remove light class when theme is dark', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('light');
    });

    it('should add light class and remove dark class when theme is light', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('light');
      });

      expect(document.documentElement.classList.add).toHaveBeenCalledWith('light');
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark');
    });

    it('should set data-theme attribute to dark', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('should set data-theme attribute to light', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('light');
      });

      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    });
  });

  describe('initializeTheme Function', () => {
    it('should initialize theme from localStorage if available', () => {
      localStorageMock['theme'] = 'dark';

      initializeTheme();

      expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('light');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('should initialize to light theme when no saved theme exists', () => {
      initializeTheme();

      expect(document.documentElement.classList.add).toHaveBeenCalledWith('light');
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    });

    it('should use system preference when no saved theme exists', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      initializeTheme();

      expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('should handle SSR gracefully (no document)', () => {
      const originalDocument = global.document;
      // @ts-ignore
      delete global.document;

      expect(() => {
        initializeTheme();
      }).not.toThrow();

      global.document = originalDocument;
    });
  });

  describe('State Management', () => {
    it('should maintain theme state across re-renders', () => {
      const { result, rerender } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('dark');
      });

      rerender();

      expect(result.current.theme).toBe('dark');
    });

    it('should sync with data-theme attribute on mount', () => {
      document.documentElement.getAttribute = vi.fn(() => 'dark');

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      // Wait for useEffect to run
      waitFor(() => {
        expect(result.current.theme).toBe('dark');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid theme toggles', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.toggleTheme();
        result.current.toggleTheme();
        result.current.toggleTheme();
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
    });

    it('should handle setting same theme multiple times', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('dark');
        result.current.setTheme('dark');
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(localStorage.setItem).toHaveBeenCalledTimes(3);
    });

    it('should handle unmounting provider', () => {
      const { unmount } = render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should work with nested components', () => {
      function NestedComponent() {
        const { theme, toggleTheme } = useTheme();
        return (
          <div>
            <span data-testid="current-theme">{theme}</span>
            <button onClick={toggleTheme} data-testid="toggle-btn">Toggle</button>
          </div>
        );
      }

      render(
        <ThemeProvider>
          <NestedComponent />
        </ThemeProvider>
      );

      const themeDisplay = screen.getByTestId('current-theme');
      const toggleButton = screen.getByTestId('toggle-btn');

      expect(themeDisplay.textContent).toBe('light');

      act(() => {
        toggleButton.click();
      });

      expect(themeDisplay.textContent).toBe('dark');
    });

    it('should provide consistent context to multiple consumers', () => {
      function Consumer1() {
        const { theme } = useTheme();
        return <div data-testid="consumer1">{theme}</div>;
      }

      function Consumer2() {
        const { theme } = useTheme();
        return <div data-testid="consumer2">{theme}</div>;
      }

      function Consumer3() {
        const { toggleTheme } = useTheme();
        return <button data-testid="toggle" onClick={toggleTheme}>Toggle</button>;
      }

      render(
        <ThemeProvider>
          <Consumer1 />
          <Consumer2 />
          <Consumer3 />
        </ThemeProvider>
      );

      expect(screen.getByTestId('consumer1').textContent).toBe('light');
      expect(screen.getByTestId('consumer2').textContent).toBe('light');

      act(() => {
        screen.getByTestId('toggle').click();
      });

      expect(screen.getByTestId('consumer1').textContent).toBe('dark');
      expect(screen.getByTestId('consumer2').textContent).toBe('dark');
    });
  });
});
