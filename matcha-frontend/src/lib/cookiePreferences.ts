const PREFERENCE_EXPIRY_DAYS = 365;

interface CookieOptions {
  expiryDays?: number;
  sameSite?: 'Strict' | 'Lax' | 'None';
  secure?: boolean;
}

function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof window === 'undefined') return;

  const {
    expiryDays = PREFERENCE_EXPIRY_DAYS,
    sameSite = 'Lax',
    secure = location.protocol === 'https:'
  } = options;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiryDays);

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  cookieString += `; expires=${expiryDate.toUTCString()}`;
  cookieString += `; path=/`;
  cookieString += `; SameSite=${sameSite}`;

  if (secure) {
    cookieString += '; Secure';
  }

  document.cookie = cookieString;
}

function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (decodeURIComponent(cookieName) === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

function deleteCookie(name: string): void {
  if (typeof window === 'undefined') return;

  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

export function setThemePreference(theme: 'light' | 'dark'): void {
  setCookie('theme', theme);
}

export function getThemePreference(): 'light' | 'dark' | null {
  const theme = getCookie('theme');
  if (theme === 'light' || theme === 'dark') {
    return theme;
  }
  return null;
}

export function setBrowseSortPreference(sortBy: string): void {
  setCookie('browseSortBy', sortBy);
}

export function getBrowseSortPreference(): string | null {
  return getCookie('browseSortBy');
}

export function setBrowseItemsPerPagePreference(itemsPerPage: number): void {
  setCookie('browseItemsPerPage', itemsPerPage.toString());
}

export function getBrowseItemsPerPagePreference(): number | null {
  const value = getCookie('browseItemsPerPage');
  if (value) {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return null;
}

export function setLanguagePreference(language: string): void {
  setCookie('language', language);
}

export function getLanguagePreference(): string | null {
  return getCookie('language');
}

export interface NotificationPreferences {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  soundEnabled?: boolean;
}

export function setNotificationPreferences(preferences: NotificationPreferences): void {
  setCookie('notificationPreferences', JSON.stringify(preferences));
}

export function getNotificationPreferences(): NotificationPreferences | null {
  const value = getCookie('notificationPreferences');
  if (value) {
    try {
      return JSON.parse(value) as NotificationPreferences;
    } catch {
      return null;
    }
  }
  return null;
}

export function addSearchToHistory(searchTerm: string): void {
  const history = getSearchHistory();
  const updated = [searchTerm, ...history.filter(term => term !== searchTerm)].slice(0, 5);
  setCookie('searchHistory', JSON.stringify(updated));
}

export function getSearchHistory(): string[] {
  const value = getCookie('searchHistory');
  if (value) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function clearSearchHistory(): void {
  deleteCookie('searchHistory');
}

export interface FilterPreferences {
  ageMin?: number;
  ageMax?: number;
  distanceMax?: number;
  fameMin?: number;
  fameMax?: number;
  interests?: string;
}

export function setFilterPreferences(filters: FilterPreferences): void {
  setCookie('filterPreferences', JSON.stringify(filters));
}

export function getFilterPreferences(): FilterPreferences | null {
  const value = getCookie('filterPreferences');
  if (value) {
    try {
      return JSON.parse(value) as FilterPreferences;
    } catch {
      return null;
    }
  }
  return null;
}

export function clearFilterPreferences(): void {
  deleteCookie('filterPreferences');
}

export function setLastViewedProfile(profileId: string): void {
  setCookie('lastViewedProfile', profileId, { expiryDays: 7 });
}

export function getLastViewedProfile(): string | null {
  return getCookie('lastViewedProfile');
}

export function setSidebarCollapsed(collapsed: boolean): void {
  setCookie('sidebarCollapsed', collapsed.toString());
}

export function getSidebarCollapsed(): boolean | null {
  const value = getCookie('sidebarCollapsed');
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

export interface ChatPreferences {
  soundEnabled?: boolean;
  showTypingIndicator?: boolean;
  enterToSend?: boolean;
}

export function setChatPreferences(preferences: ChatPreferences): void {
  setCookie('chatPreferences', JSON.stringify(preferences));
}

export function getChatPreferences(): ChatPreferences | null {
  const value = getCookie('chatPreferences');
  if (value) {
    try {
      return JSON.parse(value) as ChatPreferences;
    } catch {
      return null;
    }
  }
  return null;
}

export function clearAllPreferences(): void {
  deleteCookie('theme');
  deleteCookie('browseSortBy');
  deleteCookie('browseItemsPerPage');
  deleteCookie('language');
  deleteCookie('notificationPreferences');
  deleteCookie('searchHistory');
  deleteCookie('filterPreferences');
  deleteCookie('lastViewedProfile');
  deleteCookie('sidebarCollapsed');
  deleteCookie('chatPreferences');
}
