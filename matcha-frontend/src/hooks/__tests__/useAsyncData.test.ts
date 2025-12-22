import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAsyncData } from '../useAsyncData';

describe('useAsyncData', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAsyncData<string>());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('should set loading to true during async execution', async () => {
    const { result } = renderHook(() => useAsyncData<string>());
    const asyncFn = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve('test data'), 100))
    );

    act(() => {
      result.current.execute(asyncFn);
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe('');

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should set data on successful execution', async () => {
    const { result } = renderHook(() => useAsyncData<string>());
    const testData = 'test data';
    const asyncFn = vi.fn().mockResolvedValue(testData);

    await act(async () => {
      const returnedData = await result.current.execute(asyncFn);
      expect(returnedData).toBe(testData);
    });

    expect(result.current.data).toBe(testData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
    expect(asyncFn).toHaveBeenCalledOnce();
  });

  it('should set error on failed execution', async () => {
    const { result } = renderHook(() => useAsyncData<string>());
    const errorMessage = 'Test error';
    const asyncFn = vi.fn().mockRejectedValue(new Error(errorMessage));

    await act(async () => {
      try {
        await result.current.execute(asyncFn);
      } catch (err) {
      }
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should handle non-Error objects as errors', async () => {
    const { result } = renderHook(() => useAsyncData<string>());
    const asyncFn = vi.fn().mockRejectedValue('string error');

    await act(async () => {
      try {
        await result.current.execute(asyncFn);
      } catch (err) {
      }
    });

    expect(result.current.error).toBe('An error occurred');
  });

  it('should reset state to initial values', () => {
    const { result } = renderHook(() => useAsyncData<string>());

    act(() => {
      result.current.setData('some data');
      result.current.setError('some error');
    });

    expect(result.current.data).toBe('some data');
    expect(result.current.error).toBe('some error');

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('should allow manual data setting via setData', () => {
    const { result } = renderHook(() => useAsyncData<string>());
    const testData = 'manual data';

    act(() => {
      result.current.setData(testData);
    });

    expect(result.current.data).toBe(testData);
  });

  it('should allow manual error setting via setError', () => {
    const { result } = renderHook(() => useAsyncData<string>());
    const errorMessage = 'manual error';

    act(() => {
      result.current.setError(errorMessage);
    });

    expect(result.current.error).toBe(errorMessage);
  });

  it('should clear error on successful execution', async () => {
    const { result } = renderHook(() => useAsyncData<string>());

    act(() => {
      result.current.setError('previous error');
    });

    expect(result.current.error).toBe('previous error');

    await act(async () => {
      await result.current.execute(async () => 'success');
    });

    expect(result.current.error).toBe('');
    expect(result.current.data).toBe('success');
  });

  it('should handle generic types correctly', async () => {
    interface TestData {
      id: number;
      name: string;
    }

    const { result } = renderHook(() => useAsyncData<TestData>());
    const testData: TestData = { id: 1, name: 'Test' };

    await act(async () => {
      await result.current.execute(async () => testData);
    });

    expect(result.current.data).toEqual(testData);
    expect(result.current.data?.id).toBe(1);
    expect(result.current.data?.name).toBe('Test');
  });

  it('should re-throw error after catching', async () => {
    const { result } = renderHook(() => useAsyncData<string>());
    const error = new Error('Test error');
    const asyncFn = vi.fn().mockRejectedValue(error);

    await expect(
      act(async () => {
        await result.current.execute(asyncFn);
      })
    ).rejects.toThrow('Test error');
  });
});
