import type { RateLimitRule, RateLimitEntry, RateLimitStatus } from '@/types';

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
): RateLimitStatus {
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

export function resetAllRateLimits(): void {
  rateLimitStore.clear();
}

export function setRateLimit(endpoint: string, rule: RateLimitRule): void {
  defaultRateLimits.set(endpoint, rule);
}

