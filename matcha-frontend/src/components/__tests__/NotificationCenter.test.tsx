import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotificationCenter from '@/components/NotificationCenter';
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { AuthProvider } from '@/contexts/AuthContext';

vi.mock('socket.io-client');
vi.mock('@/lib/api', () => ({
  api: {
    getNotifications: vi.fn().mockResolvedValue({ data: [] }),
  },
}));

describe('NotificationCenter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <ToastProvider>
        <AuthProvider>
          <WebSocketProvider>
            <NotificationCenter />
          </WebSocketProvider>
        </AuthProvider>
      </ToastProvider>
    );
    expect(container).toBeTruthy();
  });

  // Add more tests here
});
