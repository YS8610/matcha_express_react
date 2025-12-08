import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState from '../EmptyState';

describe('EmptyState Component', () => {
  const mockIcon = <svg data-testid="test-icon">Icon</svg>;

  describe('Basic Rendering', () => {
    it('should render with required props', () => {
      render(
        <EmptyState
          icon={mockIcon}
          title="No items found"
        />
      );

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    it('should render icon inside circular container', () => {
      render(
        <EmptyState
          icon={mockIcon}
          title="Empty"
        />
      );

      const iconContainer = screen.getByTestId('test-icon').parentElement;
      expect(iconContainer).toHaveClass('inline-flex', 'rounded-full', 'w-16', 'h-16');
    });

    it('should render title with correct styling', () => {
      render(
        <EmptyState
          icon={mockIcon}
          title="Test Title"
        />
      );

      const title = screen.getByText('Test Title');
      expect(title).toHaveClass('text-gray-500', 'font-medium');
    });
  });

  describe('Optional Description', () => {
    it('should render description when provided', () => {
      render(
        <EmptyState
          icon={mockIcon}
          title="No items"
          description="Try adding some items to get started"
        />
      );

      expect(screen.getByText('Try adding some items to get started')).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      const { container } = render(
        <EmptyState
          icon={mockIcon}
          title="No items"
        />
      );

      const descriptions = container.querySelectorAll('.text-sm');
      expect(descriptions.length).toBe(0);
    });

    it('should render description with correct styling', () => {
      render(
        <EmptyState
          icon={mockIcon}
          title="Empty"
          description="Test description"
        />
      );

      const description = screen.getByText('Test description');
      expect(description).toHaveClass('text-gray-400', 'text-sm');
    });
  });

  describe('Optional Action Button', () => {
    it('should render action button when provided', () => {
      const mockAction = vi.fn();

      render(
        <EmptyState
          icon={mockIcon}
          title="No items"
          action={{
            label: "Add Item",
            onClick: mockAction
          }}
        />
      );

      expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument();
    });

    it('should not render action button when not provided', () => {
      render(
        <EmptyState
          icon={mockIcon}
          title="No items"
        />
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should call onClick when action button is clicked', async () => {
      const mockAction = vi.fn();
      const user = userEvent.setup();

      render(
        <EmptyState
          icon={mockIcon}
          title="No items"
          action={{
            label: "Add Item",
            onClick: mockAction
          }}
        />
      );

      const button = screen.getByRole('button', { name: 'Add Item' });
      await user.click(button);

      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('should render action button with correct styling', () => {
      const mockAction = vi.fn();

      render(
        <EmptyState
          icon={mockIcon}
          title="Empty"
          action={{
            label: "Click Me",
            onClick: mockAction
          }}
        />
      );

      const button = screen.getByRole('button', { name: 'Click Me' });
      expect(button).toHaveClass('bg-gradient-to-r', 'text-white', 'rounded-lg');
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <EmptyState
          icon={mockIcon}
          title="Test"
          className="custom-class"
        />
      );

      const emptyState = container.firstChild;
      expect(emptyState).toHaveClass('custom-class');
    });

    it('should preserve default classes when custom className is provided', () => {
      const { container } = render(
        <EmptyState
          icon={mockIcon}
          title="Test"
          className="custom-class"
        />
      );

      const emptyState = container.firstChild;
      expect(emptyState).toHaveClass('text-center', 'py-12', 'custom-class');
    });

    it('should work without custom className', () => {
      const { container } = render(
        <EmptyState
          icon={mockIcon}
          title="Test"
        />
      );

      const emptyState = container.firstChild;
      expect(emptyState).toHaveClass('text-center', 'py-12');
    });
  });

  describe('Complete Usage', () => {
    it('should render all props together correctly', async () => {
      const mockAction = vi.fn();
      const user = userEvent.setup();

      render(
        <EmptyState
          icon={mockIcon}
          title="No conversations yet"
          description="Match with someone to start chatting"
          action={{
            label: "Browse Profiles",
            onClick: mockAction
          }}
          className="my-custom-class"
        />
      );

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('No conversations yet')).toBeInTheDocument();
      expect(screen.getByText('Match with someone to start chatting')).toBeInTheDocument();

      const button = screen.getByRole('button', { name: 'Browse Profiles' });
      expect(button).toBeInTheDocument();

      await user.click(button);
      expect(mockAction).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper text hierarchy', () => {
      render(
        <EmptyState
          icon={mockIcon}
          title="Main message"
          description="Secondary message"
        />
      );

      const title = screen.getByText('Main message');
      const description = screen.getByText('Secondary message');

      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });

    it('should have clickable button when action is provided', () => {
      const mockAction = vi.fn();

      render(
        <EmptyState
          icon={mockIcon}
          title="Empty"
          action={{
            label: "Action",
            onClick: mockAction
          }}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAccessibleName('Action');
    });
  });
});
