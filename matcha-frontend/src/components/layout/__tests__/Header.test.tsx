import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/types';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/components/NotificationCenter', () => ({
  default: () => <div data-testid="notification-center">Notifications</div>,
}));

vi.mock('@/components/layout/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme</div>,
}));

vi.mock('@/components/layout/MobileMenu', () => ({
  default: () => <div data-testid="mobile-menu">Mobile Menu</div>,
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => (
    <a href={href} data-testid={`link-${href}`}>
      {children}
    </a>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/browse'),
}));

describe('Header Component', () => {
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

  it('should render header element', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toBeTruthy();
  });

  it('should render logo link', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    render(<Header />);
    const logoLink = screen.getByTestId('link-/');
    expect(logoLink).toBeTruthy();
  });

  it('should display "Matcha" branding text', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    render(<Header />);
    expect(screen.getByText('Matcha')).toBeTruthy();
  });

  it('should render navigation links when user is logged in', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    render(<Header />);

    expect(screen.getByText('Browse')).toBeTruthy();
    expect(screen.getByText('Visitors')).toBeTruthy();
    expect(screen.getByText('Likes')).toBeTruthy();
    expect(screen.getByText('Blocked')).toBeTruthy();
    expect(screen.getByText('Messages')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('should not render navigation links when user is not logged in', () => {
    (useAuth as any).mockReturnValue({ user: null, logout: mockLogout });

    render(<Header />);

    expect(screen.queryByText('Browse')).toBeNull();
    expect(screen.queryByText('Visitors')).toBeNull();
  });

  it('should render notification center', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    render(<Header />);
    const notificationCenters = screen.getAllByTestId('notification-center');
    expect(notificationCenters.length).toBeGreaterThan(0);
  });

  it('should render theme toggle', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    render(<Header />);
    expect(screen.getAllByTestId('theme-toggle')[0]).toBeTruthy();
  });

  it('should render mobile menu', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    render(<Header />);
    expect(screen.getByTestId('mobile-menu')).toBeTruthy();
  });

  it('should have correct navigation link hrefs', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    render(<Header />);

    expect(screen.getByTestId('link-/browse')).toBeTruthy();
    expect(screen.getByTestId('link-/visitors')).toBeTruthy();
    expect(screen.getByTestId('link-/likes')).toBeTruthy();
    expect(screen.getByTestId('link-/blocked')).toBeTruthy();
    expect(screen.getByTestId('link-/messages')).toBeTruthy();
    expect(screen.getByTestId('link-/profile')).toBeTruthy();
  });

  it('should have z-40 positioning', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header?.className).toContain('z-40');
  });

  it('should apply shadow styling', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header?.className).toContain('shadow-md');
  });

  it('should render logo with leaf icon', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<Header />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should be responsive with flex layout', () => {
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });

    const { container } = render(<Header />);
    const flexContainer = container.querySelector('.flex');
    expect(flexContainer?.className).toContain('flex');
    expect(flexContainer?.className).toContain('justify-between');
    expect(flexContainer?.className).toContain('items-center');
  });
});
