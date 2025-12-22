import { describe, it, expect, vi } from 'vitest';
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
  showApiError,
} from '../toastHelpers';

describe('toastHelpers', () => {
  describe('showSuccessToast', () => {
    it('should call addToast with success type and default duration', () => {
      const addToast = vi.fn();
      showSuccessToast('Success message', addToast);

      expect(addToast).toHaveBeenCalledWith('Success message', 'success', 3000);
    });

    it('should call addToast with custom duration', () => {
      const addToast = vi.fn();
      showSuccessToast('Success message', addToast, 5000);

      expect(addToast).toHaveBeenCalledWith('Success message', 'success', 5000);
    });
  });

  describe('showErrorToast', () => {
    it('should call addToast with error type and default duration', () => {
      const addToast = vi.fn();
      showErrorToast('Error message', addToast);

      expect(addToast).toHaveBeenCalledWith('Error message', 'error', 4000);
    });

    it('should call addToast with custom duration', () => {
      const addToast = vi.fn();
      showErrorToast('Error message', addToast, 6000);

      expect(addToast).toHaveBeenCalledWith('Error message', 'error', 6000);
    });
  });

  describe('showWarningToast', () => {
    it('should call addToast with warning type and default duration', () => {
      const addToast = vi.fn();
      showWarningToast('Warning message', addToast);

      expect(addToast).toHaveBeenCalledWith('Warning message', 'warning', 3000);
    });

    it('should call addToast with custom duration', () => {
      const addToast = vi.fn();
      showWarningToast('Warning message', addToast, 7000);

      expect(addToast).toHaveBeenCalledWith('Warning message', 'warning', 7000);
    });
  });

  describe('showInfoToast', () => {
    it('should call addToast with info type and default duration', () => {
      const addToast = vi.fn();
      showInfoToast('Info message', addToast);

      expect(addToast).toHaveBeenCalledWith('Info message', 'info', 3000);
    });

    it('should call addToast with custom duration', () => {
      const addToast = vi.fn();
      showInfoToast('Info message', addToast, 2000);

      expect(addToast).toHaveBeenCalledWith('Info message', 'info', 2000);
    });
  });

  describe('showApiError', () => {
    it('should extract message from Error object', () => {
      const addToast = vi.fn();
      const error = new Error('API error occurred');

      showApiError(error, addToast);

      expect(addToast).toHaveBeenCalledWith('API error occurred', 'error', 4000);
    });

    it('should handle string errors', () => {
      const addToast = vi.fn();
      const error = 'String error message';

      showApiError(error, addToast);

      expect(addToast).toHaveBeenCalledWith('String error message', 'error', 4000);
    });

    it('should extract message from object with message property', () => {
      const addToast = vi.fn();
      const error = { message: 'Object error message' };

      showApiError(error, addToast);

      expect(addToast).toHaveBeenCalledWith('Object error message', 'error', 4000);
    });

    it('should use fallback message for unknown error types', () => {
      const addToast = vi.fn();
      const error = { code: 500 };

      showApiError(error, addToast);

      expect(addToast).toHaveBeenCalledWith('An error occurred', 'error', 4000);
    });

    it('should use fallback message for null error', () => {
      const addToast = vi.fn();

      showApiError(null, addToast);

      expect(addToast).toHaveBeenCalledWith('An error occurred', 'error', 4000);
    });

    it('should use fallback message for undefined error', () => {
      const addToast = vi.fn();

      showApiError(undefined, addToast);

      expect(addToast).toHaveBeenCalledWith('An error occurred', 'error', 4000);
    });

    it('should use custom fallback message', () => {
      const addToast = vi.fn();
      const error = 12345;

      showApiError(error, addToast, 'Custom fallback message');

      expect(addToast).toHaveBeenCalledWith('Custom fallback message', 'error', 4000);
    });

    it('should use custom duration', () => {
      const addToast = vi.fn();
      const error = new Error('Test error');

      showApiError(error, addToast, 'Fallback', 8000);

      expect(addToast).toHaveBeenCalledWith('Test error', 'error', 8000);
    });

    it('should handle numbers as errors', () => {
      const addToast = vi.fn();

      showApiError(404, addToast);

      expect(addToast).toHaveBeenCalledWith('An error occurred', 'error', 4000);
    });

    it('should handle boolean as errors', () => {
      const addToast = vi.fn();

      showApiError(true, addToast);

      expect(addToast).toHaveBeenCalledWith('An error occurred', 'error', 4000);
    });

    it('should handle array errors', () => {
      const addToast = vi.fn();

      showApiError([1, 2, 3], addToast);

      expect(addToast).toHaveBeenCalledWith('An error occurred', 'error', 4000);
    });

    it('should convert non-string message property to string', () => {
      const addToast = vi.fn();
      const error = { message: 12345 };

      showApiError(error, addToast);

      expect(addToast).toHaveBeenCalledWith('12345', 'error', 4000);
    });

    it('should handle Error with empty message', () => {
      const addToast = vi.fn();
      const error = new Error('');

      showApiError(error, addToast);

      expect(addToast).toHaveBeenCalledWith('', 'error', 4000);
    });

    it('should handle object with null message property', () => {
      const addToast = vi.fn();
      const error = { message: null };

      showApiError(error, addToast);

      expect(addToast).toHaveBeenCalledWith('null', 'error', 4000);
    });
  });

  describe('toast duration defaults', () => {
    it('should use 3000ms for success by default', () => {
      const addToast = vi.fn();
      showSuccessToast('message', addToast);
      expect(addToast.mock.calls[0][2]).toBe(3000);
    });

    it('should use 4000ms for error by default', () => {
      const addToast = vi.fn();
      showErrorToast('message', addToast);
      expect(addToast.mock.calls[0][2]).toBe(4000);
    });

    it('should use 3000ms for warning by default', () => {
      const addToast = vi.fn();
      showWarningToast('message', addToast);
      expect(addToast.mock.calls[0][2]).toBe(3000);
    });

    it('should use 3000ms for info by default', () => {
      const addToast = vi.fn();
      showInfoToast('message', addToast);
      expect(addToast.mock.calls[0][2]).toBe(3000);
    });

    it('should use 4000ms for API error by default', () => {
      const addToast = vi.fn();
      showApiError(new Error('test'), addToast);
      expect(addToast.mock.calls[0][2]).toBe(4000);
    });
  });
});
