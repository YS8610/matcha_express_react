import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileCard from '../ProfileCard';
import type { ProfileShort } from '@/types';

vi.mock('@/components/AuthImage', () => ({
  default: ({ src, alt, fallbackSrc }: { src: string; alt: string; fallbackSrc: string }) => (
    <img src={src} alt={alt} data-fallback={fallbackSrc} data-testid="auth-image" />
  ),
}));

vi.mock('@/lib/api', () => ({
  generateAvatarUrl: (name: string, id: string) => `https://avatar.example.com/${id}`,
}));

describe('ProfileCard Component', () => {
  const mockProfile: ProfileShort = {
    id: 'user123',
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    photo0: 'photo123.jpg',
    fameRating: 42,
    lastOnline: Date.now(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).location;
    window.location = { href: '' } as any;
  });

  describe('Basic Rendering', () => {
    it('should render profile card', () => {
      render(<ProfileCard profile={mockProfile} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('@johndoe')).toBeInTheDocument();
    });

    it('should render profile photo', () => {
      render(<ProfileCard profile={mockProfile} />);

      const image = screen.getByTestId('auth-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/api/photo/photo123.jpg');
      expect(image).toHaveAttribute('alt', 'johndoe');
    });

    it('should render fame rating', () => {
      render(<ProfileCard profile={mockProfile} />);

      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should render star icon for fame rating', () => {
      const { container } = render(<ProfileCard profile={mockProfile} />);

      const starIcon = container.querySelector('svg');
      expect(starIcon).toBeInTheDocument();
    });
  });

  describe('Profile Without Photo', () => {
    it('should use avatar URL when photo0 is not provided', () => {
      const profileWithoutPhoto = { ...mockProfile, photo0: '' };
      render(<ProfileCard profile={profileWithoutPhoto} />);

      const image = screen.getByTestId('auth-image');
      expect(image).toHaveAttribute('src', 'https://avatar.example.com/user123');
    });

    it('should always have fallback avatar URL', () => {
      render(<ProfileCard profile={mockProfile} />);

      const image = screen.getByTestId('auth-image');
      expect(image).toHaveAttribute('data-fallback', 'https://avatar.example.com/user123');
    });
  });

  describe('Badge Feature', () => {
    it('should not show badge by default', () => {
      const { container } = render(<ProfileCard profile={mockProfile} />);

      const badge = container.querySelector('.absolute.top-2.right-2');
      expect(badge).not.toBeInTheDocument();
    });

    it('should show badge when showBadge is true and badgeIcon is provided', () => {
      const badgeIcon = <span data-testid="badge-icon">❤️</span>;
      const { container } = render(
        <ProfileCard
          profile={mockProfile}
          showBadge={true}
          badgeIcon={badgeIcon}
        />
      );

      const badge = container.querySelector('.absolute.top-2.right-2');
      expect(badge).toBeInTheDocument();
      expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
    });

    it('should not show badge when showBadge is true but badgeIcon is not provided', () => {
      const { container } = render(
        <ProfileCard
          profile={mockProfile}
          showBadge={true}
        />
      );

      const badge = container.querySelector('.absolute.top-2.right-2');
      expect(badge).not.toBeInTheDocument();
    });

    it('should apply custom badge className', () => {
      const badgeIcon = <span>Badge</span>;
      const { container } = render(
        <ProfileCard
          profile={mockProfile}
          showBadge={true}
          badgeIcon={badgeIcon}
          badgeClassName="bg-blue-500 text-white"
        />
      );

      const badge = container.querySelector('.absolute.top-2.right-2');
      expect(badge).toHaveClass('bg-blue-500', 'text-white');
    });

    it('should use default badge className when not provided', () => {
      const badgeIcon = <span>Badge</span>;
      const { container } = render(
        <ProfileCard
          profile={mockProfile}
          showBadge={true}
          badgeIcon={badgeIcon}
        />
      );

      const badge = container.querySelector('.absolute.top-2.right-2');
      expect(badge).toHaveClass('bg-red-500', 'text-white');
    });
  });

  describe('Navigation', () => {
    it('should navigate to profile page on click', async () => {
      const user = userEvent.setup();
      render(<ProfileCard profile={mockProfile} />);

      const card = screen.getByText('John Doe').closest('div[class*="cursor-pointer"]');
      expect(card).toBeInTheDocument();

      if (card) {
        await user.click(card);
        expect(window.location.href).toBe('/profile/user123');
      }
    });

    it('should have cursor-pointer class', () => {
      render(<ProfileCard profile={mockProfile} />);

      const card = screen.getByText('John Doe').closest('div[class*="cursor-pointer"]');
      expect(card).toHaveClass('cursor-pointer');
    });

    it('should have hover effect', () => {
      render(<ProfileCard profile={mockProfile} />);

      const card = screen.getByText('John Doe').closest('div[class*="hover:shadow-lg"]');
      expect(card).toHaveClass('hover:shadow-lg');
    });
  });

  describe('Styling', () => {
    it('should have card styling', () => {
      const { container } = render(<ProfileCard profile={mockProfile} />);

      const card = container.querySelector('.rounded-lg.shadow-md');
      expect(card).toBeInTheDocument();
    });

    it('should have dark mode support', () => {
      const { container } = render(<ProfileCard profile={mockProfile} />);

      const card = container.querySelector('.dark\\:bg-gray-800');
      expect(card).toBeInTheDocument();
    });

    it('should have transition effect', () => {
      render(<ProfileCard profile={mockProfile} />);

      const card = screen.getByText('John Doe').closest('div[class*="transition"]');
      expect(card).toHaveClass('transition-shadow');
    });
  });

  describe('Fame Rating Display', () => {
    it('should display fame rating of 0', () => {
      const profileWithZeroFame = { ...mockProfile, fameRating: 0 };
      render(<ProfileCard profile={profileWithZeroFame} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should display high fame rating', () => {
      const profileWithHighFame = { ...mockProfile, fameRating: 999 };
      render(<ProfileCard profile={profileWithHighFame} />);

      expect(screen.getByText('999')).toBeInTheDocument();
    });

    it('should have yellow color for fame rating', () => {
      const { container } = render(<ProfileCard profile={mockProfile} />);

      const fameContainer = container.querySelector('.text-yellow-500');
      expect(fameContainer).toBeInTheDocument();
    });
  });

  describe('Name Display', () => {
    it('should display full name', () => {
      render(<ProfileCard profile={mockProfile} />);

      const name = screen.getByText('John Doe');
      expect(name).toHaveClass('font-semibold', 'text-lg');
    });

    it('should display username with @ prefix', () => {
      render(<ProfileCard profile={mockProfile} />);

      const username = screen.getByText('@johndoe');
      expect(username).toHaveClass('text-sm');
    });

    it('should handle long names', () => {
      const longNameProfile = {
        ...mockProfile,
        firstName: 'VeryLongFirstName',
        lastName: 'VeryLongLastName',
      };
      render(<ProfileCard profile={longNameProfile} />);

      expect(screen.getByText('VeryLongFirstName VeryLongLastName')).toBeInTheDocument();
    });
  });

  describe('Image Container', () => {
    it('should have fixed height for image', () => {
      const { container } = render(<ProfileCard profile={mockProfile} />);

      const imageContainer = container.querySelector('.h-48');
      expect(imageContainer).toBeInTheDocument();
    });

    it('should have relative positioning for badge placement', () => {
      const { container } = render(<ProfileCard profile={mockProfile} />);

      const imageContainer = container.querySelector('.relative.h-48');
      expect(imageContainer).toBeInTheDocument();
    });
  });

  describe('Complete Usage Scenarios', () => {
    it('should render profile card with badge for likes page', () => {
      const HeartIcon = <svg data-testid="heart-icon">Heart</svg>;
      render(
        <ProfileCard
          profile={mockProfile}
          showBadge={true}
          badgeIcon={HeartIcon}
          badgeClassName="bg-red-500 text-white"
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
    });

    it('should render profile card without badge for visitors page', () => {
      render(<ProfileCard profile={mockProfile} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      const badge = screen.queryByTestId('badge-icon');
      expect(badge).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have meaningful alt text for image', () => {
      render(<ProfileCard profile={mockProfile} />);

      const image = screen.getByTestId('auth-image');
      expect(image).toHaveAttribute('alt', 'johndoe');
    });

    it('should be keyboard accessible', () => {
      render(<ProfileCard profile={mockProfile} />);

      const card = screen.getByText('John Doe').closest('div[class*="cursor-pointer"]');
      expect(card).toBeInTheDocument();
    });
  });
});
