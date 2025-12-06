import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PhotoDisplay from '@/components/profile/PhotoDisplay';

describe('PhotoDisplay Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(<PhotoDisplay />);
    expect(container).toBeTruthy();
  });

  // Add more tests here
});
