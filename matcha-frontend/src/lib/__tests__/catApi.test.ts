import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRandomCatPhoto, getRandomCatPhotoAsFile } from '../catApi';

describe('catApi', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    vi.spyOn(Math, 'random').mockReturnValue(0.123456789);
    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
  });

  describe('getRandomCatPhoto', () => {
    it('should return cat image data with correct structure', async () => {
      const catImage = await getRandomCatPhoto();

      expect(catImage).toHaveProperty('id');
      expect(catImage).toHaveProperty('url');
      expect(catImage).toHaveProperty('width');
      expect(catImage).toHaveProperty('height');
    });

    it('should generate unique ID', async () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.111)
        .mockReturnValueOnce(0.222);

      const catImage1 = await getRandomCatPhoto();
      const catImage2 = await getRandomCatPhoto();

      expect(catImage1.id).not.toBe(catImage2.id);
    });

    it('should return URL with timestamp query parameter', async () => {
      const catImage = await getRandomCatPhoto();

      expect(catImage.url).toContain('cataas.com/cat?');
      expect(catImage.url).toContain('1234567890');
    });

    it('should have default dimensions', async () => {
      const catImage = await getRandomCatPhoto();

      expect(catImage.width).toBe(800);
      expect(catImage.height).toBe(600);
    });

    it('should create different URLs on subsequent calls', async () => {
      vi.spyOn(Date, 'now')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(2000);

      const catImage1 = await getRandomCatPhoto();
      const catImage2 = await getRandomCatPhoto();

      expect(catImage1.url).not.toBe(catImage2.url);
    });
  });

  describe('getRandomCatPhotoAsFile', () => {
    it('should fetch cat photo and return as File', async () => {
      const mockBlob = new Blob(['cat image data'], { type: 'image/jpeg' });

      (global.fetch as any).mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const file = await getRandomCatPhotoAsFile();

      expect(file).toBeInstanceOf(File);
      expect(file.name).toContain('cat-');
      expect(file.name).toContain('.jpg');
      expect(file.type).toBe('image/jpeg');
    });

    it('should use blob type from response', async () => {
      const mockBlob = new Blob(['cat image data'], { type: 'image/png' });

      (global.fetch as any).mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const file = await getRandomCatPhotoAsFile();

      expect(file.type).toBe('image/png');
    });

    it('should default to image/jpeg when blob has no type', async () => {
      const mockBlob = new Blob(['cat image data'], { type: '' });

      (global.fetch as any).mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const file = await getRandomCatPhotoAsFile();

      expect(file.type).toBe('image/jpeg');
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(getRandomCatPhotoAsFile()).rejects.toThrow(
        'Failed to load random cat photo. Try uploading your own photo instead.'
      );
    });

    it('should throw user-friendly error on network failure', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      await expect(getRandomCatPhotoAsFile()).rejects.toThrow(
        'Failed to load random cat photo. Try uploading your own photo instead.'
      );
    });

    it('should call fetch with cat API URL', async () => {
      const mockBlob = new Blob(['cat image data'], { type: 'image/jpeg' });

      (global.fetch as any).mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      await getRandomCatPhotoAsFile();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('cataas.com/cat')
      );
    });

    it('should generate unique filenames for different cats', async () => {
      const mockBlob = new Blob(['cat image data'], { type: 'image/jpeg' });

      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.111)
        .mockReturnValueOnce(0.222);

      (global.fetch as any).mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const file1 = await getRandomCatPhotoAsFile();
      const file2 = await getRandomCatPhotoAsFile();

      expect(file1.name).not.toBe(file2.name);
    });

    it('should create File with correct blob content', async () => {
      const content = 'cat image data';
      const mockBlob = new Blob([content], { type: 'image/jpeg' });

      (global.fetch as any).mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const file = await getRandomCatPhotoAsFile();

      expect(file).toBeInstanceOf(File);
      expect(file.size).toBeGreaterThan(0);
    });

    it('should handle large image blobs', async () => {
      const largeContent = 'x'.repeat(1000000);
      const mockBlob = new Blob([largeContent], { type: 'image/jpeg' });

      (global.fetch as any).mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const file = await getRandomCatPhotoAsFile();

      expect(file.size).toBeGreaterThan(999999);
    });

    it('should call getRandomCatPhoto internally', async () => {
      const mockBlob = new Blob(['cat image data'], { type: 'image/jpeg' });

      (global.fetch as any).mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      });

      const file = await getRandomCatPhotoAsFile();

      expect(file.name).toMatch(/^cat-.+\.jpg$/);
    });
  });
});
