import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthImage } from '../useAuthImage';
import * as tokenStorage from '@/lib/tokenStorage';

vi.mock('@/lib/tokenStorage');

describe('useAuthImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    global.fetch = vi.fn();
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  });

  it('should return null when photoName is undefined', () => {
    const { result } = renderHook(() => useAuthImage(undefined));
    expect(result.current).toBeNull();
  });

  it('should return null when photoName is null', () => {
    const { result } = renderHook(() => useAuthImage(null));
    expect(result.current).toBeNull();
  });

  it('should return null when photoName is empty string', () => {
    const { result } = renderHook(() => useAuthImage(''));
    expect(result.current).toBeNull();
  });

  it('should fetch image successfully with valid token', async () => {
    const mockToken = 'mock-token';
    const mockBlob = new Blob(['image data'], { type: 'image/jpeg' });

    vi.spyOn(tokenStorage, 'getToken').mockReturnValue(mockToken);
    (global.fetch as any).mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    const { result } = renderHook(() => useAuthImage('photo1.jpg'));

    await waitFor(() => {
      expect(result.current).toBe('blob:mock-url');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/photo/photo1.jpg', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${mockToken}`,
      },
    });
  });

  it('should handle 401 unauthorized response', async () => {
    const mockToken = 'mock-token';
    const clearTokenSpy = vi.spyOn(tokenStorage, 'clearToken');
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    vi.spyOn(tokenStorage, 'getToken').mockReturnValue(mockToken);
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 401,
    });

    const { result } = renderHook(() => useAuthImage('photo1.jpg'));

    await waitFor(() => {
      expect(result.current).toBeNull();
    });

    expect(clearTokenSpy).toHaveBeenCalled();
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'unauthorized',
      })
    );
  });

  it('should handle non-401 error responses', async () => {
    const mockToken = 'mock-token';
    const clearTokenSpy = vi.spyOn(tokenStorage, 'clearToken');

    vi.spyOn(tokenStorage, 'getToken').mockReturnValue(mockToken);
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useAuthImage('photo1.jpg'));

    await waitFor(() => {
      expect(result.current).toBeNull();
    });

    expect(clearTokenSpy).not.toHaveBeenCalled();
  });

  it('should handle fetch errors', async () => {
    const mockToken = 'mock-token';

    vi.spyOn(tokenStorage, 'getToken').mockReturnValue(mockToken);
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAuthImage('photo1.jpg'));

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it('should update when photoName changes', async () => {
    const mockToken = 'mock-token';
    const mockBlob = new Blob(['image data'], { type: 'image/jpeg' });

    vi.spyOn(tokenStorage, 'getToken').mockReturnValue(mockToken);
    (global.fetch as any).mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    const { rerender } = renderHook(
      ({ photoName }) => useAuthImage(photoName),
      { initialProps: { photoName: 'photo1.jpg' } }
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/photo/photo1.jpg', expect.any(Object));
    });

    rerender({ photoName: 'photo2.jpg' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/photo/photo2.jpg', expect.any(Object));
    });
  });
});
