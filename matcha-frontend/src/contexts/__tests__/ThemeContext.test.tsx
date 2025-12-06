import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide context', () => {
    const { container } = render(<ThemeProvider><div /></ThemeProvider>);
    expect(container).toBeTruthy();
  });

  // Add more tests here
});
