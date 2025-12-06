import type { TokenPayload, TokenValidationResult } from '@/types';

const TOKEN_KEY = 'token';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const TOKEN_CREATED_AT_KEY = 'tokenCreatedAt';
const REFRESH_TOKEN_KEY = 'refreshToken';
const COOKIE_MAX_AGE = 2 * 60 * 60 * 1000;

interface DecodedToken extends Record<string, unknown> {
  exp?: number;
  iat?: number;
  nbf?: number;
}

function setCookie(name: string, value: string, options: { expiryDate?: Date; sameSite?: string; secure?: boolean } = {}): void {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    console.error('Cookie name cannot be empty');
    return;
  }

  if (!value || typeof value !== 'string') {
    console.error(`Cookie value cannot be empty for ${name}`);
    return;
  }

  try {
    const { expiryDate, sameSite = 'Strict', secure = location.protocol === 'https:' } = options;

    let cookieString = `${name}=${value}`;

    if (expiryDate && expiryDate instanceof Date && !isNaN(expiryDate.getTime())) {
      cookieString += `; expires=${expiryDate.toUTCString()}`;
    }

    cookieString += `; path=/; SameSite=${sameSite}`;

    if (secure) {
      cookieString += '; Secure';
    }

    document.cookie = cookieString;
  } catch (error) {
    console.error(`Failed to set cookie ${name}:`, error);
  }
}

function clearCookie(name: string): void {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return;
  }

  try {
    const expiryDate = new Date(0);
    let cookieString = `${name}=; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    document.cookie = cookieString;
  } catch (error) {
    console.error(`Failed to clear cookie ${name}:`, error);
  }
}

function decodeJWT(token: string): DecodedToken | null {
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1])) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  if (!token || typeof token !== 'string') return true;

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const expiry = decoded.exp * 1000;
  const buffer = 5 * 60 * 1000;
  return Date.now() + buffer > expiry;
}

export function storeToken(token: string): boolean {
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return false;
  }

  if (token.split('.').length !== 3) {
    return false;
  }

  if (isTokenExpired(token)) {
    return false;
  }

  try {
    if (typeof window === 'undefined') {
      return false;
    }

    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp || typeof decoded.exp !== 'number') {
      return false;
    }

    const expiryDate = new Date(decoded.exp * 1000);

    if (isNaN(expiryDate.getTime())) {
      return false;
    }

    setCookie(TOKEN_KEY, token, { expiryDate, sameSite: 'Strict', secure: location.protocol === 'https:' });
    setCookie(TOKEN_EXPIRY_KEY, decoded.exp.toString(), { expiryDate, sameSite: 'Strict', secure: location.protocol === 'https:' });
    setCookie(TOKEN_CREATED_AT_KEY, Date.now().toString(), { expiryDate, sameSite: 'Strict', secure: location.protocol === 'https:' });

    return true;
  } catch (error) {
    console.error('Failed to store token:', error);
    return false;
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === TOKEN_KEY && value) {
        if (isTokenExpired(value)) {
          clearToken();
          return null;
        }
        return value;
      }
    }
    return null;
  } catch (error) {
    console.warn('Failed to retrieve token:', error);
    return null;
  }
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;

  try {
    clearCookie(TOKEN_KEY);
    clearCookie(TOKEN_EXPIRY_KEY);
    clearCookie(TOKEN_CREATED_AT_KEY);
    clearCookie(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.warn('Failed to clear token:', error);
  }
}

export function checkAndClearOldCookies(): void {
  if (typeof window === 'undefined') return;
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

