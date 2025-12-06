import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, renderHook, act, screen, waitFor } from '@testing-library/react';
import { ToastProvider, useToast, Toast, ToastType } from '@/contexts/ToastContext';
import React from 'react';

describe('ToastContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('ToastProvider - Basic Rendering', () => {
    it('should provide context', () => {
      const { container } = render(<ToastProvider><div /></ToastProvider>);
      expect(container).toBeTruthy();
    });

    it('should render children', () => {
      render(
        <ToastProvider>
          <div data-testid="child">Test Child</div>
        </ToastProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <ToastProvider>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
        </ToastProvider>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
    });
  });

  describe('useToast Hook - Basic Functionality', () => {
    it('should provide toast context value', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      expect(result.current).toBeDefined();
      expect(result.current.toasts).toBeDefined();
      expect(result.current.addToast).toBeDefined();
      expect(result.current.removeToast).toBeDefined();
    });

    it('should initialize with empty toasts array', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      expect(result.current.toasts).toEqual([]);
      expect(result.current.toasts).toHaveLength(0);
    });

    it('should throw error when used outside ToastProvider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useToast());
      }).toThrow('useToast must be used within a ToastProvider');

      consoleSpy.mockRestore();
    });

    it('should have correct function types', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      expect(typeof result.current.addToast).toBe('function');
      expect(typeof result.current.removeToast).toBe('function');
    });
  });

  describe('Adding Toasts', () => {
    it('should add a toast with default type (info)', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Test message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Test message');
      expect(result.current.toasts[0].type).toBe('info');
    });

    it('should add a success toast', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Success message', 'success');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].type).toBe('success');
      expect(result.current.toasts[0].message).toBe('Success message');
    });

    it('should add an error toast', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Error message', 'error');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].type).toBe('error');
    });

    it('should add a warning toast', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Warning message', 'warning');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].type).toBe('warning');
    });

    it('should add multiple toasts', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('First toast', 'info');
        result.current.addToast('Second toast', 'success');
        result.current.addToast('Third toast', 'error');
      });

      expect(result.current.toasts).toHaveLength(3);
      expect(result.current.toasts[0].message).toBe('First toast');
      expect(result.current.toasts[1].message).toBe('Second toast');
      expect(result.current.toasts[2].message).toBe('Third toast');
    });

    it('should generate unique IDs for each toast', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Toast 1');
        result.current.addToast('Toast 2');
        result.current.addToast('Toast 3');
      });

      const ids = result.current.toasts.map(t => t.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(3);
      expect(ids).toHaveLength(3);
    });

    it('should set default duration to 4000ms', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Test message');
      });

      expect(result.current.toasts[0].duration).toBe(4000);
    });

    it('should accept custom duration', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Test message', 'info', 2000);
      });

      expect(result.current.toasts[0].duration).toBe(2000);
    });
  });

  describe('Removing Toasts', () => {
    it('should remove a toast by ID', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Test toast', 'info', 0); // duration 0 to prevent auto-removal
      });

      expect(result.current.toasts).toHaveLength(1);
      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.removeToast(toastId);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should remove only the specified toast', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Toast 1', 'info', 0);
        result.current.addToast('Toast 2', 'info', 0);
        result.current.addToast('Toast 3', 'info', 0);
      });

      expect(result.current.toasts).toHaveLength(3);
      const toast1Id = result.current.toasts[0].id;
      const toast2Id = result.current.toasts[1].id;
      const toast3Id = result.current.toasts[2].id;

      act(() => {
        result.current.removeToast(toast2Id);
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts[0].id).toBe(toast1Id);
      expect(result.current.toasts[1].id).toBe(toast3Id);
    });

    it('should handle removing non-existent toast gracefully', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Test toast', 'info', 0);
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.removeToast('non-existent-id');
      });

      expect(result.current.toasts).toHaveLength(1);
    });
  });

  describe('Auto-removal with Duration', () => {
    it('should auto-remove toast after default duration', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Test message');
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        vi.advanceTimersByTime(4000);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should auto-remove toast after custom duration', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Test message', 'info', 2000);
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should not auto-remove toast with duration 0', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Persistent toast', 'info', 0);
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.toasts).toHaveLength(1);
    });

    it('should handle multiple toasts with different durations', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Toast 1', 'info', 1000);
        result.current.addToast('Toast 2', 'info', 2000);
        result.current.addToast('Toast 3', 'info', 3000);
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts[0].message).toBe('Toast 2');

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Toast 3');

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });

  describe('Toast Structure', () => {
    it('should have correct toast structure', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Test message', 'success', 3000);
      });

      const toast = result.current.toasts[0];
      expect(toast).toHaveProperty('id');
      expect(toast).toHaveProperty('message');
      expect(toast).toHaveProperty('type');
      expect(toast).toHaveProperty('duration');
    });

    it('should have ID starting with "toast-"', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Test');
      });

      expect(result.current.toasts[0].id).toMatch(/^toast-/);
    });
  });

  describe('State Management', () => {
    it('should maintain toast state across re-renders', () => {
      const { result, rerender } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Persistent toast', 'info', 0);
      });

      rerender();

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Persistent toast');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty message', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('');
    });

    it('should handle very long messages', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      const longMessage = 'A'.repeat(1000);

      act(() => {
        result.current.addToast(longMessage);
      });

      expect(result.current.toasts[0].message).toBe(longMessage);
      expect(result.current.toasts[0].message).toHaveLength(1000);
    });

    it('should handle adding many toasts rapidly', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.addToast(`Toast ${i}`, 'info', 0);
        }
      });

      expect(result.current.toasts).toHaveLength(50);
    });

    it('should handle negative duration gracefully', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.addToast('Test', 'info', -1000);
      });

      // Negative duration should not auto-remove
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.toasts).toHaveLength(1);
    });
  });

  describe('Integration Tests', () => {
    it('should work with nested components', () => {
      function ToastTrigger() {
        const { addToast, toasts } = useToast();
        return (
          <div>
            <button onClick={() => addToast('Test toast', 'success', 0)} data-testid="add-btn">
              Add Toast
            </button>
            <div data-testid="toast-count">{toasts.length}</div>
          </div>
        );
      }

      render(
        <ToastProvider>
          <ToastTrigger />
        </ToastProvider>
      );

      const addButton = screen.getByTestId('add-btn');
      const toastCount = screen.getByTestId('toast-count');

      expect(toastCount.textContent).toBe('0');

      act(() => {
        addButton.click();
      });

      expect(toastCount.textContent).toBe('1');
    });

    it('should provide consistent context to multiple consumers', () => {
      function AddToastButton() {
        const { addToast } = useToast();
        return <button onClick={() => addToast('New toast', 'info', 0)} data-testid="add">Add</button>;
      }

      function ToastCounter() {
        const { toasts } = useToast();
        return <div data-testid="count">{toasts.length}</div>;
      }

      function ToastRemover() {
        const { toasts, removeToast } = useToast();
        return (
          <button
            onClick={() => toasts.length > 0 && removeToast(toasts[0].id)}
            data-testid="remove"
          >
            Remove First
          </button>
        );
      }

      render(
        <ToastProvider>
          <AddToastButton />
          <ToastCounter />
          <ToastRemover />
        </ToastProvider>
      );

      const addBtn = screen.getByTestId('add');
      const removeBtn = screen.getByTestId('remove');
      const counter = screen.getByTestId('count');

      expect(counter.textContent).toBe('0');

      act(() => {
        addBtn.click();
        addBtn.click();
      });

      expect(counter.textContent).toBe('2');

      act(() => {
        removeBtn.click();
      });

      expect(counter.textContent).toBe('1');
    });
  });

  describe('Callback Stability', () => {
    it('should maintain stable addToast reference', () => {
      const { result, rerender } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      const initialAddToast = result.current.addToast;

      rerender();

      expect(result.current.addToast).toBe(initialAddToast);
    });

    it('should maintain stable removeToast reference', () => {
      const { result, rerender } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      const initialRemoveToast = result.current.removeToast;

      rerender();

      expect(result.current.removeToast).toBe(initialRemoveToast);
    });
  });
});
