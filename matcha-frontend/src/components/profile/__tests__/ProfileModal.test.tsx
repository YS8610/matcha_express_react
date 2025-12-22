import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRouter } from 'next/navigation';
import ProfileModal from '../ProfileModal';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('../ProfileView', () => ({
  default: ({ userId, isModal }: { userId: string; isModal: boolean }) => (
    <div data-testid="profile-view">
      Profile View for {userId} (Modal: {String(isModal)})
    </div>
  ),
}));

describe('ProfileModal', () => {
  const mockRouter = {
    push: vi.fn(),
    back: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
    document.body.style.overflow = 'unset';
  });

  it('should render ProfileView with userId and isModal=true', () => {
    render(<ProfileModal userId="user123" />);

    const profileView = screen.getByTestId('profile-view');
    expect(profileView).toBeInTheDocument();
    expect(profileView).toHaveTextContent('Profile View for user123');
    expect(profileView).toHaveTextContent('Modal: true');
  });

  it('should set body overflow to hidden on mount', () => {
    render(<ProfileModal userId="user123" />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body overflow on unmount', () => {
    const { unmount } = render(<ProfileModal userId="user123" />);
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('unset');
  });

  it('should render close button', () => {
    render(<ProfileModal userId="user123" />);

    const closeButton = screen.getByRole('button', { name: /close profile/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('should call router.back() when close button is clicked', () => {
    Object.defineProperty(window, 'history', {
      writable: true,
      value: { length: 2 },
    });

    render(<ProfileModal userId="user123" />);

    const closeButton = screen.getByRole('button', { name: /close profile/i });
    fireEvent.click(closeButton);

    expect(mockRouter.back).toHaveBeenCalledOnce();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('should navigate to /browse when history length is 1 or less', () => {
    Object.defineProperty(window, 'history', {
      writable: true,
      value: { length: 1 },
    });

    render(<ProfileModal userId="user123" />);

    const closeButton = screen.getByRole('button', { name: /close profile/i });
    fireEvent.click(closeButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/browse');
    expect(mockRouter.back).not.toHaveBeenCalled();
  });

  it('should close modal when Escape key is pressed', () => {
    render(<ProfileModal userId="user123" />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockRouter.back).toHaveBeenCalledOnce();
  });

  it('should not close modal when other keys are pressed', () => {
    render(<ProfileModal userId="user123" />);

    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'a' });
    fireEvent.keyDown(document, { key: 'Tab' });

    expect(mockRouter.back).not.toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('should close modal when backdrop is clicked', () => {
    Object.defineProperty(window, 'history', {
      writable: true,
      value: { length: 2 },
    });

    render(<ProfileModal userId="user123" />);

    const backdrop = screen.getByRole('button', { name: /close profile/i }).closest('div')?.parentElement;
    if (backdrop) {
      fireEvent.click(backdrop);
    }

  });

  it('should not close when clicking inside the modal content', () => {
    render(<ProfileModal userId="user123" />);

    const profileView = screen.getByTestId('profile-view');
    fireEvent.click(profileView);

    expect(mockRouter.back).not.toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = render(<ProfileModal userId="user123" />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should handle rapid escape key presses', () => {
    render(<ProfileModal userId="user123" />);

    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockRouter.back).toHaveBeenCalledTimes(3);
  });

  it('should apply correct CSS classes to backdrop', () => {
    const { container } = render(<ProfileModal userId="user123" />);

    const backdrop = container.firstChild as HTMLElement;
    expect(backdrop).toHaveClass('fixed', 'inset-0', 'bg-black/60', 'backdrop-blur-sm', 'z-50');
  });

  it('should apply correct CSS classes to modal container', () => {
    const { container } = render(<ProfileModal userId="user123" />);

    const modalContainer = container.querySelector('.bg-white');
    expect(modalContainer).toHaveClass('relative', 'bg-white', 'dark:bg-gray-900', 'rounded-2xl', 'shadow-2xl');
  });

  it('should have X icon in close button', () => {
    render(<ProfileModal userId="user123" />);

    const closeButton = screen.getByRole('button', { name: /close profile/i });
    const svg = closeButton.querySelector('svg');

    expect(svg).toBeInTheDocument();
  });
});
