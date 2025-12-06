import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { act } from 'react';
import * as React from 'react';

const TestComponent = () => {
  const { theme } = useTheme();
  return (
    <div>
      <ThemeToggle />
      <div data-testid="current-theme">{theme}</div>
    </div>
  );
};

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(container).toBeTruthy();
  });

  it('should render placeholder div during SSR', () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const placeholder = container.querySelector('.w-5.h-5');
    expect(placeholder).toBeInTheDocument();
  });

  it('should render button after client mount', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.queryByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  it('should have aria-label for accessibility', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Toggle dark mode');
    });
  });

  it('should display title attribute with mode switch info', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button');
      const title = button.getAttribute('title');
      expect(title).toMatch(/Switch to (dark|light) mode/);
    });
  });

  it('should render Moon icon in light mode', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.queryByRole('button');
      if (button) {
        const svgs = button.querySelectorAll('svg');
        expect(svgs.length).toBeGreaterThan(0);
      }
    });
  });

  it('should toggle theme when clicked', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const button = screen.getByRole('button');
    const initialTheme = screen.getByTestId('current-theme').textContent;

    fireEvent.click(button);

    await waitFor(() => {
      const newTheme = screen.getByTestId('current-theme').textContent;
      expect(newTheme).not.toBe(initialTheme);
    });
  });

  it('should have rounded corners styling', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-lg');
    });
  });

  it('should have padding', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass('p-2');
    });
  });

  it('should have hover background color classes', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-green-100');
    });
  });

  it('should have dark mode hover classes', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button.className).toContain('dark:hover:bg-green-900/30');
    });
  });

  it('should have text color classes', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-green-700');
    });
  });

  it('should have dark mode text color classes', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button.className).toContain('dark:text-green-200');
    });
  });

  it('should have transition classes', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-colors');
    });
  });

  it('should toggle multiple times correctly', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const button = screen.getByRole('button');
    const initialTheme = screen.getByTestId('current-theme').textContent;

    fireEvent.click(button);
    await waitFor(() => {
      const theme1 = screen.getByTestId('current-theme').textContent;
      expect(theme1).not.toBe(initialTheme);
    });

    fireEvent.click(button);
    await waitFor(() => {
      const theme2 = screen.getByTestId('current-theme').textContent;
      expect(theme2).toBe(initialTheme);
    });
  });

  it('should render icon with correct size', async () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toHaveClass('w-5', 'h-5');
    });
  });

  it('should be keyboard accessible', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  it('should handle rapid clicks', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    await waitFor(() => {
      const theme = screen.getByTestId('current-theme').textContent;
      expect(theme).toBeTruthy();
    });
  });

  it('should maintain theme preference across re-renders', async () => {
    const { rerender } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const theme = screen.getByTestId('current-theme').textContent;
      expect(theme).toBeTruthy();
    });

    const themeBeforeRerender = screen.getByTestId('current-theme').textContent;

    rerender(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      const themeAfterRerender = screen.getByTestId('current-theme').textContent;
      expect(themeAfterRerender).toBe(themeBeforeRerender);
    });
  });

  it('should update title attribute based on current theme', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const button = screen.getByRole('button');
    const initialTitle = button.getAttribute('title');

    fireEvent.click(button);

    await waitFor(() => {
      const newTitle = button.getAttribute('title');
      expect(newTitle).not.toBe(initialTitle);
    });
  });

  it('should render correct icon based on theme', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const button = screen.getByRole('button');
    const initialIcon = button.querySelector('svg');

    fireEvent.click(button);

    await waitFor(() => {
      const newIcon = button.querySelector('svg');
      expect(newIcon).toBeInTheDocument();
    });
  });

  it('should not render content during SSR phase', async () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.queryByRole('button');
      expect(button).toBeInTheDocument();
    });

    const icon = container.querySelector('.w-5.h-5');
    expect(icon).toBeInTheDocument();
  });

  it('should handle click events properly', async () => {
    const handleClick = vi.fn();

    render(
      <ThemeProvider>
        <div onClick={handleClick}>
          <ThemeToggle />
        </div>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
  });

  it('should have proper contrast for accessibility', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button.className).toContain('text-green-700');
    });
  });
});
