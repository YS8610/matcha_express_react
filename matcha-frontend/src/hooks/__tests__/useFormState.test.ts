import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFormState } from '../useFormState';

describe('useFormState', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFormState());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
    expect(result.current.success).toBe('');
  });

  describe('startLoading', () => {
    it('should set loading to true and clear messages', () => {
      const { result } = renderHook(() => useFormState());

      act(() => {
        result.current.setError('some error');
        result.current.setSuccess('some success');
      });

      act(() => {
        result.current.startLoading();
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe('');
      expect(result.current.success).toBe('');
    });
  });

  describe('stopLoading', () => {
    it('should set loading to false', () => {
      const { result } = renderHook(() => useFormState());

      act(() => {
        result.current.startLoading();
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        result.current.stopLoading();
      });

      expect(result.current.loading).toBe(false);
    });

    it('should not clear messages when stopLoading is called', () => {
      const { result } = renderHook(() => useFormState());

      act(() => {
        result.current.setLoading(true);
        result.current.setError('error message');
      });

      expect(result.current.error).toBe('error message');
      expect(result.current.loading).toBe(false);

      act(() => {
        result.current.setLoading(true);
        result.current.stopLoading();
      });

      expect(result.current.error).toBe('error message');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message and stop loading', () => {
      const { result } = renderHook(() => useFormState());

      act(() => {
        result.current.startLoading();
        result.current.setError('Error occurred');
      });

      expect(result.current.error).toBe('Error occurred');
      expect(result.current.loading).toBe(false);
    });

    it('should overwrite previous error', () => {
      const { result } = renderHook(() => useFormState());

      act(() => {
        result.current.setError('First error');
      });

      expect(result.current.error).toBe('First error');

      act(() => {
        result.current.setError('Second error');
      });

      expect(result.current.error).toBe('Second error');
    });

    it('should not clear success message', () => {
      const { result } = renderHook(() => useFormState());

      act(() => {
        result.current.setSuccess('Success message');
        result.current.setLoading(true);
        result.current.setError('Error message');
      });

      expect(result.current.error).toBe('Error message');
      expect(result.current.success).toBe('Success message');
    });
  });

  describe('setSuccess', () => {
    it('should set success message, clear error, and stop loading', () => {
      const { result } = renderHook(() => useFormState());

      act(() => {
        result.current.setError('Previous error');
        result.current.startLoading();
        result.current.setSuccess('Operation successful');
      });

      expect(result.current.success).toBe('Operation successful');
      expect(result.current.error).toBe('');
      expect(result.current.loading).toBe(false);
    });

    it('should clear previous error when setting success', () => {
      const { result } = renderHook(() => useFormState());

      act(() => {
        result.current.setError('Error message');
      });

      expect(result.current.error).toBe('Error message');

      act(() => {
        result.current.setSuccess('Success message');
      });

      expect(result.current.error).toBe('');
      expect(result.current.success).toBe('Success message');
    });

    it('should overwrite previous success message', () => {
      const { result } = renderHook(() => useFormState());

      act(() => {
        result.current.setSuccess('First success');
      });

      expect(result.current.success).toBe('First success');

      act(() => {
        result.current.setSuccess('Second success');
      });

      expect(result.current.success).toBe('Second success');
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useFormState());

      act(() => {
        result.current.startLoading();
        result.current.setError('Error message');
        result.current.setSuccess('Success message');
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('');
      expect(result.current.success).toBe('');
    });
  });

  describe('setLoading', () => {
    it('should directly set loading state', () => {
      const { result } = renderHook(() => useFormState());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.loading).toBe(false);
    });

    it('should not clear messages when setLoading is called directly', () => {
      const { result } = renderHook(() => useFormState());

      act(() => {
        result.current.setError('Error message');
      });

      expect(result.current.error).toBe('Error message');
      expect(result.current.loading).toBe(false);

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.error).toBe('Error message');
      expect(result.current.loading).toBe(true);
    });
  });

  describe('typical form submission workflow', () => {
    it('should handle successful form submission flow', () => {
      const { result } = renderHook(() => useFormState());

      act(() => {
        result.current.startLoading();
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe('');
      expect(result.current.success).toBe('');

      act(() => {
        result.current.setSuccess('Form submitted successfully');
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.success).toBe('Form submitted successfully');
      expect(result.current.error).toBe('');
    });

    it('should handle failed form submission flow', () => {
      const { result } = renderHook(() => useFormState());

      act(() => {
        result.current.startLoading();
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        result.current.setError('Submission failed');
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Submission failed');
      expect(result.current.success).toBe('');
    });

    it('should handle retry after error', () => {
      const { result } = renderHook(() => useFormState());

      act(() => {
        result.current.startLoading();
        result.current.setError('First attempt failed');
      });

      expect(result.current.error).toBe('First attempt failed');

      act(() => {
        result.current.startLoading();
      });

      expect(result.current.error).toBe('');
      expect(result.current.loading).toBe(true);

      act(() => {
        result.current.setSuccess('Second attempt succeeded');
      });

      expect(result.current.success).toBe('Second attempt succeeded');
      expect(result.current.error).toBe('');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('callback stability', () => {
    it('should have stable callback references', () => {
      const { result, rerender } = renderHook(() => useFormState());

      const initialCallbacks = {
        startLoading: result.current.startLoading,
        stopLoading: result.current.stopLoading,
        setError: result.current.setError,
        setSuccess: result.current.setSuccess,
        reset: result.current.reset,
      };

      rerender();

      expect(result.current.startLoading).toBe(initialCallbacks.startLoading);
      expect(result.current.stopLoading).toBe(initialCallbacks.stopLoading);
      expect(result.current.setError).toBe(initialCallbacks.setError);
      expect(result.current.setSuccess).toBe(initialCallbacks.setSuccess);
      expect(result.current.reset).toBe(initialCallbacks.reset);
    });
  });
});
