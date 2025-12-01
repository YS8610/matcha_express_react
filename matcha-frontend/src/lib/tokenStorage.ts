import type { TokenPayload, TokenValidationResult } from '@/types';

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

function isTokenExpired(token: string): boolean {
  if (!token) return true;

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const expiry = decoded.exp * 1000;
  const buffer = 5 * 60 * 1000;
  return Date.now() + buffer > expiry;
}

export function storeToken(token: string): boolean {
  if (!token || typeof token !== 'string' || token.split('.').length !== 3 || isTokenExpired(token)) {
    console.warn('Attempted to store invalid token');
    return false;
  }

  try {
    localStorage.setItem(TOKEN_KEY, token);

    const decoded = decodeJWT(token);
    const expiry = decoded && decoded.exp ? decoded.exp * 1000 : null;
    if (expiry) {
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
    }

    const cookieExpiry = new Date(expiry || Date.now() + 7 * 24 * 60 * 60 * 1000);
    document.cookie = `${TOKEN_KEY}=${token}; path=/; expires=${cookieExpiry.toUTCString()}; SameSite=Lax`;

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

    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
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

export function validateTokenStructure(token: string): TokenValidationResult {
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

