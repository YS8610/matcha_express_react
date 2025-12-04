import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import TransitionLink from '@/components/TransitionLink';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, onClick, className }: any) => (
    <a href={href} onClick={onClick} className={className} data-testid="link">
      {children}
    </a>
  ),
}));

describe('TransitionLink Component', () => {
  let mockPush: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPush = vi.fn();
    (useRouter as any).mockReturnValue({ push: mockPush });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render link with children', () => {
    const { getByText } = render(
      <TransitionLink href="/test">Click me</TransitionLink>
    );

    expect(getByText('Click me')).toBeTruthy();
  });

  it('should render with correct href', () => {
    const { getByTestId } = render(
      <TransitionLink href="/profile">Profile</TransitionLink>
    );

    const link = getByTestId('link');
    expect(link.getAttribute('href')).toBe('/profile');
  });

  it('should apply className prop', () => {
    const { getByTestId } = render(
      <TransitionLink href="/test" className="custom-class">
        Link
      </TransitionLink>
    );

    const link = getByTestId('link');
    expect(link.classList.contains('custom-class')).toBe(true);
  });

  it('should call onClick callback when clicked', async () => {
    const onClickMock = vi.fn();

    const { getByTestId } = render(
      <TransitionLink href="/test" onClick={onClickMock}>
        Link
      </TransitionLink>
    );

    const link = getByTestId('link');
    fireEvent.click(link);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should prevent default link behavior', async () => {
    const { getByTestId } = render(
      <TransitionLink href="/test">Link</TransitionLink>
    );

    const link = getByTestId('link');

    fireEvent.click(link);

    vi.advanceTimersByTime(50);

    expect(mockPush).toHaveBeenCalled();
  });

  it('should push to new route after delay', async () => {
    const { getByTestId } = render(
      <TransitionLink href="/new-page">Navigate</TransitionLink>
    );

    const link = getByTestId('link');
    fireEvent.click(link);

    expect(mockPush).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);

    expect(mockPush).toHaveBeenCalledWith('/new-page');
  });

  it('should execute onClick before navigation', () => {
    const callOrder: string[] = [];
    const onClickMock = vi.fn(() => callOrder.push('onClick'));
    mockPush.mockImplementation(() => callOrder.push('push'));

    const { getByTestId } = render(
      <TransitionLink href="/test" onClick={onClickMock}>
        Link
      </TransitionLink>
    );

    const link = getByTestId('link');
    fireEvent.click(link);

    vi.advanceTimersByTime(50);

    expect(callOrder[0]).toBe('onClick');
    expect(callOrder[1]).toBe('push');
  });

  it('should handle multiple clicks', async () => {
    const { getByTestId } = render(
      <TransitionLink href="/page1">Link</TransitionLink>
    );

    const link = getByTestId('link');

    fireEvent.click(link);
    vi.advanceTimersByTime(50);

    expect(mockPush).toHaveBeenCalledWith('/page1');

    mockPush.mockClear();

    fireEvent.click(link);
    vi.advanceTimersByTime(50);

    expect(mockPush).toHaveBeenCalledWith('/page1');
  });

  it('should work with different href values', () => {
    const { rerender, getByTestId } = render(
      <TransitionLink href="/page1">Link</TransitionLink>
    );

    let link = getByTestId('link');
    expect(link.getAttribute('href')).toBe('/page1');

    rerender(
      <TransitionLink href="/page2">Link</TransitionLink>
    );

    link = getByTestId('link');
    expect(link.getAttribute('href')).toBe('/page2');
  });

  it('should handle onClick undefined', () => {
    const { getByTestId } = render(
      <TransitionLink href="/test">Link</TransitionLink>
    );

    const link = getByTestId('link');
    expect(() => fireEvent.click(link)).not.toThrow();
  });

  it('should render multiple children', () => {
    const { getByTestId } = render(
      <TransitionLink href="/test">
        <span>First</span>
        <span>Second</span>
      </TransitionLink>
    );

    const link = getByTestId('link');
    expect(link.children.length).toBe(2);
  });
});
