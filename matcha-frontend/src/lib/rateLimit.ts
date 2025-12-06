interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const DEFAULT_MAX_ATTEMPTS = 5;
const DEFAULT_WINDOW_MS = 15 * 60 * 1000;

export function isRateLimited(
  key: string,
  maxAttempts: number = DEFAULT_MAX_ATTEMPTS,
  windowMs: number = DEFAULT_WINDOW_MS
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  if (entry.count >= maxAttempts) {
    return true;
  }

  entry.count++;
  return false;
}

export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}

export function getRemainingAttempts(
  key: string,
  maxAttempts: number = DEFAULT_MAX_ATTEMPTS
): number {
  const entry = rateLimitMap.get(key);
  if (!entry || Date.now() > entry.resetTime) {
    return maxAttempts;
  }
  return Math.max(0, maxAttempts - entry.count);
}

export function getResetTime(key: string): number | null {
  const entry = rateLimitMap.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now > entry.resetTime) {
    return null;
  }

  return entry.resetTime - now;
}
