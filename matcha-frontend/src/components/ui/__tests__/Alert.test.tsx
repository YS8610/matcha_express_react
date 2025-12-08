import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alert from '../Alert';

describe('Alert Component', () => {
  describe('Basic Rendering', () => {
    it('should render alert with message', () => {
      render(<Alert type="info" message="Test message" />);

      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should render alert with icon', () => {
      const { container } = render(<Alert type="error" message="Error message" />);

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should have proper styling classes', () => {
      const { container } = render(<Alert type="success" message="Success" />);

      const alert = container.firstChild;
      expect(alert).toHaveClass('border', 'px-4', 'py-3', 'rounded-md', 'flex');
    });
  });

  describe('Alert Types', () => {
    it('should render error alert with correct styling', () => {
      const { container } = render(<Alert type="error" message="Error" />);

      const alert = container.firstChild;
      expect(alert).toHaveClass('bg-red-100', 'border-red-400', 'text-red-700');
    });

    it('should render success alert with correct styling', () => {
      const { container } = render(<Alert type="success" message="Success" />);

      const alert = container.firstChild;
      expect(alert).toHaveClass('bg-green-100', 'border-green-400', 'text-green-700');
    });

    it('should render warning alert with correct styling', () => {
      const { container } = render(<Alert type="warning" message="Warning" />);

      const alert = container.firstChild;
      expect(alert).toHaveClass('bg-amber-100', 'border-amber-400', 'text-amber-700');
    });

    it('should render info alert with correct styling', () => {
      const { container } = render(<Alert type="info" message="Info" />);

      const alert = container.firstChild;
      expect(alert).toHaveClass('bg-blue-100', 'border-blue-400', 'text-blue-700');
    });
  });

  describe('Close Button', () => {
    it('should not show close button when onClose is not provided', () => {
      render(<Alert type="info" message="Message" />);

      expect(screen.queryByLabelText('Close alert')).not.toBeInTheDocument();
    });

    it('should show close button when onClose is provided', () => {
      const mockOnClose = vi.fn();
      render(<Alert type="info" message="Message" onClose={mockOnClose} />);

      expect(screen.getByLabelText('Close alert')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
      const mockOnClose = vi.fn();
      const user = userEvent.setup();
      render(<Alert type="info" message="Message" onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText('Close alert');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should have X icon in close button', () => {
      const mockOnClose = vi.fn();
      const { container } = render(<Alert type="info" message="Message" onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText('Close alert');
      const icon = closeButton.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should have hover effect on close button', () => {
      const mockOnClose = vi.fn();
      render(<Alert type="info" message="Message" onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText('Close alert');
      expect(closeButton).toHaveClass('hover:opacity-100', 'transition-opacity');
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <Alert type="info" message="Message" className="custom-class" />
      );

      const alert = container.firstChild;
      expect(alert).toHaveClass('custom-class');
    });

    it('should preserve default classes with custom className', () => {
      const { container } = render(
        <Alert type="success" message="Message" className="my-custom-class" />
      );

      const alert = container.firstChild;
      expect(alert).toHaveClass('border', 'rounded-md', 'my-custom-class');
    });

    it('should work without custom className', () => {
      const { container } = render(<Alert type="info" message="Message" />);

      const alert = container.firstChild;
      expect(alert).not.toHaveClass('undefined');
    });
  });

  describe('Children Content', () => {
    it('should render children when provided', () => {
      render(
        <Alert type="info" message="Main message">
          <div data-testid="child-content">Child content</div>
        </Alert>
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should render message and children together', () => {
      render(
        <Alert type="error" message="Error occurred">
          <p>Additional details</p>
        </Alert>
      );

      expect(screen.getByText('Error occurred')).toBeInTheDocument();
      expect(screen.getByText('Additional details')).toBeInTheDocument();
    });

    it('should not render children when not provided', () => {
      const { container } = render(<Alert type="info" message="Message" />);

      const flexDiv = container.querySelector('.flex-1');
      expect(flexDiv?.children.length).toBe(1); // Only the message paragraph
    });
  });

  describe('Icons for Each Type', () => {
    it('should render AlertCircle icon for error type', () => {
      const { container } = render(<Alert type="error" message="Error" />);

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('w-5', 'h-5', 'flex-shrink-0');
    });

    it('should render CheckCircle icon for success type', () => {
      const { container } = render(<Alert type="success" message="Success" />);

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should render AlertTriangle icon for warning type', () => {
      const { container } = render(<Alert type="warning" message="Warning" />);

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should render Info icon for info type', () => {
      const { container } = render(<Alert type="info" message="Info" />);

      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Dark Mode Support', () => {
    it('should have dark mode classes for error type', () => {
      const { container } = render(<Alert type="error" message="Error" />);

      const alert = container.firstChild;
      expect(alert).toHaveClass('dark:bg-red-900/20', 'dark:border-red-600', 'dark:text-red-200');
    });

    it('should have dark mode classes for success type', () => {
      const { container } = render(<Alert type="success" message="Success" />);

      const alert = container.firstChild;
      expect(alert).toHaveClass('dark:bg-green-900/20', 'dark:border-green-600', 'dark:text-green-200');
    });

    it('should have dark mode classes for warning type', () => {
      const { container } = render(<Alert type="warning" message="Warning" />);

      const alert = container.firstChild;
      expect(alert).toHaveClass('dark:bg-amber-900/20', 'dark:border-amber-600', 'dark:text-amber-200');
    });

    it('should have dark mode classes for info type', () => {
      const { container } = render(<Alert type="info" message="Info" />);

      const alert = container.firstChild;
      expect(alert).toHaveClass('dark:bg-blue-900/20', 'dark:border-blue-600', 'dark:text-blue-200');
    });
  });

  describe('Layout', () => {
    it('should have flex layout', () => {
      const { container } = render(<Alert type="info" message="Message" />);

      const alert = container.firstChild;
      expect(alert).toHaveClass('flex', 'items-start', 'gap-2');
    });

    it('should have flex-1 on content container', () => {
      const { container } = render(<Alert type="info" message="Message" />);

      const contentDiv = container.querySelector('.flex-1');
      expect(contentDiv).toBeInTheDocument();
    });

    it('should have flex-shrink-0 on icon', () => {
      const { container } = render(<Alert type="info" message="Message" />);

      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('flex-shrink-0');
    });
  });

  describe('Message Display', () => {
    it('should render long messages', () => {
      const longMessage = 'This is a very long error message that should wrap properly and display all the information needed for the user to understand what went wrong.';
      render(<Alert type="error" message={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should have text-sm class on message', () => {
      const { container } = render(<Alert type="info" message="Message" />);

      const messageElement = screen.getByText('Message');
      expect(messageElement).toHaveClass('text-sm');
    });
  });

  describe('Complete Usage Scenarios', () => {
    it('should render closeable error alert', async () => {
      const mockOnClose = vi.fn();
      const user = userEvent.setup();
      render(
        <Alert
          type="error"
          message="An error occurred"
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('An error occurred')).toBeInTheDocument();

      const closeButton = screen.getByLabelText('Close alert');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should render success alert with children', () => {
      render(
        <Alert type="success" message="Profile saved successfully" className="mb-4">
          <p className="text-xs mt-1">Your changes have been published.</p>
        </Alert>
      );

      expect(screen.getByText('Profile saved successfully')).toBeInTheDocument();
      expect(screen.getByText('Your changes have been published.')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible close button label', () => {
      const mockOnClose = vi.fn();
      render(<Alert type="info" message="Message" onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText('Close alert');
      expect(closeButton).toHaveAccessibleName('Close alert');
    });

    it('should have button role for close button', () => {
      const mockOnClose = vi.fn();
      render(<Alert type="info" message="Message" onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: 'Close alert' });
      expect(closeButton).toBeInTheDocument();
    });
  });
});
