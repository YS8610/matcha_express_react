import type { Neo4jDate } from '@/types';

export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return value;
  }

  return null;
}

export function toGenderString(value: unknown): string {
  const num = toNumber(value);
  const genderMap: { [key: number]: string } = {
    1: 'Male',
    2: 'Female',
    3: 'Other',
  };
  return num !== null ? (genderMap[num] || 'Not set') : 'Not set';
}

export function toSexualPreferenceString(value: unknown): string {
  const num = toNumber(value);
  const prefMap: { [key: number]: string } = {
    1: 'Male',
    2: 'Female',
    3: 'Both',
  };
  return num !== null ? (prefMap[num] || 'Not set') : 'Not set';
}

export function toDateString(value: unknown): string {
  if (!value) return '';

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && value !== null) {
    const dateObj = value as Neo4jDate;
    const { year, month, day } = dateObj;

    if (year && month && day) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  return '';
}

export function getLastSeenString(timestamp: unknown): string {
  const ts = toNumber(timestamp);

  if (!ts) return 'Never';

  const now = Date.now();
  const diffMs = now - ts;

  if (diffMs < 0) return 'Now';

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
}
