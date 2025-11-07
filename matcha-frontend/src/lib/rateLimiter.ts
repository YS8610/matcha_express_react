interface RateLimitRule {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

interface RateLimitEntry {
  timestamps: number[];
  count: number;
  firstRequestTime?: number;
}

const defaultRateLimits = new Map<string, RateLimitRule>([
  ['auth:login', { maxRequests: 5, windowMs: 60000, message: 'Too many login attempts, please wait 1 minute' }],
  ['auth:register', { maxRequests: 3, windowMs: 300000, message: 'Too many registration attempts, please wait 5 minutes' }],
  ['auth:reset-password', { maxRequests: 3, windowMs: 300000, message: 'Too many password reset attempts' }],

  ['user:like', { maxRequests: 30, windowMs: 60000, message: 'You are liking too quickly' }],
  ['user:view', { maxRequests: 50, windowMs: 60000, message: 'You are viewing profiles too quickly' }],
  ['user:message', { maxRequests: 10, windowMs: 10000, message: 'You are sending messages too quickly' }],
  ['user:report', { maxRequests: 5, windowMs: 300000, message: 'Too many reports, please wait before reporting again' }],

  ['upload:photo', { maxRequests: 5, windowMs: 60000, message: 'Too many photo uploads, please wait' }],

  ['api:general', { maxRequests: 100, windowMs: 60000, message: 'Too many requests, please slow down' }],
]);

const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  endpoint: string,
  customRule?: RateLimitRule
): {
  allowed: boolean;
  remainingRequests: number;
  retryAfterMs: number;
  message?: string;
} {
  const now = Date.now();
  const rule = customRule || defaultRateLimits.get(endpoint) || defaultRateLimits.get('api:general')!;

  let entry = rateLimitStore.get(endpoint);
  if (!entry) {
    entry = { timestamps: [], count: 0, firstRequestTime: now };
    rateLimitStore.set(endpoint, entry);
  }

  entry.timestamps = entry.timestamps.filter((ts) => now - ts < rule.windowMs);

  const allowed = entry.timestamps.length < rule.maxRequests;

  if (allowed) {
    entry.timestamps.push(now);
    entry.count++;
  }

  const remainingRequests = Math.max(0, rule.maxRequests - entry.timestamps.length);

  let retryAfterMs = 0;
  if (entry.timestamps.length > 0) {
    const oldestRequest = entry.timestamps[0];
    retryAfterMs = Math.max(0, rule.windowMs - (now - oldestRequest));
  }

  return {
    allowed,
    remainingRequests,
    retryAfterMs,
    message: !allowed ? rule.message : undefined,
  };
}

export function resetRateLimit(endpoint: string): void {
  rateLimitStore.delete(endpoint);
}

export function resetAllRateLimits(): void {
  rateLimitStore.clear();
}

export function getRateLimitStatus(endpoint: string): {
  remaining: number;
  limit: number;
  resetIn: number;
} | null {
  const entry = rateLimitStore.get(endpoint);
  if (!entry) return null;

  const rule = defaultRateLimits.get(endpoint);
  if (!rule) return null;

  const now = Date.now();
  const validTimestamps = entry.timestamps.filter((ts) => now - ts < rule.windowMs);

  const oldestRequest = validTimestamps[0];
  const resetIn = oldestRequest ? Math.max(0, rule.windowMs - (now - oldestRequest)) : 0;

  return {
    remaining: Math.max(0, rule.maxRequests - validTimestamps.length),
    limit: rule.maxRequests,
    resetIn,
  };
}

export async function waitForRateLimit(endpoint: string): Promise<void> {
  return new Promise((resolve) => {
    const checkLimit = () => {
      const status = checkRateLimit(endpoint);
      if (status.allowed) {
        resolve();
      } else {
        setTimeout(checkLimit, Math.min(status.retryAfterMs, 1000));
      }
    };
    checkLimit();
  });
}

export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  endpoint: string,
  customRule?: RateLimitRule
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  return async (...args: Parameters<T>) => {
    const limit = checkRateLimit(endpoint, customRule);

    if (!limit.allowed) {
      throw new Error(limit.message || 'Rate limit exceeded, please try again later');
    }

    return fn(...args);
  };
}

export function setRateLimit(endpoint: string, rule: RateLimitRule): void {
  defaultRateLimits.set(endpoint, rule);
}

export function getAllRateLimitRules(): Map<string, RateLimitRule> {
  return new Map(defaultRateLimits);
}

export function isSuspiciousBehavior(endpoint: string): boolean {
  const entry = rateLimitStore.get(endpoint);
  if (!entry) return false;

  const rule = defaultRateLimits.get(endpoint);
  if (!rule) return false;

  return entry.timestamps.length >= rule.maxRequests * 0.9;
}

export function getRateLimitedEndpoints(): string[] {
  const now = Date.now();
  const limited = Array.from(rateLimitStore.entries())
    .filter(([endpoint, entry]) => {
      const rule = defaultRateLimits.get(endpoint);
      if (!rule) return false;
      const validTimestamps = entry.timestamps.filter((ts) => now - ts < rule.windowMs);
      return validTimestamps.length >= rule.maxRequests;
    })
    .map(([endpoint]) => endpoint);

  return limited;
}

export function debugRateLimits(): void {
  console.group('Rate Limit Status');
  defaultRateLimits.forEach((rule, endpoint) => {
    const status = getRateLimitStatus(endpoint);
    console.log(`${endpoint}:`, status || 'No requests yet', `- Rule: ${rule.maxRequests}/${rule.windowMs}ms`);
  });
  console.groupEnd();
}
