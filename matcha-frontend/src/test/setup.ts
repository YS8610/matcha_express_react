import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  useParams: () => ({
    id: 'test-user-id',
  }),
}));

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
  })),
}));

const storage: Record<string, string> = {};

const localStorageMock = {
  length: 0,
  key: vi.fn((index: number) => {
    const keys = Object.keys(storage);
    return keys[index] || null;
  }),
  getItem: vi.fn((key: string) => storage[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    storage[key] = value.toString();
    localStorageMock.length = Object.keys(storage).length;
  }),
  removeItem: vi.fn((key: string) => {
    delete storage[key];
    localStorageMock.length = Object.keys(storage).length;
  }),
  clear: vi.fn(() => {
    Object.keys(storage).forEach(key => delete storage[key]);
    localStorageMock.length = 0;
  }),
};
global.localStorage = localStorageMock as unknown as Storage;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
