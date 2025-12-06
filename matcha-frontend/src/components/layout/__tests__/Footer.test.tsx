import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<Footer />);
      expect(container).toBeTruthy();
    });

    it('should render a footer element', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should render with correct semantic HTML structure', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer?.tagName).toBe('FOOTER');
    });

    it('should have border-top class', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('border-t');
    });

    it('should have mt-auto class for positioning', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('mt-auto');
    });
  });

  describe('Content Display', () => {
    it('should display copyright text with correct year', () => {
      render(<Footer />);
      expect(screen.getByText('© 2025 Matcha')).toBeInTheDocument();
    });

    it('should display tagline text', () => {
      render(<Footer />);
      expect(screen.getByText('Where connections brew naturally, one cup at a time.')).toBeInTheDocument();
    });

    it('should render copyright text in bold', () => {
      render(<Footer />);
      const copyright = screen.getByText('© 2025 Matcha');
      expect(copyright).toHaveClass('font-bold');
    });

    it('should render tagline in italic', () => {
      render(<Footer />);
      const tagline = screen.getByText('Where connections brew naturally, one cup at a time.');
      expect(tagline).toHaveClass('italic');
    });
  });

  describe('Styling and CSS Variables', () => {
    it('should apply background-secondary CSS variable', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toHaveStyle({ backgroundColor: 'var(--background-secondary)' });
    });

    it('should apply border CSS variable', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer?.getAttribute('style')).toContain('border-color: var(--border)');
    });

    it('should apply foreground CSS variable for text color', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toHaveStyle({ color: 'var(--foreground)' });
    });

    it('should apply text-muted CSS variable to tagline', () => {
      render(<Footer />);
      const tagline = screen.getByText('Where connections brew naturally, one cup at a time.');
      expect(tagline).toHaveStyle({ color: 'var(--text-muted)' });
    });
  });

  describe('Layout and Responsive Classes', () => {
    it('should have max-width container', () => {
      const { container } = render(<Footer />);
      const contentDiv = container.querySelector('.max-w-7xl');
      expect(contentDiv).toBeInTheDocument();
    });

    it('should have responsive padding classes', () => {
      const { container } = render(<Footer />);
      const contentDiv = container.querySelector('.max-w-7xl');
      expect(contentDiv).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
    });

    it('should have responsive vertical padding classes', () => {
      const { container } = render(<Footer />);
      const contentDiv = container.querySelector('.max-w-7xl');
      expect(contentDiv).toHaveClass('py-4', 'sm:py-6');
    });

    it('should have centered text container', () => {
      const { container } = render(<Footer />);
      const textContainer = container.querySelector('.text-center');
      expect(textContainer).toBeInTheDocument();
    });

    it('should have space-y classes for vertical spacing', () => {
      const { container } = render(<Footer />);
      const textContainer = container.querySelector('.text-center');
      expect(textContainer).toHaveClass('space-y-2', 'sm:space-y-3');
    });
  });

  describe('Typography', () => {
    it('should apply responsive text sizing to copyright', () => {
      render(<Footer />);
      const copyright = screen.getByText('© 2025 Matcha');
      expect(copyright).toHaveClass('text-sm', 'sm:text-base');
    });

    it('should apply responsive text sizing to tagline', () => {
      render(<Footer />);
      const tagline = screen.getByText('Where connections brew naturally, one cup at a time.');
      expect(tagline).toHaveClass('text-xs', 'sm:text-sm');
    });

    it('should have horizontal padding on tagline', () => {
      render(<Footer />);
      const tagline = screen.getByText('Where connections brew naturally, one cup at a time.');
      expect(tagline).toHaveClass('px-2');
    });
  });

  describe('Accessibility', () => {
    it('should render copyright text in a paragraph element', () => {
      render(<Footer />);
      const copyright = screen.getByText('© 2025 Matcha');
      expect(copyright.tagName).toBe('P');
    });

    it('should render tagline in a paragraph element', () => {
      render(<Footer />);
      const tagline = screen.getByText('Where connections brew naturally, one cup at a time.');
      expect(tagline.tagName).toBe('P');
    });
  });

  describe('Edge Cases', () => {
    it('should render consistently on multiple renders', () => {
      const { rerender } = render(<Footer />);
      expect(screen.getByText('© 2025 Matcha')).toBeInTheDocument();

      rerender(<Footer />);
      expect(screen.getByText('© 2025 Matcha')).toBeInTheDocument();
      expect(screen.getByText('Where connections brew naturally, one cup at a time.')).toBeInTheDocument();
    });

    it('should not have any interactive elements', () => {
      const { container } = render(<Footer />);
      const buttons = container.querySelectorAll('button');
      const links = container.querySelectorAll('a');
      const inputs = container.querySelectorAll('input');

      expect(buttons).toHaveLength(0);
      expect(links).toHaveLength(0);
      expect(inputs).toHaveLength(0);
    });

    it('should maintain structure with empty beforeEach', () => {
      render(<Footer />);
      const footer = screen.getByText('© 2025 Matcha').closest('footer');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Snapshot Testing', () => {
    it('should match snapshot', () => {
      const { container } = render(<Footer />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
