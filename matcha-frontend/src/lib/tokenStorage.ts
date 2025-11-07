const TOKEN_KEY = 'token';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const REFRESH_TOKEN_KEY = 'refreshToken';

function decodeJWT(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.warn('Failed to decode JWT:', error);
    return null;
  }
}

export function getTokenExpiry(token: string): number | null {
  if (!token) return null;

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return null;

  return decoded.exp * 1000;
}

export function isTokenExpired(token: string): boolean {
  if (!token) return true;

  const expiry = getTokenExpiry(token);
  if (!expiry) return true;

  const buffer = 5 * 60 * 1000;
  return Date.now() + buffer > expiry;
}

export function isTokenValid(token: string): boolean {
  if (!token || typeof token !== 'string') return false;

  if (token.split('.').length !== 3) return false;

  return !isTokenExpired(token);
}

export function storeToken(token: string): boolean {
  if (!isTokenValid(token)) {
    console.warn('Attempted to store invalid token');
    return false;
  }

  try {
    localStorage.setItem(TOKEN_KEY, token);

    const expiry = getTokenExpiry(token);
    if (expiry) {
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
    }

    const cookieExpiry = new Date(expiry || Date.now() + 7 * 24 * 60 * 60 * 1000);
    document.cookie = `${TOKEN_KEY}=${token}; path=/; expires=${cookieExpiry.toUTCString()}; SameSite=Strict`;

    return true;
  } catch (error) {
    console.error('Failed to store token:', error);
    return false;
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) return null;

    if (isTokenExpired(token)) {
      clearToken();
      return null;
    }

    return token;
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    return null;
  }
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict`;
  } catch (error) {
    console.error('Failed to clear token:', error);
  }
}

export function getTokenPayload(token?: string): Record<string, any> | null {
  const tokenToUse = token || getToken();
  if (!tokenToUse) return null;

  const decoded = decodeJWT(tokenToUse);
  if (!decoded) return null;

  const { iat, exp, nbf, ...payload } = decoded;

  return payload;
}

export function validateTokenStructure(token: string): {
  valid: boolean;
  reason?: string;
} {
  if (!token) {
    return { valid: false, reason: 'Token is empty' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, reason: 'Invalid token format' };
  }

  try {
    const header = JSON.parse(atob(parts[0]));
    if (!header.alg || !header.typ) {
      return { valid: false, reason: 'Invalid token header' };
    }
  } catch {
    return { valid: false, reason: 'Invalid token header encoding' };
  }

  try {
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) {
      return { valid: false, reason: 'Token missing expiry' };
    }
  } catch {
    return { valid: false, reason: 'Invalid token payload encoding' };
  }

  return { valid: true };
}

export function hasTokenBeenTampered(token: string): boolean {
  if (!token) return false;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    atob(parts[0]);
    atob(parts[1]);

    return false;
  } catch {
    return true;
  }
}

export function getTimeUntilExpiry(token?: string): number | null {
  const tokenToUse = token || getToken();
  if (!tokenToUse) return null;

  const expiry = getTokenExpiry(tokenToUse);
  if (!expiry) return null;

  const secondsUntilExpiry = Math.floor((expiry - Date.now()) / 1000);
  return secondsUntilExpiry > 0 ? secondsUntilExpiry : 0;
}

export function shouldRefreshToken(token?: string): boolean {
  const timeUntil = getTimeUntilExpiry(token);
  if (timeUntil === null) return true;

  return timeUntil < 5 * 60;
}

export function getTokenDebugInfo(): Record<string, any> {
  const token = getToken();
  if (!token) return { token: 'Not set' };

  return {
    tokenExists: !!token,
    isValid: isTokenValid(token),
    isExpired: isTokenExpired(token),
    timeUntilExpiry: `${getTimeUntilExpiry(token)} seconds`,
    shouldRefresh: shouldRefreshToken(token),
    payload: getTokenPayload(token),
  };
}
