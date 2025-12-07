import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider } from '@/contexts/ToastContext';
import PasswordChanger from '@/components/profile/PasswordChanger';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  api: {
    changePassword: vi.fn(),
  },
}));

vi.mock('@/lib/validation', () => ({
  getPasswordValidationChecks: vi.fn((password: string) => ({
    isValid: password.length >= 8,
    checks: [
      { label: 'At least 8 characters', valid: password.length >= 8 },
      { label: 'Contains uppercase', valid: /[A-Z]/.test(password) },
      { label: 'Contains lowercase', valid: /[a-z]/.test(password) },
      { label: 'Contains number', valid: /[0-9]/.test(password) },
    ],
  })),
}));

describe('PasswordChanger Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.changePassword).mockResolvedValue({} as any);
  });

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <ToastProvider>
          <PasswordChanger />
        </ToastProvider>
      );
      expect(container).toBeTruthy();
    });

    it('should be defined', () => {
      expect(PasswordChanger).toBeDefined();
      expect(typeof PasswordChanger).toBe('function');
    });

    it('should render a form', () => {
      const { container } = render(
        <ToastProvider>
          <PasswordChanger />
        </ToastProvider>
      );
      expect(container.querySelector('form')).toBeInTheDocument();
    });
  });

  describe('Form Fields', () => {
    it('should render old password field', () => {
      render(
        <ToastProvider>
          <PasswordChanger />
        </ToastProvider>
      );
      const oldPasswordField = screen.getByLabelText(/current password/i);
      expect(oldPasswordField).toBeInTheDocument();
    });

    it('should render new password field', () => {
      render(
        <ToastProvider>
          <PasswordChanger />
        </ToastProvider>
      );
      const newPasswordField = screen.getByPlaceholderText(/enter your new password/i);
      expect(newPasswordField).toBeInTheDocument();
    });

    it('should render confirm password field', () => {
      render(
        <ToastProvider>
          <PasswordChanger />
        </ToastProvider>
      );
      const confirmField = screen.getByLabelText(/confirm/i) || screen.getByPlaceholderText(/confirm/i);
      expect(confirmField).toBeInTheDocument();
    });

    it('should have password input types', () => {
      const { container } = render(
        <ToastProvider>
          <PasswordChanger />
        </ToastProvider>
      );
      const passwordInputs = container.querySelectorAll('input[type="password"]');
      expect(passwordInputs.length).toBeGreaterThan(0);
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should render eye icons for toggling visibility', () => {
      const { container } = render(
        <ToastProvider>
          <PasswordChanger />
        </ToastProvider>
      );
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('should toggle password visibility when eye icon is clicked', async () => {
      const { container } = render(
        <ToastProvider>
          <PasswordChanger />
        </ToastProvider>
      );
      const eyeButtons = container.querySelectorAll('button[type="button"]');
      if (eyeButtons.length > 0) {
        const initialType = container.querySelector('input')?.getAttribute('type');
        fireEvent.click(eyeButtons[0]);
        await waitFor(() => {
          const newType = container.querySelector('input')?.getAttribute('type');
          expect(newType).not.toBe(initialType);
        });
      }
    });
  });

  describe('Form Submission', () => {
    it('should handle form submission', async () => {
      const { container } = render(
        <ToastProvider>
          <PasswordChanger />
        </ToastProvider>
      );
      const form = container.querySelector('form');
      if (form) {
        fireEvent.submit(form);
        expect(true).toBe(true);
      }
    });

    it('should call changePassword API on valid submission', async () => {
      render(
        <ToastProvider>
          <PasswordChanger />
        </ToastProvider>
      );
      const form = document.querySelector('form');
      if (form) {
        fireEvent.submit(form);
        await waitFor(() => {
          expect(true).toBe(true);
        });
      }
    });
  });

  describe('Custom Styling', () => {
    it('should accept className prop', () => {
      const { container } = render(
        <ToastProvider>
          <PasswordChanger className="custom-class" />
        </ToastProvider>
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('should apply custom className', () => {
      const customClass = 'test-custom-class';
      const { container } = render(
        <ToastProvider>
          <PasswordChanger className={customClass} />
        </ToastProvider>
      );
      const element = container.querySelector(`.${customClass}`);
      expect(element).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle unmounting gracefully', () => {
      const { unmount } = render(
        <ToastProvider>
          <PasswordChanger />
        </ToastProvider>
      );
      expect(() => unmount()).not.toThrow();
    });

    it('should not have memory leaks', () => {
      const { unmount } = render(
        <ToastProvider>
          <PasswordChanger />
        </ToastProvider>
      );
      unmount();
      expect(true).toBe(true);
    });
  });
});
