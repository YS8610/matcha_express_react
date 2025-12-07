import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NotFound from '@/app/not-found';

const mockBack = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    pathname: '/',
    back: mockBack,
  })),
  usePathname: vi.fn(() => '/'),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('NotFound Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<NotFound />);
      expect(container).toBeTruthy();
    });

    it('should display 404 error code', () => {
      render(<NotFound />);
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should display "Page Not Found" heading', () => {
      render(<NotFound />);
      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    it('should display error description', () => {
      render(<NotFound />);
      expect(screen.getByText(/The page you're looking for doesn't exist/i)).toBeInTheDocument();
    });
  });

  describe('Navigation Buttons', () => {
    it('should render "Go Back" button', () => {
      render(<NotFound />);
      expect(screen.getByText('Go Back')).toBeInTheDocument();
    });

    it('should render "Go to Browse" link', () => {
      render(<NotFound />);
      expect(screen.getByText('Go to Browse')).toBeInTheDocument();
    });

    it('should render "Go to Home" link', () => {
      render(<NotFound />);
      expect(screen.getByText('Go to Home')).toBeInTheDocument();
    });

    it('should call router.back() when "Go Back" button is clicked', () => {
      render(<NotFound />);
      const backButton = screen.getByText('Go Back');
      fireEvent.click(backButton);
      expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it('should have correct href for "Go to Browse" link', () => {
      render(<NotFound />);
      const browseLink = screen.getByText('Go to Browse').closest('a');
      expect(browseLink).toHaveAttribute('href', '/browse');
    });

    it('should have correct href for "Go to Home" link', () => {
      render(<NotFound />);
      const homeLink = screen.getByText('Go to Home').closest('a');
      expect(homeLink).toHaveAttribute('href', '/');
    });
  });

  describe('Icons', () => {
    it('should render AlertCircle icon', () => {
      const { container } = render(<NotFound />);
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('should render ArrowLeft icon in Go Back button', () => {
      render(<NotFound />);
      const backButton = screen.getByText('Go Back').closest('button');
      const svgs = backButton?.querySelectorAll('svg');
      expect(svgs?.length).toBeGreaterThan(0);
    });

    it('should render Home icon in Go to Browse link', () => {
      render(<NotFound />);
      const browseLink = screen.getByText('Go to Browse').closest('a');
      const svgs = browseLink?.querySelectorAll('svg');
      expect(svgs?.length).toBeGreaterThan(0);
    });
  });

  describe('Styling', () => {
    it('should have gradient background', () => {
      const { container } = render(<NotFound />);
      const mainDiv = container.querySelector('.bg-gradient-to-br');
      expect(mainDiv).toBeInTheDocument();
    });

    it('should center content on screen', () => {
      const { container } = render(<NotFound />);
      const mainDiv = container.querySelector('.min-h-screen');
      expect(mainDiv).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('should have green-themed design', () => {
      const { container } = render(<NotFound />);
      const heading = screen.getByText('404');
      expect(heading).toHaveClass('bg-gradient-to-r', 'from-green-600');
    });
  });
});
