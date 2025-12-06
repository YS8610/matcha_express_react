const CSRF_HEADER_NAME = 'X-CSRF-Token';
const CSRF_COOKIE_NAME = 'csrf-token';

export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;

  const metaTag = document.querySelector(`meta[name="csrf-token"]`);
  if (metaTag) {
    const token = metaTag.getAttribute('content');
    if (token) return token;
  }

  const token = getCookie(CSRF_COOKIE_NAME);
  if (token) return token;

  return null;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
}

export function addCsrfToken(headers: Record<string, string>): Record<string, string> {
  const token = getCsrfToken();
  if (token) {
    return {
      ...headers,
      [CSRF_HEADER_NAME]: token,
    };
  }
  return headers;
}

export function requiresCsrfToken(method: string = 'GET'): boolean {
  const stateChangingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  return stateChangingMethods.includes(method.toUpperCase());
}
