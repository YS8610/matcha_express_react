import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToastProvider } from '@/contexts/ToastContext';
import PhotoManager from '@/components/profile/PhotoManager';

vi.mock('@/lib/api', () => ({
  api: {
    getUserPhotos: vi.fn().mockResolvedValue({ photoNames: [] }),
  },
}));

vi.mock('browser-image-compression', () => ({
  default: {
    compress: vi.fn().mockResolvedValue(new Blob()),
  },
}));

describe('PhotoManager Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <ToastProvider>
        <PhotoManager />
      </ToastProvider>
    );
    expect(container).toBeTruthy();
  });

  // Add more tests here
});
