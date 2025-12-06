import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(<Footer />);
    expect(container).toBeTruthy();
  });

  // Add more tests here
});
