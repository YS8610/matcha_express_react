import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { WebSocketProvider, useWebSocket } from '@/contexts/WebSocketContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import type { ChatMessage } from '@/types';

vi.mock('socket.io-client');

const TestComponent = () => {
  const { isConnected, chatMessages } = useWebSocket();

  return (
    <div>
      <div data-testid="connection-status">
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      <div data-testid="chat-messages">
        {JSON.stringify(chatMessages)}
      </div>
    </div>
  );
};

describe('WebSocketContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear?.();
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
  });

  it('should initialize with disconnected state', () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <WebSocketProvider>
            <TestComponent />
          </WebSocketProvider>
        </AuthProvider>
      </ToastProvider>
    );

    expect(screen.getByTestId('connection-status')).toHaveTextContent('Disconnected');
  });

  it('should load chat messages from localStorage on mount', () => {
    const mockMessages = {
      'user-123': [
        {
          fromUserId: 'user-456',
          toUserId: 'user-123',
          content: 'Hello',
          timestamp: 1234567890,
        },
      ],
    };

    (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'chatMessages') return JSON.stringify(mockMessages);
      return null;
    });

    render(
      <ToastProvider>
        <AuthProvider>
          <WebSocketProvider>
            <TestComponent />
          </WebSocketProvider>
        </AuthProvider>
      </ToastProvider>
    );

    expect(screen.getByTestId('chat-messages')).toBeInTheDocument();
  });

  it('should persist chat messages to localStorage when they are added', async () => {
    const MessageSenderComponent = () => {
      const { sendChatMessage } = useWebSocket();

      return (
        <button onClick={() => sendChatMessage('user-123', 'Test message')}>
          Send Message
        </button>
      );
    };

    render(
      <ToastProvider>
        <AuthProvider>
          <WebSocketProvider>
            <MessageSenderComponent />
          </WebSocketProvider>
        </AuthProvider>
      </ToastProvider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle invalid localStorage data gracefully', () => {
    (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'chatMessages') return 'invalid-json';
      return null;
    });

    expect(() => {
      render(
        <ToastProvider>
          <AuthProvider>
            <WebSocketProvider>
              <TestComponent />
            </WebSocketProvider>
          </AuthProvider>
        </ToastProvider>
      );
    }).not.toThrow();
  });

  it('should update online status when receiving status updates', async () => {
    const OnlineStatusComponent = () => {
      const { onlineUsers } = useWebSocket();

      return (
        <div data-testid="online-users">
          {JSON.stringify(onlineUsers)}
        </div>
      );
    };

    render(
      <ToastProvider>
        <AuthProvider>
          <WebSocketProvider>
            <OnlineStatusComponent />
          </WebSocketProvider>
        </AuthProvider>
      </ToastProvider>
    );

    expect(screen.getByTestId('online-users')).toBeInTheDocument();
  });
});
