import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ToastProvider } from '@/contexts/ToastContext';

describe('ToastContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide context', () => {
    const { container } = render(<ToastProvider><div /></ToastProvider>);
    expect(container).toBeTruthy();
  });

  // Add more tests here
});
