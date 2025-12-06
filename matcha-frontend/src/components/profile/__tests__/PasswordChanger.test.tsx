import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToastProvider } from '@/contexts/ToastContext';
import PasswordChanger from '@/components/profile/PasswordChanger';

vi.mock('@/lib/api', () => ({
  api: {
    changePassword: vi.fn().mockResolvedValue({}),
  },
}));

describe('PasswordChanger Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <ToastProvider>
        <PasswordChanger />
      </ToastProvider>
    );
    expect(container).toBeTruthy();
  });

  // Add more tests here
});
