import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '../useRequireAuth';
import { useAuth } from '@/contexts/AuthContext';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('useRequireAuth', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
  });

  it('should return user and loading state', () => {
    const mockUser = { id: '1', username: 'testuser' };
    (useAuth as any).mockReturnValue({
      user: mockUser,
      loading: false,
    });

    const { result } = renderHook(() => useRequireAuth());

    expect(result.current.user).toBe(mockUser);
    expect(result.current.loading).toBe(false);
  });

  it('should redirect to login when user is null and not loading', async () => {
    (useAuth as any).mockReturnValue({
      user: null,
      loading: false,
    });

    renderHook(() => useRequireAuth());

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  it('should not redirect while loading', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      loading: true,
    });

    renderHook(() => useRequireAuth());

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('should not redirect when user is authenticated', () => {
    const mockUser = { id: '1', username: 'testuser' };
    (useAuth as any).mockReturnValue({
      user: mockUser,
      loading: false,
    });

    renderHook(() => useRequireAuth());

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('should redirect to custom URL when provided', async () => {
    (useAuth as any).mockReturnValue({
      user: null,
      loading: false,
    });

    renderHook(() => useRequireAuth('/custom-login'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/custom-login');
    });
  });

  it('should handle user state changing from loading to authenticated', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      loading: true,
    });

    const { rerender } = renderHook(() => useRequireAuth());

    expect(mockRouter.push).not.toHaveBeenCalled();

    const mockUser = { id: '1', username: 'testuser' };
    (useAuth as any).mockReturnValue({
      user: mockUser,
      loading: false,
    });

    rerender();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('should redirect when user logs out', async () => {
    const mockUser = { id: '1', username: 'testuser' };
    (useAuth as any).mockReturnValue({
      user: mockUser,
      loading: false,
    });

    const { rerender } = renderHook(() => useRequireAuth());

    expect(mockRouter.push).not.toHaveBeenCalled();

    (useAuth as any).mockReturnValue({
      user: null,
      loading: false,
    });

    rerender();

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  it('should update redirect URL dynamically', async () => {
    (useAuth as any).mockReturnValue({
      user: null,
      loading: false,
    });

    const { rerender } = renderHook(
      ({ url }) => useRequireAuth(url),
      { initialProps: { url: '/login' } }
    );

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });

    mockRouter.push.mockClear();

    rerender({ url: '/auth' });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/auth');
    });
  });

  it('should not redirect multiple times unnecessarily', async () => {
    (useAuth as any).mockReturnValue({
      user: null,
      loading: false,
    });

    const { rerender } = renderHook(() => useRequireAuth());

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
    });

    rerender();
    rerender();

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
  });

  it('should wait for loading to finish before redirecting', async () => {
    (useAuth as any).mockReturnValue({
      user: null,
      loading: true,
    });

    const { rerender } = renderHook(() => useRequireAuth());

    expect(mockRouter.push).not.toHaveBeenCalled();

    (useAuth as any).mockReturnValue({
      user: null,
      loading: false,
    });

    rerender();

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  it('should handle rapidly changing loading state', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      loading: true,
    });

    const { rerender } = renderHook(() => useRequireAuth());

    (useAuth as any).mockReturnValue({
      user: null,
      loading: false,
    });
    rerender();

    (useAuth as any).mockReturnValue({
      user: null,
      loading: true,
    });
    rerender();

    (useAuth as any).mockReturnValue({
      user: null,
      loading: false,
    });
    rerender();

    expect(mockRouter.push).toHaveBeenCalled();
  });
});
