interface Neo4jInteger {
  low: number;
  high: number;
}

export interface Neo4jDate {
  year: Neo4jInteger | number;
  month: Neo4jInteger | number;
  day: Neo4jInteger | number;
}

export function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'object' && value !== null && 'low' in value) {
    return (value as Neo4jInteger).low;
  }

  return null;
}

export function toDisplayNumber(value: unknown, fallback = 'N/A'): string {
  const num = toNumber(value);
  return num !== null ? String(num) : fallback;
}

export function toGenderString(value: unknown): string {
  const num = toNumber(value);
  const genderMap: { [key: number]: string } = {
    0: 'Other',
    1: 'Male',
    2: 'Female',
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
    const year = typeof dateObj.year === 'number' ? dateObj.year : (dateObj.year as Neo4jInteger).low;
    const month = typeof dateObj.month === 'number' ? dateObj.month : (dateObj.month as Neo4jInteger).low;
    const day = typeof dateObj.day === 'number' ? dateObj.day : (dateObj.day as Neo4jInteger).low;

    if (year && month && day) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  return '';
}
