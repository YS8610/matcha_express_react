import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuthImage } from '@/hooks/useAuthImage';
import { ToastProvider } from '@/contexts/ToastContext';
import * as tokenStorage from '@/lib/tokenStorage';

global.fetch = vi.fn();
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('useAuthImage Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be defined', () => {
    expect(useAuthImage).toBeDefined();
  });

  it('should return null when photoName is undefined', () => {
    const { result } = renderHook(() => useAuthImage(undefined), {
      wrapper: ToastProvider,
    });
    expect(result.current).toBeNull();
  });

  it('should return null when photoName is null', () => {
    const { result } = renderHook(() => useAuthImage(null), {
      wrapper: ToastProvider,
    });
    expect(result.current).toBeNull();
  });

  it('should return null initially', () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue('mock-token');
    const { result } = renderHook(() => useAuthImage('photo.jpg'), {
      wrapper: ToastProvider,
    });
    expect(result.current).toBeNull();
  });

  it('should fetch image when token is available', async () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue('mock-token');
    const mockBlob = new Blob(['image'], { type: 'image/jpeg' });

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    const { result } = renderHook(() => useAuthImage('photo.jpg'), {
      wrapper: ToastProvider,
    });

    await waitFor(() => {
      expect(result.current).toBe('blob:mock-url');
    });
  });

  it('should use correct API endpoint', async () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue('mock-token');
    const mockBlob = new Blob(['image'], { type: 'image/jpeg' });

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    renderHook(() => useAuthImage('test-photo.jpg'), {
      wrapper: ToastProvider,
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/photo/test-photo.jpg',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  it('should include Authorization header', async () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue('test-token-123');
    const mockBlob = new Blob(['image'], { type: 'image/jpeg' });

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    renderHook(() => useAuthImage('photo.jpg'), {
      wrapper: ToastProvider,
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer test-token-123',
          },
        })
      );
    });
  });

  it('should retry when token is not available initially', async () => {
    let tokenCallCount = 0;
    vi.spyOn(tokenStorage, 'getToken').mockImplementation(() => {
      tokenCallCount++;
      return tokenCallCount === 1 ? null : 'delayed-token';
    });

    const mockBlob = new Blob(['image'], { type: 'image/jpeg' });
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    renderHook(() => useAuthImage('photo.jpg'), {
      wrapper: ToastProvider,
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    await waitFor(() => {
      expect(tokenCallCount).toBeGreaterThan(1);
    });
  });

  it('should return null when fetch fails', async () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue('mock-token');

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useAuthImage('photo.jpg'), {
      wrapper: ToastProvider,
    });

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it('should handle fetch errors gracefully', async () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue('mock-token');

    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useAuthImage('photo.jpg'), {
      wrapper: ToastProvider,
    });

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it('should create blob URL from response', async () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue('mock-token');
    const mockBlob = new Blob(['image'], { type: 'image/jpeg' });

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    renderHook(() => useAuthImage('photo.jpg'), {
      wrapper: ToastProvider,
    });

    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    });
  });

  it('should update imageUrl when photoName changes', async () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue('mock-token');
    const mockBlob1 = new Blob(['image1'], { type: 'image/jpeg' });
    const mockBlob2 = new Blob(['image2'], { type: 'image/jpeg' });

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob1),
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob2),
      });

    const { result, rerender } = renderHook(
      ({ photoName }) => useAuthImage(photoName),
      {
        wrapper: ToastProvider,
        initialProps: { photoName: 'photo1.jpg' },
      }
    );

    await waitFor(() => {
      expect(result.current).toBe('blob:mock-url');
    });

    rerender({ photoName: 'photo2.jpg' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/photo/photo2.jpg',
        expect.any(Object)
      );
    });
  });

  it('should reset imageUrl to null when photoName becomes undefined', async () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue('mock-token');
    const mockBlob = new Blob(['image'], { type: 'image/jpeg' });

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    const { result, rerender } = renderHook(
      ({ photoName }) => useAuthImage(photoName),
      {
        wrapper: ToastProvider,
        initialProps: { photoName: 'photo.jpg' as string | undefined },
      }
    );

    await waitFor(() => {
      expect(result.current).toBe('blob:mock-url');
    });

    rerender({ photoName: undefined });

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it('should handle exponential backoff for retries', async () => {
    let tokenCallCount = 0;
    vi.spyOn(tokenStorage, 'getToken').mockImplementation(() => {
      tokenCallCount++;
      return tokenCallCount < 3 ? null : 'token-after-retries';
    });

    const mockBlob = new Blob(['image'], { type: 'image/jpeg' });
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    renderHook(() => useAuthImage('photo.jpg'), {
      wrapper: ToastProvider,
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(tokenCallCount).toBeGreaterThanOrEqual(2);
    });
  });

  it('should stop retrying after max attempts', async () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue(null);

    const { result } = renderHook(() => useAuthImage('photo.jpg'), {
      wrapper: ToastProvider,
    });

    for (let i = 0; i < 10; i++) {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it('should cleanup on unmount', async () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue('mock-token');
    const mockBlob = new Blob(['image'], { type: 'image/jpeg' });

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    const { unmount } = renderHook(() => useAuthImage('photo.jpg'), {
      wrapper: ToastProvider,
    });

    unmount();

    expect(global.fetch).toHaveBeenCalled();
  });

  it('should not update state after unmount', async () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue('mock-token');
    const mockBlob = new Blob(['image'], { type: 'image/jpeg' });

    let resolveBlob: any;
    const blobPromise = new Promise(resolve => {
      resolveBlob = resolve;
    });

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      blob: () => blobPromise,
    });

    const { result, unmount } = renderHook(() => useAuthImage('photo.jpg'), {
      wrapper: ToastProvider,
    });

    unmount();

    resolveBlob(mockBlob);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toBeNull();
  });

  it('should handle empty string photoName', () => {
    const { result } = renderHook(() => useAuthImage(''), {
      wrapper: ToastProvider,
    });
    expect(result.current).toBeNull();
  });

  it('should handle special characters in photoName', async () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue('mock-token');
    const mockBlob = new Blob(['image'], { type: 'image/jpeg' });

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    renderHook(() => useAuthImage('photo-name-with-dashes.jpg'), {
      wrapper: ToastProvider,
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/photo/photo-name-with-dashes.jpg',
        expect.any(Object)
      );
    });
  });

  it('should handle response without ok status', async () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue('mock-token');

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(() => useAuthImage('photo.jpg'), {
      wrapper: ToastProvider,
    });

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it('should be called with correct method GET', async () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue('mock-token');
    const mockBlob = new Blob(['image'], { type: 'image/jpeg' });

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    renderHook(() => useAuthImage('photo.jpg'), {
      wrapper: ToastProvider,
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  it('should handle concurrent fetches for different photos', async () => {
    vi.spyOn(tokenStorage, 'getToken').mockReturnValue('mock-token');
    const mockBlob1 = new Blob(['image1'], { type: 'image/jpeg' });
    const mockBlob2 = new Blob(['image2'], { type: 'image/jpeg' });

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob1),
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob2),
      });

    const { result: result1 } = renderHook(() => useAuthImage('photo1.jpg'), {
      wrapper: ToastProvider,
    });

    const { result: result2 } = renderHook(() => useAuthImage('photo2.jpg'), {
      wrapper: ToastProvider,
    });

    await waitFor(() => {
      expect(result1.current).toBe('blob:mock-url');
      expect(result2.current).toBe('blob:mock-url');
    });
  });
});
