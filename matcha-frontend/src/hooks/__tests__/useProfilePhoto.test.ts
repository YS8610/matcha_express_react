import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useProfilePhoto } from '../useProfilePhoto';
import * as api from '@/lib/api';

vi.mock('@/lib/api');

describe('useProfilePhoto', () => {
  beforeEach(() => {
    vi.spyOn(api, 'generateAvatarUrl').mockImplementation((name, id) => {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${id || name}`;
    });
  });

  it('should return photo API URL when photo0 is provided', () => {
    const { result } = renderHook(() =>
      useProfilePhoto('photo123.jpg', 'John Doe', 'user1')
    );

    expect(result.current).toBe('/api/photo/photo123.jpg');
  });

  it('should return generated avatar URL when photo0 is null', () => {
    const { result } = renderHook(() =>
      useProfilePhoto(null, 'John Doe', 'user1')
    );

    expect(result.current).toContain('dicebear.com');
    expect(api.generateAvatarUrl).toHaveBeenCalledWith('John Doe', 'user1');
  });

  it('should return generated avatar URL when photo0 is undefined', () => {
    const { result } = renderHook(() =>
      useProfilePhoto(undefined, 'John Doe', 'user1')
    );

    expect(result.current).toContain('dicebear.com');
    expect(api.generateAvatarUrl).toHaveBeenCalledWith('John Doe', 'user1');
  });

  it('should return generated avatar URL when photo0 is empty string', () => {
    const { result } = renderHook(() =>
      useProfilePhoto('', 'John Doe', 'user1')
    );

    expect(result.current).toContain('dicebear.com');
    expect(api.generateAvatarUrl).toHaveBeenCalledWith('John Doe', 'user1');
  });

  it('should memoize result when dependencies do not change', () => {
    const { result, rerender } = renderHook(() =>
      useProfilePhoto('photo123.jpg', 'John Doe', 'user1')
    );

    const firstResult = result.current;

    rerender();

    expect(result.current).toBe(firstResult);
    expect(result.current).toBe('/api/photo/photo123.jpg');
  });

  it('should update when photo0 changes', () => {
    const { result, rerender } = renderHook(
      ({ photo0 }) => useProfilePhoto(photo0, 'John Doe', 'user1'),
      { initialProps: { photo0: 'photo1.jpg' } }
    );

    expect(result.current).toBe('/api/photo/photo1.jpg');

    rerender({ photo0: 'photo2.jpg' });

    expect(result.current).toBe('/api/photo/photo2.jpg');
  });

  it('should update when name changes', () => {
    const { result, rerender } = renderHook(
      ({ name }) => useProfilePhoto(null, name, 'user1'),
      { initialProps: { name: 'John Doe' } }
    );

    expect(api.generateAvatarUrl).toHaveBeenCalledWith('John Doe', 'user1');

    rerender({ name: 'Jane Smith' });

    expect(api.generateAvatarUrl).toHaveBeenCalledWith('Jane Smith', 'user1');
    expect(result.current).toContain('dicebear.com');
  });

  it('should update when id changes', () => {
    const { result, rerender } = renderHook(
      ({ id }) => useProfilePhoto(null, 'John Doe', id),
      { initialProps: { id: 'user1' } }
    );

    const firstResult = result.current;

    rerender({ id: 'user2' });

    expect(result.current).not.toBe(firstResult);
    expect(api.generateAvatarUrl).toHaveBeenCalledWith('John Doe', 'user2');
  });

  it('should switch from photo to avatar when photo0 changes to null', () => {
    const { result, rerender } = renderHook(
      ({ photo0 }) => useProfilePhoto(photo0, 'John Doe', 'user1'),
      { initialProps: { photo0: 'photo123.jpg' as string | null } }
    );

    expect(result.current).toBe('/api/photo/photo123.jpg');

    rerender({ photo0: null });

    expect(result.current).toContain('dicebear.com');
  });

  it('should switch from avatar to photo when photo0 changes from null', () => {
    const { result, rerender } = renderHook(
      ({ photo0 }) => useProfilePhoto(photo0, 'John Doe', 'user1'),
      { initialProps: { photo0: null as string | null } }
    );

    expect(result.current).toContain('dicebear.com');

    rerender({ photo0: 'photo123.jpg' });

    expect(result.current).toBe('/api/photo/photo123.jpg');
  });

  it('should work with undefined name and id', () => {
    const { result } = renderHook(() => useProfilePhoto(null, undefined, undefined));

    expect(api.generateAvatarUrl).toHaveBeenCalledWith(undefined, undefined);
    expect(result.current).toBeTruthy();
  });

  it('should handle photo filenames with special characters', () => {
    const { result } = renderHook(() =>
      useProfilePhoto('photo-user_123.jpg', 'John Doe', 'user1')
    );

    expect(result.current).toBe('/api/photo/photo-user_123.jpg');
  });

  it('should handle long photo filenames', () => {
    const longFilename = 'a'.repeat(100) + '.jpg';
    const { result } = renderHook(() =>
      useProfilePhoto(longFilename, 'John Doe', 'user1')
    );

    expect(result.current).toBe(`/api/photo/${longFilename}`);
  });

  it('should handle different file extensions', () => {
    const { result: result1 } = renderHook(() =>
      useProfilePhoto('photo.jpg', 'John', 'user1')
    );
    const { result: result2 } = renderHook(() =>
      useProfilePhoto('photo.png', 'John', 'user1')
    );
    const { result: result3 } = renderHook(() =>
      useProfilePhoto('photo.webp', 'John', 'user1')
    );

    expect(result1.current).toBe('/api/photo/photo.jpg');
    expect(result2.current).toBe('/api/photo/photo.png');
    expect(result3.current).toBe('/api/photo/photo.webp');
  });

  it('should not recompute when unrelated state changes', () => {
    let callCount = 0;
    vi.spyOn(api, 'generateAvatarUrl').mockImplementation((name, id) => {
      callCount++;
      return `avatar-${id}`;
    });

    const { rerender } = renderHook(() =>
      useProfilePhoto(null, 'John Doe', 'user1')
    );

    const initialCallCount = callCount;

    rerender();
    rerender();
    rerender();

    expect(callCount).toBe(initialCallCount);
  });
});
