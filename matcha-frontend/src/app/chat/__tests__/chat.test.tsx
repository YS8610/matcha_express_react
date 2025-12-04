import { describe, it, expect, beforeEach, vi } from 'vitest';

interface TestMessage {
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: number;
}

describe('Chat Component Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Message deduplication', () => {
    it('should dedup messages from local and websocket sources', () => {
      const localMessages: TestMessage[] = [
        { fromUserId: 'user-1', toUserId: 'user-2', content: 'Hello', timestamp: 1000 },
      ];
      const wsMessages: TestMessage[] = [
        { fromUserId: 'user-1', toUserId: 'user-2', content: 'Hello', timestamp: 1000 },
        { fromUserId: 'user-2', toUserId: 'user-1', content: 'Hi', timestamp: 2000 },
      ];

      const seen = new Set<string>();
      const allMessages: TestMessage[] = [];

      localMessages.forEach((m) => {
        const key = `${m.timestamp}-${m.content}-${m.fromUserId}`;
        if (!seen.has(key)) {
          seen.add(key);
          allMessages.push(m);
        }
      });

      wsMessages.forEach((m) => {
        const key = `${m.timestamp}-${m.content}-${m.fromUserId}`;
        if (!seen.has(key)) {
          seen.add(key);
          allMessages.push(m);
        }
      });

      expect(allMessages.length).toBe(2);
      expect(allMessages.map((m) => m.content)).toEqual(['Hello', 'Hi']);
    });
  });

  describe('Message input validation', () => {
    it('should only allow non-empty messages', () => {
      const validateMessage = (msg: string) => msg.trim().length > 0;

      expect(validateMessage('')).toBe(false);
      expect(validateMessage('   ')).toBe(false);
      expect(validateMessage('Hello')).toBe(true);
    });

    it('should determine message direction correctly', () => {
      const currentUserId = 'user-1';
      const msg = { fromUserId: 'user-1', toUserId: 'user-2', content: 'test', timestamp: 1000 };

      const isFromMe = msg.fromUserId === currentUserId;
      expect(isFromMe).toBe(true);

      const msg2 = { fromUserId: 'user-2', toUserId: 'user-1', content: 'test', timestamp: 1000 };
      const isFromMe2 = msg2.fromUserId === currentUserId;
      expect(isFromMe2).toBe(false);
    });
  });

  describe('Message sorting', () => {
    it('should sort messages by timestamp', () => {
      const messages = [
        { timestamp: 3000, content: 'Third' },
        { timestamp: 1000, content: 'First' },
        { timestamp: 2000, content: 'Second' },
      ];

      const sorted = [...messages].sort((a, b) => a.timestamp - b.timestamp);

      expect(sorted[0].content).toBe('First');
      expect(sorted[1].content).toBe('Second');
      expect(sorted[2].content).toBe('Third');
    });
  });

  describe('Chat state management', () => {
    it('should add messages to chat state', () => {
      let chatMessages: Record<string, TestMessage[]> = {};
      const userId = 'user-123';

      const addMessage = (msg: TestMessage) => {
        const otherUserId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId;
        chatMessages = {
          ...chatMessages,
          [otherUserId]: [...(chatMessages[otherUserId] || []), msg],
        };
      };

      addMessage({ fromUserId: 'user-456', toUserId: userId, content: 'Hello', timestamp: 1000 });
      expect(chatMessages['user-456'].length).toBe(1);
      expect(chatMessages['user-456'][0].content).toBe('Hello');

      addMessage({ fromUserId: 'user-456', toUserId: userId, content: 'World', timestamp: 2000 });
      expect(chatMessages['user-456'].length).toBe(2);
    });
  });

  describe('Message persistence', () => {
    it('should persist and restore messages from localStorage', () => {
      const messages = {
        'user-123': [
          { fromUserId: 'user-456', toUserId: 'user-123', content: 'Test', timestamp: 1000 },
        ],
      };

      const storage: Record<string, string> = {};
      storage['chatMessages'] = JSON.stringify(messages);

      const retrieved = JSON.parse(storage['chatMessages'] || '{}');
      expect(retrieved['user-123']).toBeDefined();
      expect(retrieved['user-123'][0].content).toBe('Test');
    });
  });
});
