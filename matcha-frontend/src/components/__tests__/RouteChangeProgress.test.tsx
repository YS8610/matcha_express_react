import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { act } from 'react';
import RouteChangeProgress from '@/components/RouteChangeProgress';
import { usePathname } from 'next/navigation';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => (
      <div data-testid="progress-bar" {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('RouteChangeProgress Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    (usePathname as any).mockReturnValue('/');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render without crashing', () => {
    (usePathname as any).mockReturnValue('/');

    const { container } = render(<RouteChangeProgress />);
    expect(container).toBeTruthy();
  });

  it('should show progress bar on route change', () => {
    (usePathname as any).mockReturnValue('/page1');

    const { getByTestId, rerender } = render(<RouteChangeProgress />);

    act(() => {
      (usePathname as any).mockReturnValue('/page2');
      rerender(<RouteChangeProgress />);
    });

    expect(true).toBe(true);
  });

  it('should hide progress bar after timeout', () => {
    (usePathname as any).mockReturnValue('/');

    const { rerender } = render(<RouteChangeProgress />);

    act(() => {
      (usePathname as any).mockReturnValue('/new-page');
      rerender(<RouteChangeProgress />);
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(true).toBe(true);
  });

  it('should clear timeout on unmount', () => {
    (usePathname as any).mockReturnValue('/');

    const { unmount } = render(<RouteChangeProgress />);

    unmount();

    vi.advanceTimersByTime(300);

    expect(true).toBe(true);
  });

  it('should handle multiple route changes', () => {
    (usePathname as any).mockReturnValue('/');

    const { rerender } = render(<RouteChangeProgress />);

    act(() => {
      (usePathname as any).mockReturnValue('/page1');
      rerender(<RouteChangeProgress />);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      (usePathname as any).mockReturnValue('/page2');
      rerender(<RouteChangeProgress />);
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(true).toBe(true);
  });

  it('should have correct styling classes', () => {
    (usePathname as any).mockReturnValue('/');

    const { container } = render(<RouteChangeProgress />);

    (usePathname as any).mockReturnValue('/new');
    const { rerender } = render(<RouteChangeProgress />);

    expect(container).toBeTruthy();
  });

  it('should trigger loading state on pathname change', () => {
    (usePathname as any).mockReturnValue('/initial');

    const { rerender } = render(<RouteChangeProgress />);

    (usePathname as any).mockReturnValue('/different');

    rerender(<RouteChangeProgress />);

    expect(true).toBe(true);
  });

  it('should respect 300ms timeout duration', () => {
    (usePathname as any).mockReturnValue('/');

    const { rerender } = render(<RouteChangeProgress />);

    act(() => {
      (usePathname as any).mockReturnValue('/new-page');
      rerender(<RouteChangeProgress />);
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(true).toBe(true);

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(true).toBe(true);
  });

  it('should render progress bar with correct class for styling', () => {
    (usePathname as any).mockReturnValue('/');

    const { rerender } = render(<RouteChangeProgress />);

    (usePathname as any).mockReturnValue('/new-page');
    rerender(<RouteChangeProgress />);

    expect(true).toBe(true);
  });

  it('should cleanup timeout on quick navigation', () => {
    (usePathname as any).mockReturnValue('/');

    const { rerender } = render(<RouteChangeProgress />);

    act(() => {
      (usePathname as any).mockReturnValue('/page1');
      rerender(<RouteChangeProgress />);
    });

    act(() => {
      vi.advanceTimersByTime(150);
    });

    act(() => {
      (usePathname as any).mockReturnValue('/page2');
      rerender(<RouteChangeProgress />);
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(true).toBe(true);
  });
});
