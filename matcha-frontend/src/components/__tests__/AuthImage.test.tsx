import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import AuthImage from '@/components/AuthImage';
import * as useAuthImageModule from '@/hooks/useAuthImage';

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} data-testid="auth-image" {...props} />
  ),
}));

vi.mock('@/hooks/useAuthImage', () => ({
  useAuthImage: vi.fn(),
}));

describe('AuthImage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render null when no src is provided', () => {
    (useAuthImageModule.useAuthImage as any).mockReturnValue(null);

    const { container } = render(
      <AuthImage src="" alt="test" />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should extract photo name from API photo URL', () => {
    (useAuthImageModule.useAuthImage as any).mockReturnValue('blob:url');

    render(
      <AuthImage src="/api/photo/photo1.jpg" alt="test" />
    );

    expect(useAuthImageModule.useAuthImage).toHaveBeenCalledWith('photo1.jpg');
  });

  it('should use auth image URL when available', () => {
    const authUrl = 'blob:mock-url';
    (useAuthImageModule.useAuthImage as any).mockReturnValue(authUrl);

    const { getByTestId } = render(
      <AuthImage src="/api/photo/photo1.jpg" alt="test" />
    );

    const img = getByTestId('auth-image');
    expect(img.getAttribute('src')).toBe(authUrl);
  });

  it('should use fallback src when auth image not available', () => {
    (useAuthImageModule.useAuthImage as any).mockReturnValue(null);

    const { getByTestId } = render(
      <AuthImage src="/api/photo/photo1.jpg" alt="test" fallbackSrc="/fallback.jpg" />
    );

    const img = getByTestId('auth-image');
    expect(img.getAttribute('src')).toBe('/fallback.jpg');
  });

  it('should use original src if not API photo URL', () => {
    (useAuthImageModule.useAuthImage as any).mockReturnValue(null);

    const { getByTestId } = render(
      <AuthImage src="/regular-image.jpg" alt="test" />
    );

    const img = getByTestId('auth-image');
    expect(img.getAttribute('src')).toBe('/regular-image.jpg');
  });

  it('should pass width and height props to Image component', () => {
    (useAuthImageModule.useAuthImage as any).mockReturnValue('blob:url');

    const { getByTestId } = render(
      <AuthImage src="/api/photo/photo1.jpg" alt="test" width={100} height={100} />
    );

    const img = getByTestId('auth-image');
    expect(img.getAttribute('width')).toBe('100');
    expect(img.getAttribute('height')).toBe('100');
  });

  it('should pass className to Image component', () => {
    (useAuthImageModule.useAuthImage as any).mockReturnValue('blob:url');

    const { getByTestId } = render(
      <AuthImage src="/api/photo/photo1.jpg" alt="test" className="test-class" />
    );

    const img = getByTestId('auth-image');
    expect(img.classList.contains('test-class')).toBe(true);
  });

  it('should pass alt text to Image component', () => {
    (useAuthImageModule.useAuthImage as any).mockReturnValue('blob:url');

    const { getByTestId } = render(
      <AuthImage src="/api/photo/photo1.jpg" alt="Profile Picture" />
    );

    const img = getByTestId('auth-image');
    expect(img.getAttribute('alt')).toBe('Profile Picture');
  });

  it('should handle fill prop', () => {
    (useAuthImageModule.useAuthImage as any).mockReturnValue('blob:url');

    const { getByTestId } = render(
      <AuthImage src="/api/photo/photo1.jpg" alt="test" fill />
    );

    const img = getByTestId('auth-image');
    expect(img.getAttribute('data-testid')).toBe('auth-image');
  });

  it('should pass unoptimized prop to Image component', () => {
    (useAuthImageModule.useAuthImage as any).mockReturnValue('blob:url');

    const { getByTestId } = render(
      <AuthImage src="/api/photo/photo1.jpg" alt="test" unoptimized />
    );

    const img = getByTestId('auth-image');
    expect(img).toBeTruthy();
  });

  it('should handle multiple photo URLs correctly', () => {
    (useAuthImageModule.useAuthImage as any).mockReturnValue('blob:url1');

    const { unmount } = render(
      <AuthImage src="/api/photo/photo1.jpg" alt="test1" />
    );

    expect(useAuthImageModule.useAuthImage).toHaveBeenCalledWith('photo1.jpg');

    unmount();

    (useAuthImageModule.useAuthImage as any).mockReturnValue('blob:url2');

    render(
      <AuthImage src="/api/photo/photo2.jpg" alt="test2" />
    );

    expect(useAuthImageModule.useAuthImage).toHaveBeenCalledWith('photo2.jpg');
  });
});
