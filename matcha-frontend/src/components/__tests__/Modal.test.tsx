import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Modal Component', () => {
  interface ModalProps {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    actions?: React.ReactNode;
  }

  const Modal = ({
    isOpen,
    title,
    children,
    onClose,
    actions,
  }: ModalProps) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose} data-testid="modal-overlay">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{title}</h2>
            <button onClick={onClose} aria-label="Close">Close</button>
          </div>
          <div className="modal-body">{children}</div>
          {actions && <div className="modal-footer">{actions}</div>}
        </div>
      </div>
    );
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <Modal
        isOpen={false}
        title="Test Modal"
        onClose={mockOnClose}
      >
        <p>Content</p>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(
      <Modal
        isOpen={true}
        title="Test Modal"
        onClose={mockOnClose}
      >
        <p>Content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Modal
        isOpen={true}
        title="Test Modal"
        onClose={mockOnClose}
      >
        <p>Content</p>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it('should call onClose when overlay is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Modal
        isOpen={true}
        title="Test Modal"
        onClose={mockOnClose}
      >
        <p>Content</p>
      </Modal>
    );

    const overlay = screen.getByTestId('modal-overlay');
    await user.click(overlay);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it('should not close when content is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Modal
        isOpen={true}
        title="Test Modal"
        onClose={mockOnClose}
      >
        <p>Content</p>
      </Modal>
    );

    const content = screen.getByText('Content');
    await user.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should render title', () => {
    render(
      <Modal
        isOpen={true}
        title="Confirmation Dialog"
        onClose={mockOnClose}
      >
        <p>Are you sure?</p>
      </Modal>
    );

    expect(screen.getByText('Confirmation Dialog')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <Modal
        isOpen={true}
        title="Test Modal"
        onClose={mockOnClose}
      >
        <div>
          <p>Custom content</p>
          <input placeholder="Test input" />
        </div>
      </Modal>
    );

    expect(screen.getByText('Custom content')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
  });

  it('should render actions when provided', () => {
    render(
      <Modal
        isOpen={true}
        title="Test Modal"
        onClose={mockOnClose}
        actions={
          <div>
            <button>Cancel</button>
            <button>Confirm</button>
          </div>
        }
      >
        <p>Content</p>
      </Modal>
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('should toggle visibility on isOpen prop change', () => {
    const { rerender } = render(
      <Modal
        isOpen={false}
        title="Test Modal"
        onClose={mockOnClose}
      >
        <p>Content</p>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();

    rerender(
      <Modal
        isOpen={true}
        title="Test Modal"
        onClose={mockOnClose}
      >
        <p>Content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });
});
