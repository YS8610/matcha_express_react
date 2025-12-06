import { describe, it, expect, beforeEach, vi } from 'vitest';
import { proxy, config } from '@/proxy';

describe('Proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export proxy function', () => {
    expect(proxy).toBeDefined();
  });

  it('should export config object', () => {
    expect(config).toBeDefined();
  });
});
