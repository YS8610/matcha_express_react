import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PhotoDisplay from '@/components/profile/PhotoDisplay';
import * as tokenStorage from '@/lib/tokenStorage';

vi.mock('@/lib/tokenStorage', () => ({
  getToken: vi.fn(),
}));

global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('PhotoDisplay Component', () => {
  const mockToken = 'mock-auth-token';
  const mockPhotoName = 'test-photo.jpg';
  const mockAlt = 'Test photo alt text';

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading state initially', () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should apply correct loading state classes', () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      const { container } = render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);
      const loadingDiv = screen.getByText('Loading...').parentElement;

      expect(loadingDiv).toHaveClass('bg-gray-200', 'dark:bg-gray-600', 'flex', 'items-center', 'justify-center');
    });

    it('should apply custom className during loading', () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      const customClass = 'custom-photo-class';
      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} className={customClass} />);

      const loadingDiv = screen.getByText('Loading...').parentElement;
      expect(loadingDiv).toHaveClass(customClass);
    });
  });

  describe('Successful Photo Loading', () => {
    it('should fetch and display photo with valid token', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      const mockBlob = new Blob(['fake image data'], { type: 'image/jpeg' });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

      await waitFor(() => {
        const img = screen.getByAltText(mockAlt);
        expect(img).toBeInTheDocument();
      });
    });

    it('should call fetch with correct URL and headers', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      const mockBlob = new Blob(['fake image data'], { type: 'image/jpeg' });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          `/api/photo/${mockPhotoName}`,
          {
            headers: {
              'Authorization': `Bearer ${mockToken}`,
            },
          }
        );
      });
    });

    it('should create object URL from blob', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      const mockBlob = new Blob(['fake image data'], { type: 'image/jpeg' });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

      await waitFor(() => {
        expect(URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      });
    });

    it('should set image src to blob URL', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      const mockBlob = new Blob(['fake image data'], { type: 'image/jpeg' });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

      await waitFor(() => {
        const img = screen.getByAltText(mockAlt) as HTMLImageElement;
        expect(img.src).toContain('blob:mock-url');
      });
    });

    it('should apply className to image element', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      const mockBlob = new Blob(['fake image data'], { type: 'image/jpeg' });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const customClass = 'rounded-full';
      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} className={customClass} />);

      await waitFor(() => {
        const img = screen.getByAltText(mockAlt);
        expect(img).toHaveClass(customClass);
      });
    });

    it('should apply correct inline styles to image', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      const mockBlob = new Blob(['fake image data'], { type: 'image/jpeg' });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

      await waitFor(() => {
        const img = screen.getByAltText(mockAlt);
        expect(img).toHaveStyle({
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error state when no token is available', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(null);

      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
      });
    });

    it('should show error state when fetch fails', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
      });
    });

    it('should show error state when fetch throws exception', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
      });
    });

    it('should apply correct error state classes', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(null);

      const { container } = render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

      await waitFor(() => {
        const errorDiv = screen.getByText('Failed to load').parentElement;
        expect(errorDiv).toHaveClass('bg-gray-100', 'dark:bg-gray-700', 'flex', 'items-center', 'justify-center');
      });
    });

    it('should apply custom className during error state', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(null);

      const customClass = 'custom-error-class';
      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} className={customClass} />);

      await waitFor(() => {
        const errorDiv = screen.getByText('Failed to load').parentElement;
        expect(errorDiv).toHaveClass(customClass);
      });
    });

    it('should log error when no token available', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(tokenStorage.getToken).mockReturnValue(null);

      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('No auth token available');
      });

      consoleSpy.mockRestore();
    });

    it('should log error when photo fetch fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Props Validation', () => {
    it('should handle empty photoName', () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      render(<PhotoDisplay photoName="" alt={mockAlt} />);

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should handle photoName changes', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      const mockBlob = new Blob(['fake image data'], { type: 'image/jpeg' });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const { rerender } = render(<PhotoDisplay photoName="photo1.jpg" alt={mockAlt} />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/photo/photo1.jpg',
          expect.any(Object)
        );
      });

      rerender(<PhotoDisplay photoName="photo2.jpg" alt={mockAlt} />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/photo/photo2.jpg',
          expect.any(Object)
        );
      });
    });

    it('should handle missing className prop gracefully', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      const mockBlob = new Blob(['fake image data'], { type: 'image/jpeg' });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

      await waitFor(() => {
        const img = screen.getByAltText(mockAlt);
        expect(img).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle blob creation failure gracefully', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.reject(new Error('Blob creation failed')),
      });

      render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
      });
    });

    it('should handle different HTTP error statuses', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      const statuses = [401, 403, 404, 500];

      for (const status of statuses) {
        vi.clearAllMocks();
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status,
        });

        const { unmount } = render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

        await waitFor(() => {
          expect(screen.getByText('Failed to load')).toBeInTheDocument();
        });

        unmount();
      }
    });

    it('should not fetch when photoName is undefined', () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      render(<PhotoDisplay photoName={undefined as any} alt={mockAlt} />);

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Component Lifecycle', () => {
    it('should clean up on unmount', async () => {
      vi.mocked(tokenStorage.getToken).mockReturnValue(mockToken);

      const mockBlob = new Blob(['fake image data'], { type: 'image/jpeg' });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const { unmount } = render(<PhotoDisplay photoName={mockPhotoName} alt={mockAlt} />);

      await waitFor(() => {
        expect(screen.getByAltText(mockAlt)).toBeInTheDocument();
      });

      unmount();

      expect(screen.queryByAltText(mockAlt)).not.toBeInTheDocument();
    });
  });
});
