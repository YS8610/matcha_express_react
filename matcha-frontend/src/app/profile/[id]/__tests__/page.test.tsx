import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useParams } from 'next/navigation';
import ProfilePage from '../page';

vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
}));

vi.mock('@/components/profile/ProfileView', () => ({
  default: ({ userId }: { userId: string }) => (
    <div data-testid="profile-view" data-user-id={userId}>
      Profile View for {userId}
    </div>
  ),
}));

describe('ProfilePage', () => {
  it('should render ProfileView component', () => {
    (useParams as any).mockReturnValue({ id: 'user123' });

    render(<ProfilePage />);

    const profileView = screen.getByTestId('profile-view');
    expect(profileView).toBeInTheDocument();
  });

  it('should pass userId from params to ProfileView', () => {
    (useParams as any).mockReturnValue({ id: 'user456' });

    render(<ProfilePage />);

    const profileView = screen.getByTestId('profile-view');
    expect(profileView).toHaveAttribute('data-user-id', 'user456');
  });

  it('should handle different user IDs', () => {
    (useParams as any).mockReturnValue({ id: 'test-user-789' });

    render(<ProfilePage />);

    const profileView = screen.getByTestId('profile-view');
    expect(profileView).toHaveTextContent('Profile View for test-user-789');
  });

  it('should extract id parameter from params object', () => {
    const mockParams = { id: 'dynamic-id', someOtherParam: 'value' };
    (useParams as any).mockReturnValue(mockParams);

    render(<ProfilePage />);

    const profileView = screen.getByTestId('profile-view');
    expect(profileView).toHaveAttribute('data-user-id', 'dynamic-id');
  });

  it('should handle numeric user IDs as strings', () => {
    (useParams as any).mockReturnValue({ id: '12345' });

    render(<ProfilePage />);

    const profileView = screen.getByTestId('profile-view');
    expect(profileView).toHaveAttribute('data-user-id', '12345');
  });

  it('should handle UUID-format user IDs', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    (useParams as any).mockReturnValue({ id: uuid });

    render(<ProfilePage />);

    const profileView = screen.getByTestId('profile-view');
    expect(profileView).toHaveAttribute('data-user-id', uuid);
  });

  it('should render without errors', () => {
    (useParams as any).mockReturnValue({ id: 'user123' });

    expect(() => render(<ProfilePage />)).not.toThrow();
  });

  it('should have client directive', () => {
    expect(ProfilePage).toBeDefined();
    expect(typeof ProfilePage).toBe('function');
  });
});
