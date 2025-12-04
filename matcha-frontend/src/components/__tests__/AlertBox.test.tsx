import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('AlertBox Component', () => {
  type AlertType = 'success' | 'error' | 'warning' | 'info';

  interface AlertBoxProps {
    message: string;
    type: AlertType;
    onClose?: () => void;
    dismissible?: boolean;
    autoClose?: boolean;
    duration?: number;
  }

  const AlertBox = ({
    message,
    type,
    onClose,
    dismissible = true,
    autoClose = false,
    duration = 5000,
  }: AlertBoxProps) => {
    return (
      <div className={`alert alert-${type}`} role="alert" data-testid={`alert-${type}`}>
        <div className="alert-content">
          <span>{message}</span>
        </div>
        {dismissible && onClose && (
          <button
            onClick={onClose}
            aria-label="Close alert"
            className="alert-close"
          >
            ✕
          </button>
        )}
      </div>
    );
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render success alert', () => {
    render(
      <AlertBox
        message="Operation successful"
        type="success"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId('alert-success')).toBeInTheDocument();
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
  });

  it('should render error alert', () => {
    render(
      <AlertBox
        message="An error occurred"
        type="error"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId('alert-error')).toBeInTheDocument();
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('should render warning alert', () => {
    render(
      <AlertBox
        message="Please be careful"
        type="warning"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId('alert-warning')).toBeInTheDocument();
  });

  it('should render info alert', () => {
    render(
      <AlertBox
        message="Information message"
        type="info"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId('alert-info')).toBeInTheDocument();
  });

  it('should have proper ARIA role', () => {
    render(
      <AlertBox
        message="Test message"
        type="info"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should show close button when dismissible', () => {
    render(
      <AlertBox
        message="Dismissible alert"
        type="info"
        onClose={mockOnClose}
        dismissible={true}
      />
    );

    expect(screen.getByLabelText('Close alert')).toBeInTheDocument();
  });

  it('should not show close button when not dismissible', () => {
    render(
      <AlertBox
        message="Non-dismissible alert"
        type="info"
        dismissible={false}
      />
    );

    expect(screen.queryByLabelText('Close alert')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AlertBox
        message="Test alert"
        type="info"
        onClose={mockOnClose}
        dismissible={true}
      />
    );

    const closeButton = screen.getByLabelText('Close alert');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it('should display custom message', () => {
    const customMessage = 'This is a very specific error message';
    render(
      <AlertBox
        message={customMessage}
        type="error"
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('should apply correct CSS class based on type', () => {
    const { rerender } = render(
      <AlertBox
        message="Test"
        type="success"
        onClose={mockOnClose}
      />
    );

    let alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert-success');

    rerender(
      <AlertBox
        message="Test"
        type="error"
        onClose={mockOnClose}
      />
    );

    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert-error');
  });

  it('should handle multiple alerts independently', () => {
    const onClose1 = vi.fn();
    const onClose2 = vi.fn();

    render(
      <>
        <AlertBox
          message="Alert 1"
          type="success"
          onClose={onClose1}
        />
        <AlertBox
          message="Alert 2"
          type="error"
          onClose={onClose2}
        />
      </>
    );

    expect(screen.getByText('Alert 1')).toBeInTheDocument();
    expect(screen.getByText('Alert 2')).toBeInTheDocument();
  });
});
