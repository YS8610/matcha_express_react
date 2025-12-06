import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getCsrfToken, addCsrfToken, requiresCsrfToken } from '@/lib/csrf';

describe('CSRF Utilities', () => {
  let originalDocument: Document;

  beforeEach(() => {
    vi.clearAllMocks();
    originalDocument = global.document;
  });

  afterEach(() => {
    global.document = originalDocument;
  });

  describe('getCsrfToken', () => {
    it('should export getCsrfToken function', () => {
      expect(getCsrfToken).toBeDefined();
      expect(typeof getCsrfToken).toBe('function');
    });

    it('should return null when document is undefined (SSR)', () => {
      // @ts-ignore - Testing SSR scenario
      delete global.document;
      const token = getCsrfToken();
      expect(token).toBeNull();
    });

    it('should return token from meta tag when present', () => {
      const mockToken = 'test-csrf-token-123';
      const metaElement = document.createElement('meta');
      metaElement.setAttribute('name', 'csrf-token');
      metaElement.setAttribute('content', mockToken);
      document.head.appendChild(metaElement);

      const token = getCsrfToken();
      expect(token).toBe(mockToken);

      document.head.removeChild(metaElement);
    });

    it('should return null when meta tag exists but has no content', () => {
      const metaElement = document.createElement('meta');
      metaElement.setAttribute('name', 'csrf-token');
      document.head.appendChild(metaElement);

      const token = getCsrfToken();
      expect(token).toBeNull();

      document.head.removeChild(metaElement);
    });

    it('should return token from cookie when meta tag is not present', () => {
      const mockToken = 'cookie-csrf-token-456';
      document.cookie = `csrf-token=${mockToken}`;

      const token = getCsrfToken();
      expect(token).toBe(mockToken);

      // Clean up
      document.cookie = 'csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });

    it('should prioritize meta tag over cookie', () => {
      const metaToken = 'meta-token-789';
      const cookieToken = 'cookie-token-abc';

      const metaElement = document.createElement('meta');
      metaElement.setAttribute('name', 'csrf-token');
      metaElement.setAttribute('content', metaToken);
      document.head.appendChild(metaElement);

      document.cookie = `csrf-token=${cookieToken}`;

      const token = getCsrfToken();
      expect(token).toBe(metaToken);

      document.head.removeChild(metaElement);
      document.cookie = 'csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });

    it('should return null when neither meta tag nor cookie is present', () => {
      const token = getCsrfToken();
      expect(token).toBeNull();
    });

    it('should handle empty string in meta tag content', () => {
      const metaElement = document.createElement('meta');
      metaElement.setAttribute('name', 'csrf-token');
      metaElement.setAttribute('content', '');
      document.head.appendChild(metaElement);

      const token = getCsrfToken();
      expect(token).toBeNull();

      document.head.removeChild(metaElement);
    });

    it('should handle multiple cookies and extract csrf-token correctly', () => {
      const mockToken = 'multi-cookie-token';
      document.cookie = 'other-cookie=value1';
      document.cookie = `csrf-token=${mockToken}`;
      document.cookie = 'another-cookie=value2';

      const token = getCsrfToken();
      expect(token).toBe(mockToken);

      // Clean up
      document.cookie = 'csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = 'other-cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = 'another-cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });
  });

  describe('addCsrfToken', () => {
    it('should export addCsrfToken function', () => {
      expect(addCsrfToken).toBeDefined();
      expect(typeof addCsrfToken).toBe('function');
    });

    it('should add CSRF token to headers when token is available', () => {
      const mockToken = 'header-test-token';
      const metaElement = document.createElement('meta');
      metaElement.setAttribute('name', 'csrf-token');
      metaElement.setAttribute('content', mockToken);
      document.head.appendChild(metaElement);

      const headers = { 'Content-Type': 'application/json' };
      const result = addCsrfToken(headers);

      expect(result).toEqual({
        'Content-Type': 'application/json',
        'X-CSRF-Token': mockToken,
      });

      document.head.removeChild(metaElement);
    });

    it('should not modify headers when token is not available', () => {
      const headers = { 'Content-Type': 'application/json' };
      const result = addCsrfToken(headers);

      expect(result).toEqual({
        'Content-Type': 'application/json',
      });
    });

    it('should handle empty headers object', () => {
      const mockToken = 'empty-headers-token';
      const metaElement = document.createElement('meta');
      metaElement.setAttribute('name', 'csrf-token');
      metaElement.setAttribute('content', mockToken);
      document.head.appendChild(metaElement);

      const headers = {};
      const result = addCsrfToken(headers);

      expect(result).toEqual({
        'X-CSRF-Token': mockToken,
      });

      document.head.removeChild(metaElement);
    });

    it('should not mutate the original headers object', () => {
      const mockToken = 'immutable-test-token';
      const metaElement = document.createElement('meta');
      metaElement.setAttribute('name', 'csrf-token');
      metaElement.setAttribute('content', mockToken);
      document.head.appendChild(metaElement);

      const headers = { 'Content-Type': 'application/json' };
      const result = addCsrfToken(headers);

      expect(headers).toEqual({ 'Content-Type': 'application/json' });
      expect(result).not.toBe(headers);
      expect(result).toHaveProperty('X-CSRF-Token');

      document.head.removeChild(metaElement);
    });

    it('should override existing X-CSRF-Token header', () => {
      const newToken = 'new-csrf-token';
      const metaElement = document.createElement('meta');
      metaElement.setAttribute('name', 'csrf-token');
      metaElement.setAttribute('content', newToken);
      document.head.appendChild(metaElement);

      const headers = {
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'old-token',
      };
      const result = addCsrfToken(headers);

      expect(result['X-CSRF-Token']).toBe(newToken);

      document.head.removeChild(metaElement);
    });
  });

  describe('requiresCsrfToken', () => {
    it('should export requiresCsrfToken function', () => {
      expect(requiresCsrfToken).toBeDefined();
      expect(typeof requiresCsrfToken).toBe('function');
    });

    it('should return true for POST method', () => {
      expect(requiresCsrfToken('POST')).toBe(true);
    });

    it('should return true for PUT method', () => {
      expect(requiresCsrfToken('PUT')).toBe(true);
    });

    it('should return true for DELETE method', () => {
      expect(requiresCsrfToken('DELETE')).toBe(true);
    });

    it('should return true for PATCH method', () => {
      expect(requiresCsrfToken('PATCH')).toBe(true);
    });

    it('should return false for GET method', () => {
      expect(requiresCsrfToken('GET')).toBe(false);
    });

    it('should return false for HEAD method', () => {
      expect(requiresCsrfToken('HEAD')).toBe(false);
    });

    it('should return false for OPTIONS method', () => {
      expect(requiresCsrfToken('OPTIONS')).toBe(false);
    });

    it('should handle lowercase method names', () => {
      expect(requiresCsrfToken('post')).toBe(true);
      expect(requiresCsrfToken('get')).toBe(false);
      expect(requiresCsrfToken('put')).toBe(true);
      expect(requiresCsrfToken('delete')).toBe(true);
    });

    it('should handle mixed case method names', () => {
      expect(requiresCsrfToken('PoSt')).toBe(true);
      expect(requiresCsrfToken('GeT')).toBe(false);
      expect(requiresCsrfToken('DeLeTe')).toBe(true);
    });

    it('should default to GET when no method is provided', () => {
      expect(requiresCsrfToken()).toBe(false);
    });

    it('should return false for unknown methods', () => {
      expect(requiresCsrfToken('UNKNOWN')).toBe(false);
      expect(requiresCsrfToken('CUSTOM')).toBe(false);
    });

    it('should handle empty string as method', () => {
      expect(requiresCsrfToken('')).toBe(false);
    });
  });

  describe('Integration tests', () => {
    it('should work together: getCsrfToken and addCsrfToken', () => {
      const mockToken = 'integration-token';
      const metaElement = document.createElement('meta');
      metaElement.setAttribute('name', 'csrf-token');
      metaElement.setAttribute('content', mockToken);
      document.head.appendChild(metaElement);

      const token = getCsrfToken();
      expect(token).toBe(mockToken);

      const headers = addCsrfToken({});
      expect(headers['X-CSRF-Token']).toBe(mockToken);

      document.head.removeChild(metaElement);
    });

    it('should handle workflow: check if CSRF required and add token', () => {
      const mockToken = 'workflow-token';
      const metaElement = document.createElement('meta');
      metaElement.setAttribute('name', 'csrf-token');
      metaElement.setAttribute('content', mockToken);
      document.head.appendChild(metaElement);

      const method = 'POST';
      let headers = { 'Content-Type': 'application/json' };

      if (requiresCsrfToken(method)) {
        headers = addCsrfToken(headers);
      }

      expect(headers).toHaveProperty('X-CSRF-Token', mockToken);

      document.head.removeChild(metaElement);
    });

    it('should not add CSRF token for GET requests in workflow', () => {
      const mockToken = 'get-workflow-token';
      const metaElement = document.createElement('meta');
      metaElement.setAttribute('name', 'csrf-token');
      metaElement.setAttribute('content', mockToken);
      document.head.appendChild(metaElement);

      const method = 'GET';
      let headers = { 'Content-Type': 'application/json' };

      if (requiresCsrfToken(method)) {
        headers = addCsrfToken(headers);
      }

      expect(headers).not.toHaveProperty('X-CSRF-Token');

      document.head.removeChild(metaElement);
    });
  });
});
