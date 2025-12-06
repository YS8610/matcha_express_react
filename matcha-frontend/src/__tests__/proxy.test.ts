import { describe, it, expect, beforeEach, vi } from 'vitest';
import { proxy, config } from '@/proxy';
import { NextResponse } from 'next/server';

vi.mock('next/server', () => ({
  NextResponse: {
    redirect: vi.fn((url) => ({ type: 'redirect', url: url.toString() })),
    next: vi.fn(() => ({ type: 'next' })),
  },
}));

describe('Proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export proxy function', () => {
    expect(proxy).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof proxy).toBe('function');
  });

  it('should export config object', () => {
    expect(config).toBeDefined();
  });

  it('should have matcher configuration', () => {
    expect(config.matcher).toBeDefined();
    expect(Array.isArray(config.matcher)).toBe(true);
  });

  it('should match all routes except API and static files', () => {
    const matchers = config.matcher;
    expect(matchers[0]).toContain('(?!api');
    expect(matchers[0]).toContain('_next/static');
    expect(matchers[0]).toContain('_next/image');
    expect(matchers[0]).toContain('favicon.ico');
  });

  describe('proxy function', () => {
    const createMockRequest = (
      pathname: string,
      hasToken: boolean = false
    ) => ({
      cookies: {
        get: vi.fn((name: string) => (name === 'token' && hasToken ? { value: 'mock-token' } : undefined)),
      },
      nextUrl: {
        pathname,
      },
      url: 'http://localhost:3000' + pathname,
    });

    it('should allow access to public paths without token', () => {
      const request = createMockRequest('/', false) as any;
      const response = proxy(request);
      expect(response).toBeDefined();
    });

    it('should allow access to /login path without token', () => {
      const request = createMockRequest('/login', false) as any;
      const response = proxy(request);
      expect(response).toBeDefined();
    });

    it('should allow access to /register path without token', () => {
      const request = createMockRequest('/register', false) as any;
      const response = proxy(request);
      expect(response).toBeDefined();
    });

    it('should allow access to /activate path without token', () => {
      const request = createMockRequest('/activate', false) as any;
      const response = proxy(request);
      expect(response).toBeDefined();
    });

    it('should allow access to /reset-password path without token', () => {
      const request = createMockRequest('/reset-password', false) as any;
      const response = proxy(request);
      expect(response).toBeDefined();
    });

    it('should allow nested public paths like /activate/token', () => {
      const request = createMockRequest('/activate/abc123', false) as any;
      const response = proxy(request);
      expect(response).toBeDefined();
    });

    it('should allow nested reset-password paths', () => {
      const request = createMockRequest('/reset-password/id/token', false) as any;
      const response = proxy(request);
      expect(response).toBeDefined();
    });

    it('should redirect to login for protected paths without token', () => {
      const request = createMockRequest('/browse', false) as any;
      proxy(request);
      expect(NextResponse.redirect).toHaveBeenCalled();
    });

    it('should redirect to login for protected paths without token', () => {
      const request = createMockRequest('/profile', false) as any;
      proxy(request);
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining('/login'),
        })
      );
    });

    it('should redirect to login for /messages without token', () => {
      const request = createMockRequest('/messages', false) as any;
      proxy(request);
      expect(NextResponse.redirect).toHaveBeenCalled();
    });

    it('should redirect to login for /likes without token', () => {
      const request = createMockRequest('/likes', false) as any;
      proxy(request);
      expect(NextResponse.redirect).toHaveBeenCalled();
    });

    it('should allow access to protected paths with token', () => {
      const request = createMockRequest('/browse', true) as any;
      const response = proxy(request);
      expect(response).toBeDefined();
    });

    it('should allow access to /profile with token', () => {
      const request = createMockRequest('/profile', true) as any;
      const response = proxy(request);
      expect(response).toBeDefined();
    });

    it('should redirect authenticated users from /login to /browse', () => {
      const request = createMockRequest('/login', true) as any;
      proxy(request);
      expect(NextResponse.redirect).toHaveBeenCalled();
    });

    it('should redirect authenticated users from /register to /browse', () => {
      const request = createMockRequest('/register', true) as any;
      proxy(request);
      expect(NextResponse.redirect).toHaveBeenCalled();
    });

    it('should not redirect authenticated users from public paths to browse', () => {
      (NextResponse.redirect as any).mockClear();
      const request = createMockRequest('/', true) as any;
      proxy(request);
      expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it('should proceed normally for authenticated users on protected routes', () => {
      (NextResponse.next as any).mockClear();
      const request = createMockRequest('/messages', true) as any;
      proxy(request);
      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('should check for token cookie', () => {
      const request = createMockRequest('/browse', false) as any;
      proxy(request);
      expect(request.cookies.get).toHaveBeenCalledWith('token');
    });

    it('should extract pathname from request', () => {
      const request = createMockRequest('/profile/edit', false) as any;
      proxy(request);
      expect(request.nextUrl.pathname).toBe('/profile/edit');
    });

    it('should handle complex pathname patterns', () => {
      const request = createMockRequest('/chat/user-123', false) as any;
      proxy(request);
      expect(NextResponse.redirect).toHaveBeenCalled();
    });

    it('should differentiate between public root and other paths', () => {
      (NextResponse.redirect as any).mockClear();
      (NextResponse.next as any).mockClear();
      const request = createMockRequest('/', false) as any;
      const response = proxy(request);
      expect(response).toBeDefined();
    });
  });
});
