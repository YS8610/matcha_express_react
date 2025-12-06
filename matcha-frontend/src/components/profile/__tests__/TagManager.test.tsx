import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToastProvider } from '@/contexts/ToastContext';
import TagManager from '@/components/profile/TagManager';

vi.mock('@/lib/api', () => ({
  api: {
    getUserTags: vi.fn().mockResolvedValue({ tags: [] }),
    addUserTag: vi.fn().mockResolvedValue({}),
    removeUserTag: vi.fn().mockResolvedValue({}),
  },
}));

describe('TagManager Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <ToastProvider>
        <TagManager />
      </ToastProvider>
    );
    expect(container).toBeTruthy();
  });

  // Add more tests here
});
