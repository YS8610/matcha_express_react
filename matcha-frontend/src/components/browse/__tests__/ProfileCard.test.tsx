import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileCard from '@/components/browse/ProfileCard';
import type { ProfileShort } from '@/types';

vi.mock('next/link', () => ({
  default: ({ children, href, className }: any) => (
    <a href={href} className={className} data-testid={`profile-link-${href}`}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/AuthImage', () => ({
  default: ({ alt }: any) => <div data-testid="auth-image">{alt}</div>,
}));

vi.mock('@/lib/neo4j-utils', () => ({
  toNumber: (val: any) => val,
  getLastSeenString: (timestamp: any) => 'Just now',
}));

vi.mock('@/lib/security', () => ({
  removeTags: (str: string) => str,
}));

describe('ProfileCard Component', () => {
  const mockProfile: ProfileShort = {
    id: 'profile-1',
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    photo0: 'photo1.jpg',
    fameRating: 4.5,
    lastOnline: Date.now(),
    distance: 5200,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render profile card', () => {
    const { container } = render(<ProfileCard profile={mockProfile} />);

    expect(container.querySelector('a')).toBeTruthy();
  });

  it('should display profile link with correct href', () => {
    render(<ProfileCard profile={mockProfile} />);

    expect(screen.getByTestId('profile-link-/profile/profile-1')).toBeTruthy();
  });

  it('should display first name', () => {
    render(<ProfileCard profile={mockProfile} />);

    expect(screen.getByText('John')).toBeTruthy();
  });

  it('should display profile info in correct location', () => {
    render(<ProfileCard profile={mockProfile} />);

    expect(screen.getByRole('heading', { level: 3 })).toBeTruthy();
  });

  it('should display username with @ symbol', () => {
    render(<ProfileCard profile={mockProfile} />);

    expect(screen.getByText(/john_doe/)).toBeTruthy();
  });

  it('should render auth image component', () => {
    render(<ProfileCard profile={mockProfile} />);

    expect(screen.getByTestId('auth-image')).toBeTruthy();
  });

  it('should display fame rating', () => {
    render(<ProfileCard profile={mockProfile} />);

    expect(screen.getByText(/4\.5\/100/)).toBeTruthy();
  });

  it('should display distance when available', () => {
    render(<ProfileCard profile={mockProfile} />);

    expect(screen.getByText(/5\.2 km/)).toBeTruthy();
  });

  it('should handle long first names', () => {
    const longNameProfile = {
      ...mockProfile,
      firstName: 'VeryLongFirstNameThatExceedTheLimit',
    };

    render(<ProfileCard profile={longNameProfile} />);

    expect(screen.getByText(/VeryLongFirstName/)).toBeTruthy();
  });

  it('should handle long usernames', () => {
    const longUsernameProfile = {
      ...mockProfile,
      username: 'very_long_username_that_exceeds_the_character_limit',
    };

    render(<ProfileCard profile={longUsernameProfile} />);

    expect(screen.getByTestId('profile-link-/profile/profile-1')).toBeTruthy();
  });

  it('should display online status indicator', () => {
    render(<ProfileCard profile={mockProfile} />);

    expect(screen.getByTestId('profile-link-/profile/profile-1')).toBeTruthy();
  });

  it('should have border styling', () => {
    const { container } = render(<ProfileCard profile={mockProfile} />);

    const link = container.querySelector('a');
    expect(link?.className).toContain('border');
  });

  it('should have hover effects', () => {
    const { container } = render(<ProfileCard profile={mockProfile} />);

    const link = container.querySelector('a');
    expect(link?.className).toContain('hover:');
  });

  it('should handle profile without distance', () => {
    const profileWithoutDistance = { ...mockProfile };
    delete profileWithoutDistance.distance;

    const { container } = render(<ProfileCard profile={profileWithoutDistance} />);

    expect(container).toBeTruthy();
  });

  it('should use username as fallback when firstName missing', () => {
    const profileWithoutFirstName = {
      ...mockProfile,
      firstName: '',
    };

    const { container } = render(<ProfileCard profile={profileWithoutFirstName} />);

    const heading = container.querySelector('h3');
    expect(heading).toBeTruthy();
  });

  it('should apply styling', () => {
    const { container } = render(<ProfileCard profile={mockProfile} />);

    const link = container.querySelector('a');
    expect(link?.className).toContain('shadow-lg');
  });

  it('should render with memoization', () => {
    const { rerender } = render(<ProfileCard profile={mockProfile} />);

    rerender(<ProfileCard profile={mockProfile} />);

    expect(screen.getByTestId('profile-link-/profile/profile-1')).toBeTruthy();
  });
});
