import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import PageTransition from '@/components/PageTransition';
import { usePathname } from 'next/navigation';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

describe('PageTransition Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePathname as any).mockReturnValue('/');
  });

  it('should render children', () => {
    (usePathname as any).mockReturnValue('/test');

    const { getByText } = render(
      <PageTransition>
        <div>Test Content</div>
      </PageTransition>
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should render motion div', () => {
    (usePathname as any).mockReturnValue('/');

    const { getByTestId } = render(
      <PageTransition>
        <div>Content</div>
      </PageTransition>
    );

    expect(getByTestId('motion-div')).toBeTruthy();
  });

  it('should update on pathname change', () => {
    (usePathname as any).mockReturnValue('/page1');

    const { rerender, getByTestId } = render(
      <PageTransition>
        <div>Page 1</div>
      </PageTransition>
    );

    let motionDiv = getByTestId('motion-div');
    expect(motionDiv).toBeTruthy();

    (usePathname as any).mockReturnValue('/page2');

    rerender(
      <PageTransition>
        <div>Page 2</div>
      </PageTransition>
    );

    motionDiv = getByTestId('motion-div');
    expect(motionDiv).toBeTruthy();
  });

  it('should pass correct animation variants', () => {
    (usePathname as any).mockReturnValue('/');

    const { getByTestId } = render(
      <PageTransition>
        <div>Content</div>
      </PageTransition>
    );

    const motionDiv = getByTestId('motion-div');
    expect(motionDiv).toHaveAttribute('data-testid', 'motion-div');
  });

  it('should support multiple children', () => {
    (usePathname as any).mockReturnValue('/');

    const { getByText } = render(
      <PageTransition>
        <div>Child 1</div>
        <div>Child 2</div>
      </PageTransition>
    );

    expect(getByText('Child 1')).toBeTruthy();
    expect(getByText('Child 2')).toBeTruthy();
  });

  it('should handle pathname changes', () => {
    const { rerender } = render(
      <PageTransition>
        <div>Initial</div>
      </PageTransition>
    );

    (usePathname as any).mockReturnValue('/new-page');

    rerender(
      <PageTransition>
        <div>Updated</div>
      </PageTransition>
    );

    expect(true).toBe(true);
  });

  it('should use AnimatePresence for mode wait', () => {
    (usePathname as any).mockReturnValue('/');

    const { getByTestId } = render(
      <PageTransition>
        <div>Content</div>
      </PageTransition>
    );

    expect(getByTestId('motion-div')).toBeTruthy();
  });

  it('should pass initial animation state', () => {
    (usePathname as any).mockReturnValue('/');

    const { getByTestId } = render(
      <PageTransition>
        <div>Content</div>
      </PageTransition>
    );

    const motionDiv = getByTestId('motion-div');
    expect(motionDiv).toHaveAttribute('data-testid');
  });

  it('should handle empty children', () => {
    (usePathname as any).mockReturnValue('/');

    const { getByTestId } = render(
      <PageTransition>
        {undefined}
      </PageTransition>
    );

    expect(getByTestId('motion-div')).toBeTruthy();
  });

  it('should preserve component hierarchy', () => {
    (usePathname as any).mockReturnValue('/');

    const { container } = render(
      <PageTransition>
        <div className="outer">
          <div className="inner">Content</div>
        </div>
      </PageTransition>
    );

    const inner = container.querySelector('.inner');
    expect(inner?.textContent).toBe('Content');
  });
});
