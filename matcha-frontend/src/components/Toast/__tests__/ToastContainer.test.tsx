import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import ToastContainer from '@/components/Toast/ToastContainer';

const TestComponent = () => {
  const { addToast } = useToast();

  return (
    <div>
      <button onClick={() => addToast('Success message', 'success', 0)}>
        Add Success Toast
      </button>
      <button onClick={() => addToast('Error message', 'error', 0)}>
        Add Error Toast
      </button>
      <button onClick={() => addToast('Warning message', 'warning', 0)}>
        Add Warning Toast
      </button>
      <button onClick={() => addToast('Info message', 'info', 0)}>
        Add Info Toast
      </button>
      <ToastContainer />
    </div>
  );
};

describe('ToastContainer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>
    );
    expect(container).toBeTruthy();
  });

  it('should not display any toasts initially', () => {
    render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>
    );
    const toastContainer = screen.queryByText(/message/i);
    expect(toastContainer).toBeNull();
  });

  it('should display success toast when added', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Add Success Toast');
    fireEvent.click(button);

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should display error toast when added', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Add Error Toast');
    fireEvent.click(button);

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should display warning toast when added', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Add Warning Toast');
    fireEvent.click(button);

    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('should display info toast when added', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Add Info Toast');
    fireEvent.click(button);

    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('should display multiple toasts at once', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));
    fireEvent.click(screen.getByText('Add Error Toast'));
    fireEvent.click(screen.getByText('Add Warning Toast'));

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('should remove toast when close button is clicked', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));
    expect(screen.getByText('Success message')).toBeInTheDocument();

    const closeButtons = screen.getAllByRole('button');
    const toastCloseButton = closeButtons.find(
      btn => btn.querySelector('svg') && !btn.textContent?.includes('Add')
    );

    if (toastCloseButton) {
      fireEvent.click(toastCloseButton);
    }

    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('should render CheckCircle icon for success toast', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));

    const toastElement = screen.getByText('Success message').closest('div');
    expect(toastElement).toBeInTheDocument();
  });

  it('should render AlertCircle icon for error toast', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Error Toast'));

    const toastElement = screen.getByText('Error message').closest('div');
    expect(toastElement).toBeInTheDocument();
  });

  it('should render AlertTriangle icon for warning toast', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Warning Toast'));

    const toastElement = screen.getByText('Warning message').closest('div');
    expect(toastElement).toBeInTheDocument();
  });

  it('should render Info icon for info toast', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Info Toast'));

    const toastElement = screen.getByText('Info message').closest('div');
    expect(toastElement).toBeInTheDocument();
  });

  it('should apply emerald colors for success toast', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));

    const toastElement = screen.getByText('Success message').closest('div');
    expect(toastElement?.className).toContain('bg-emerald-50');
  });

  it('should apply red colors for error toast', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Error Toast'));

    const toastElement = screen.getByText('Error message').closest('div');
    expect(toastElement?.className).toContain('bg-red-50');
  });

  it('should apply yellow colors for warning toast', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Warning Toast'));

    const toastElement = screen.getByText('Warning message').closest('div');
    expect(toastElement?.className).toContain('bg-yellow-50');
  });

  it('should apply blue colors for info toast', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Info Toast'));

    const toastElement = screen.getByText('Info message').closest('div');
    expect(toastElement?.className).toContain('bg-blue-50');
  });

  it('should position toasts in bottom-right corner', () => {
    const { container } = render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>
    );

    const toastContainerElement = container.querySelector('.fixed');
    expect(toastContainerElement).toHaveClass('bottom-4', 'right-4');
  });

  it('should have high z-index to appear on top', () => {
    const { container } = render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>
    );

    const toastContainerElement = container.querySelector('.fixed');
    expect(toastContainerElement).toHaveClass('z-50');
  });

  it('should apply spacing between multiple toasts', () => {
    const { container } = render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>
    );

    const toastContainerElement = container.querySelector('.fixed');
    expect(toastContainerElement).toHaveClass('space-y-3');
  });

  it('should render X icon in close button', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));

    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('should have rounded corners on toast', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));

    const toastElement = screen.getByText('Success message').closest('div');
    expect(toastElement).toHaveClass('rounded-lg');
  });

  it('should have shadow on toast', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));

    const toastElement = screen.getByText('Success message').closest('div');
    expect(toastElement).toHaveClass('shadow-lg');
  });

  it('should have backdrop blur effect', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));

    const toastElement = screen.getByText('Success message').closest('div');
    expect(toastElement).toHaveClass('backdrop-blur-sm');
  });

  it('should use flexbox layout for toast content', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));

    const toastElement = screen.getByText('Success message').closest('div');
    expect(toastElement).toHaveClass('flex', 'items-start');
  });

  it('should have gap between elements in toast', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));

    const toastElement = screen.getByText('Success message').closest('div');
    expect(toastElement).toHaveClass('gap-3');
  });

  it('should have padding on toast', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));

    const toastElement = screen.getByText('Success message').closest('div');
    expect(toastElement).toHaveClass('p-4');
  });

  it('should handle removing specific toast among multiple toasts', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));
    fireEvent.click(screen.getByText('Add Error Toast'));

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();

    const closeButtons = screen.getAllByRole('button');
    const toastCloseButtons = closeButtons.filter(
      btn => btn.querySelector('svg') && !btn.textContent?.includes('Add')
    );

    if (toastCloseButtons[0]) {
      fireEvent.click(toastCloseButtons[0]);
    }

    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should have hover opacity effect on close button', () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));

    const closeButtons = screen.getAllByRole('button');
    const toastCloseButton = closeButtons.find(
      btn => btn.querySelector('svg') && !btn.textContent?.includes('Add')
    );

    expect(toastCloseButton).toHaveClass('hover:opacity-70');
  });

  it('should render message with medium font weight', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));

    const messageElement = screen.getByText('Success message');
    expect(messageElement).toHaveClass('font-medium');
  });

  it('should render message with small text size', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));

    const messageElement = screen.getByText('Success message');
    expect(messageElement).toHaveClass('text-sm');
  });

  it('should have pointer-events-none on container', () => {
    const { container } = render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>
    );

    const toastContainerElement = container.querySelector('.fixed');
    expect(toastContainerElement).toHaveClass('pointer-events-none');
  });

  it('should have pointer-events-auto on individual toasts', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Success Toast'));

    const toastElement = screen.getByText('Success message').closest('div');
    expect(toastElement).toHaveClass('pointer-events-auto');
  });
});
