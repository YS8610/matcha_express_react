import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuthImage } from '@/hooks/useAuthImage';
import { ToastProvider } from '@/contexts/ToastContext';

describe('useAuthImage Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
