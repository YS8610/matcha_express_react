import { describe, it, expect, beforeEach, vi } from 'vitest';
import BrowseProfiles from '@/components/browse/BrowseProfiles';

vi.mock('@/lib/api', () => ({
  api: {
    getFilteredProfiles: vi.fn().mockResolvedValue({ data: [] }),
  },
}));

vi.mock('@/contexts/WebSocketContext', () => ({
  useWebSocket: vi.fn(() => ({
    socket: null,
    isConnected: false,
    notifications: [],
    onlineUsers: {},
    chatMessages: {},
    checkOnlineStatus: vi.fn(),
  })),
  WebSocketProvider: ({ children }: any) => children,
}));

describe('BrowseProfiles Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have BrowseProfiles component', () => {
    expect(BrowseProfiles).toBeDefined();
  });
});
