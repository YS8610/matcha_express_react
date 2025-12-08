import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('should render with default variant (primary)', () => {
      const { container } = render(<Button>Test</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('from-green-600', 'to-green-500');
    });

    it('should render with default size (md)', () => {
      const { container } = render(<Button>Test</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
    });
  });

  describe('Variants', () => {
    it('should apply primary variant styles', () => {
      const { container } = render(<Button variant="primary">Primary</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-gradient-to-r', 'from-green-600', 'text-white');
    });

    it('should apply secondary variant styles', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-white', 'border-2', 'border-green-600');
    });

    it('should apply danger variant styles', () => {
      const { container } = render(<Button variant="danger">Danger</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-red-500', 'text-white');
    });

    it('should apply ghost variant styles', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-transparent', 'hover:bg-gray-100');
    });
  });

  describe('Sizes', () => {
    it('should apply small size styles', () => {
      const { container } = render(<Button size="sm">Small</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-xs');
    });

    it('should apply medium size styles', () => {
      const { container } = render(<Button size="md">Medium</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
    });

    it('should apply large size styles', () => {
      const { container } = render(<Button size="lg">Large</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-base');
    });
  });

  describe('Full Width', () => {
    it('should not be full width by default', () => {
      const { container } = render(<Button>Test</Button>);
      const button = container.querySelector('button');
      expect(button).not.toHaveClass('w-full');
    });

    it('should apply full width when prop is true', () => {
      const { container } = render(<Button fullWidth>Full Width</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('w-full');
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading', () => {
      const { container } = render(<Button loading>Loading</Button>);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should disable button when loading', () => {
      render(<Button loading>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should show loading text when loading', () => {
      render(<Button loading>Click me</Button>);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not show spinner when not loading', () => {
      const { container } = render(<Button>Not Loading</Button>);
      expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should disable button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should have opacity when disabled', () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });
  });

  describe('Click Handler', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick} disabled>Click me</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick} loading>Click me</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<Button className="custom-class">Test</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should preserve default classes with custom className', () => {
      const { container } = render(<Button className="my-class">Test</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('rounded-lg', 'my-class');
    });
  });

  describe('HTML Button Attributes', () => {
    it('should support type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should support form attribute', () => {
      render(<Button form="my-form">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('form', 'my-form');
    });

    it('should support aria-label', () => {
      render(<Button aria-label="Close">X</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close');
    });
  });

  describe('Dark Mode Support', () => {
    it('should have dark mode classes for primary variant', () => {
      const { container } = render(<Button variant="primary">Test</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('dark:from-green-700', 'dark:to-green-600');
    });

    it('should have dark mode classes for secondary variant', () => {
      const { container } = render(<Button variant="secondary">Test</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('dark:bg-slate-700', 'dark:text-green-400');
    });
  });

  describe('Accessibility', () => {
    it('should have button role', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });
});
