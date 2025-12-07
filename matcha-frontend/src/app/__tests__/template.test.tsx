import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Template from '@/app/template';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    pathname: '/',
  })),
  usePathname: vi.fn(() => '/'),
}));

vi.mock('@/components/PageTransition', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-transition">{children}</div>
  ),
}));

describe('Template Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<Template><div>Test</div></Template>);
      expect(container).toBeTruthy();
    });

    it('should be defined', () => {
      expect(Template).toBeDefined();
      expect(typeof Template).toBe('function');
    });

    it('should render children content', () => {
      render(<Template><div data-testid="test-child">Test content</div></Template>);
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <Template>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
          <div data-testid="child3">Child 3</div>
        </Template>
      );
      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
      expect(screen.getByTestId('child3')).toBeInTheDocument();
    });
  });

  describe('PageTransition Component', () => {
    it('should render PageTransition wrapper', () => {
      render(<Template><div>Test</div></Template>);
      expect(screen.getByTestId('page-transition')).toBeInTheDocument();
    });

    it('should wrap children in PageTransition', () => {
      render(<Template><div data-testid="wrapped-child">Wrapped</div></Template>);
      const transition = screen.getByTestId('page-transition');
      const child = screen.getByTestId('wrapped-child');
      expect(transition).toContainElement(child);
    });

    it('should preserve children order in PageTransition', () => {
      const { container } = render(
        <Template>
          <div data-testid="first">First</div>
          <div data-testid="second">Second</div>
        </Template>
      );
      const first = screen.getByTestId('first');
      const second = screen.getByTestId('second');
      const elements = Array.from(container.querySelectorAll('[data-testid]'));
      const firstIndex = elements.indexOf(first);
      const secondIndex = elements.indexOf(second);
      expect(firstIndex).toBeLessThan(secondIndex);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      const { container } = render(<Template>{null}</Template>);
      expect(container).toBeTruthy();
      expect(screen.getByTestId('page-transition')).toBeInTheDocument();
    });

    it('should handle fragment children', () => {
      render(
        <Template>
          <>
            <div data-testid="fragment-child-1">Fragment 1</div>
            <div data-testid="fragment-child-2">Fragment 2</div>
          </>
        </Template>
      );
      expect(screen.getByTestId('fragment-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-child-2')).toBeInTheDocument();
    });

    it('should handle nested components', () => {
      render(
        <Template>
          <div>
            <div>
              <div data-testid="deeply-nested">Deeply nested content</div>
            </div>
          </div>
        </Template>
      );
      expect(screen.getByTestId('deeply-nested')).toBeInTheDocument();
    });

    it('should handle text nodes', () => {
      render(<Template>Plain text content</Template>);
      expect(screen.getByText('Plain text content')).toBeInTheDocument();
    });

    it('should handle mixed content types', () => {
      const { container } = render(
        <Template>
          Plain text
          <div data-testid="element">Element</div>
          More text
        </Template>
      );
      expect(container.textContent).toContain('Plain text');
      expect(screen.getByTestId('element')).toBeInTheDocument();
      expect(container.textContent).toContain('More text');
    });
  });
});
