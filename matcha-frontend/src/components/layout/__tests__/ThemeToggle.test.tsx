import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { ThemeProvider } from '@/contexts/ThemeContext';

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(container).toBeTruthy();
  });

  // Add more tests here
});
