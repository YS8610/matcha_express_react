import type { TokenPayload, TokenValidationResult } from '@/types';

const TOKEN_KEY = 'token';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const TOKEN_CREATED_AT_KEY = 'tokenCreatedAt';
const REFRESH_TOKEN_KEY = 'refreshToken';
const COOKIE_MAX_AGE = 60 * 60 * 1000;

interface DecodedToken extends Record<string, unknown> {
  exp?: number;
  iat?: number;
  nbf?: number;
}

function decodeJWT(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1])) as DecodedToken;
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
    const now = Date.now();
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_CREATED_AT_KEY, now.toString());

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
    localStorage.removeItem(TOKEN_CREATED_AT_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
  } catch (error) {
    console.error('Failed to clear token:', error);
  }
}

export function checkAndClearOldCookies(): void {
  if (typeof window === 'undefined') return;

  try {
    const createdAtStr = localStorage.getItem(TOKEN_CREATED_AT_KEY);
    if (!createdAtStr) return;

    const createdAt = parseInt(createdAtStr, 10);
    const age = Date.now() - createdAt;

    if (age > COOKIE_MAX_AGE) {
      console.log('Cookie is older than 1 hour, clearing...');
      clearToken();
    }
  } catch (error) {
    console.error('Failed to check cookie age:', error);
  }
}

export function getTokenPayload(token?: string): Record<string, unknown> | null {
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

