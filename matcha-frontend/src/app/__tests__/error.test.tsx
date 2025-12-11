import React from 'react';
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    pathname: '/',
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

describe('Error Page', () => {
  let ErrorComponent: any;
  const mockError = new globalThis.Error('Test error message');
  const mockReset = vi.fn();
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeAll(async () => {
    const module = await import('@/app/error');
    ErrorComponent = module.default;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockClear();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should render without crashing', async () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);
    await waitFor(() => {
      expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
    });
  });

  it('should display 500 error code', async () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);
    await waitFor(() => {
      expect(screen.getByText('500')).toBeInTheDocument();
    });
  });

  it('should display error message', async () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);
    await waitFor(() => {
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });
  });

  it('should display default error description', async () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);
    await waitFor(() => {
      expect(
        screen.getByText(/We encountered an unexpected error/i)
      ).toBeInTheDocument();
    });
  });

  it('should render Try Again button', async () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('should render Go to Browse link', async () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);
    await waitFor(() => {
      expect(screen.getByText('Go to Browse')).toBeInTheDocument();
    });
  });

  it('should call reset function when Try Again button is clicked', async () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    const resetButton = screen.getByText('Try Again');
    fireEvent.click(resetButton);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('should render error component on mount', async () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    await waitFor(() => {
      expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
      expect(screen.getByText(mockError.message)).toBeInTheDocument();
    });
  });

  it('should handle error with digest property', async () => {
    const errorWithDigest = Object.assign(new Error('Error with digest'), {
      digest: 'abc123',
    });

    render(<ErrorComponent error={errorWithDigest} reset={mockReset} />);

    await waitFor(() => {
      expect(screen.getByText('Error with digest')).toBeInTheDocument();
    });
  });

  it('should handle client-side rendering', async () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);
    await waitFor(() => {
      expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
    });
  });

  it('should render content after mounting', async () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    await waitFor(() => {
      expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
    });
  });

  it('should have correct link href to browse page', async () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    await waitFor(() => {
      const link = screen.getByText('Go to Browse').closest('a');
      expect(link).toHaveAttribute('href', '/browse');
    });
  });

  it('should render AlertTriangle icon', async () => {
    const { container } = render(<ErrorComponent error={mockError} reset={mockReset} />);

    await waitFor(() => {
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });
  });

  it('should render RefreshCw icon in Try Again button', async () => {
    const { container } = render(<ErrorComponent error={mockError} reset={mockReset} />);

    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    const button = screen.getByText('Try Again').closest('button');
    const svgs = button?.querySelectorAll('svg');
    expect(svgs?.length).toBeGreaterThan(0);
  });

  it('should render Home icon in Go to Browse link', async () => {
    const { container } = render(<ErrorComponent error={mockError} reset={mockReset} />);

    await waitFor(() => {
      expect(screen.getByText('Go to Browse')).toBeInTheDocument();
    });

    const link = screen.getByText('Go to Browse').closest('a');
    const svgs = link?.querySelectorAll('svg');
    expect(svgs?.length).toBeGreaterThan(0);
  });

  it('should handle error without message', async () => {
    const errorWithoutMessage = new Error();
    errorWithoutMessage.message = '';

    const { container } = render(
      <ErrorComponent error={errorWithoutMessage} reset={mockReset} />
    );

    await waitFor(() => {
      expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
    });

    const errorMessageBox = container.querySelector('.font-mono');
    expect(errorMessageBox).toBeNull();
  });

  it('should display error message in monospace font', async () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    await waitFor(() => {
      const errorMessage = screen.getByText('Test error message');
      expect(errorMessage).toHaveClass('font-mono');
    });
  });

  it('should have gradient background', async () => {
    const { container } = render(<ErrorComponent error={mockError} reset={mockReset} />);

    await waitFor(() => {
      expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
    });

    const mainDiv = container.querySelector('.bg-gradient-to-br');
    expect(mainDiv).toBeInTheDocument();
  });

  it('should center content on screen', async () => {
    const { container } = render(<ErrorComponent error={mockError} reset={mockReset} />);

    await waitFor(() => {
      expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
    });

    const mainDiv = container.querySelector('.min-h-screen');
    expect(mainDiv).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('should have responsive padding', async () => {
    const { container } = render(<ErrorComponent error={mockError} reset={mockReset} />);

    await waitFor(() => {
      expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
    });

    const mainDiv = container.querySelector('.min-h-screen');
    expect(mainDiv).toHaveClass('p-4');
  });

  it('should display error in red-themed box', async () => {
    const { container } = render(<ErrorComponent error={mockError} reset={mockReset} />);

    await waitFor(() => {
      const errorBox = container.querySelector('.bg-red-50');
      expect(errorBox).toBeInTheDocument();
    });
  });

  it('should handle multiple reset button clicks', async () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    const resetButton = screen.getByText('Try Again');
    fireEvent.click(resetButton);
    fireEvent.click(resetButton);
    fireEvent.click(resetButton);

    expect(mockReset).toHaveBeenCalledTimes(3);
  });

  it('should have hover effects on buttons', async () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    await waitFor(() => {
      const resetButton = screen.getByText('Try Again').closest('button');
      expect(resetButton).toHaveClass('hover:from-green-700');
    });
  });

  it('should break long error messages', async () => {
    const longError = new Error('A'.repeat(200));
    render(<ErrorComponent error={longError} reset={mockReset} />);

    await waitFor(() => {
      const errorMessage = screen.getByText('A'.repeat(200));
      expect(errorMessage).toHaveClass('break-words');
    });
  });

  it('should use flexbox for button layout', async () => {
    const { container } = render(<ErrorComponent error={mockError} reset={mockReset} />);

    await waitFor(() => {
      const buttonContainer = container.querySelector('.flex.flex-col.gap-3');
      expect(buttonContainer).toBeInTheDocument();
    });
  });
});
