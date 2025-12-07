import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileMenu from '@/components/layout/MobileMenu';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/types';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/components/layout/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme</div>,
}));

vi.mock('next/link', () => ({
  default: ({ children, href, onClick }: any) => (
    <a href={href} onClick={onClick} data-testid={`link-${href}`}>
      {children}
    </a>
  ),
}));

describe('MobileMenu Component', () => {
  const mockUser: User = {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    emailVerified: true,
    profileComplete: true,
    lastSeen: new Date(),
    isOnline: true,
  };

  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render mobile menu button', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<MobileMenu />);
    const button = container.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should have aria-label on toggle button', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<MobileMenu />);
    const button = container.querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Toggle menu');
  });

  it('should display menu icon when menu is closed', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<MobileMenu />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should open menu when toggle button clicked', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<MobileMenu />);
    const button = container.querySelector('button');
    if (button) {
      fireEvent.click(button);
    }

    expect(screen.getByText('Logged in as')).toBeTruthy();
  });

  it('should display user username when logged in', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<MobileMenu />);
    const button = container.querySelector('button');
    if (button) {
      fireEvent.click(button);
    }

    expect(screen.getByText('testuser')).toBeTruthy();
  });

  it('should display navigation links when menu is open', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<MobileMenu />);
    const button = container.querySelector('button');
    if (button) {
      fireEvent.click(button);
    }

    expect(screen.getByText('Browse')).toBeTruthy();
    expect(screen.getByText('Visitors')).toBeTruthy();
    expect(screen.getByText('Likes')).toBeTruthy();
    expect(screen.getByText('Blocked')).toBeTruthy();
    expect(screen.getByText('Messages')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('should close menu when link clicked', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<MobileMenu />);
    let button = container.querySelector('button');
    if (button) {
      fireEvent.click(button);
    }

    const browseLink = screen.getByTestId('link-/browse');
    fireEvent.click(browseLink);

    // Menu should be closed
    expect(screen.queryByText('Logged in as')).toBeNull();
  });

  it('should call logout when logout clicked', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<MobileMenu />);
    const button = container.querySelector('button');
    if (button) {
      fireEvent.click(button);
    }

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('should not display user section when not logged in', () => {
    (useAuth as any).mockReturnValue({ user: null, logout: mockLogout });

    const { container } = render(<MobileMenu />);
    const button = container.querySelector('button');
    if (button) {
      fireEvent.click(button);
    }

    expect(screen.queryByText('Logged in as')).toBeNull();
  });

  it('should hide navigation when menu is closed', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    render(<MobileMenu />);

    expect(screen.queryByText('Browse')).toBeNull();
    expect(screen.queryByText('Visitors')).toBeNull();
  });

  it('should have correct navigation link hrefs', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<MobileMenu />);
    const button = container.querySelector('button');
    if (button) {
      fireEvent.click(button);
    }

    expect(screen.getByTestId('link-/browse')).toBeTruthy();
    expect(screen.getByTestId('link-/visitors')).toBeTruthy();
    expect(screen.getByTestId('link-/likes')).toBeTruthy();
    expect(screen.getByTestId('link-/blocked')).toBeTruthy();
    expect(screen.getByTestId('link-/messages')).toBeTruthy();
    expect(screen.getByTestId('link-/profile')).toBeTruthy();
  });

  it('should not render theme toggle in mobile menu', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    render(<MobileMenu />);

    expect(screen.queryByTestId('theme-toggle')).toBeNull();
  });

  it('should have lg:hidden class for mobile-only display', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<MobileMenu />);
    const wrapper = container.querySelector('.lg\\:hidden');
    expect(wrapper).toBeTruthy();
  });

  it('should toggle between menu and close icon', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<MobileMenu />);
    let button = container.querySelector('button');

    if (button) {
      fireEvent.click(button);
      expect(screen.getByText('Logged in as')).toBeTruthy();

      fireEvent.click(button);
      expect(screen.queryByText('Logged in as')).toBeNull();
    }
  });
});
