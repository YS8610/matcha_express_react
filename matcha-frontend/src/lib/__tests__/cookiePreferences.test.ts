import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  setThemePreference,
  getThemePreference,
  setBrowseSortPreference,
  getBrowseSortPreference,
  setBrowseItemsPerPagePreference,
  getBrowseItemsPerPagePreference,
  setLanguagePreference,
  getLanguagePreference,
  setNotificationPreferences,
  getNotificationPreferences,
  addSearchToHistory,
  getSearchHistory,
  clearSearchHistory,
  setFilterPreferences,
  getFilterPreferences,
  clearFilterPreferences,
  setLastViewedProfile,
  getLastViewedProfile,
  setSidebarCollapsed,
  getSidebarCollapsed,
  setChatPreferences,
  getChatPreferences,
  clearAllPreferences,
} from '../cookiePreferences';

describe('Cookie Preferences', () => {
  beforeEach(() => {
    // Clear all cookies before each test
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    });
  });

  describe('Theme Preferences', () => {
    it('should set and get theme preference', () => {
      setThemePreference('dark');
      expect(getThemePreference()).toBe('dark');

      setThemePreference('light');
      expect(getThemePreference()).toBe('light');
    });

    it('should return null for missing theme preference', () => {
      expect(getThemePreference()).toBeNull();
    });
  });

  describe('Browse Sort Preferences', () => {
    it('should set and get browse sort preference', () => {
      setBrowseSortPreference('distance-asc');
      expect(getBrowseSortPreference()).toBe('distance-asc');

      setBrowseSortPreference('fame-desc');
      expect(getBrowseSortPreference()).toBe('fame-desc');
    });

    it('should return null for missing browse sort preference', () => {
      expect(getBrowseSortPreference()).toBeNull();
    });
  });

  describe('Browse Items Per Page Preferences', () => {
    it('should set and get items per page preference', () => {
      setBrowseItemsPerPagePreference(12);
      expect(getBrowseItemsPerPagePreference()).toBe(12);

      setBrowseItemsPerPagePreference(30);
      expect(getBrowseItemsPerPagePreference()).toBe(30);
    });

    it('should return null for missing items per page preference', () => {
      expect(getBrowseItemsPerPagePreference()).toBeNull();
    });

    it('should handle invalid values', () => {
      document.cookie = 'browseItemsPerPage=invalid; path=/';
      expect(getBrowseItemsPerPagePreference()).toBeNull();
    });
  });

  describe('Language Preferences', () => {
    it('should set and get language preference', () => {
      setLanguagePreference('en');
      expect(getLanguagePreference()).toBe('en');

      setLanguagePreference('fr');
      expect(getLanguagePreference()).toBe('fr');
    });

    it('should return null for missing language preference', () => {
      expect(getLanguagePreference()).toBeNull();
    });
  });

  describe('Notification Preferences', () => {
    it('should set and get notification preferences', () => {
      const prefs = {
        emailNotifications: true,
        pushNotifications: false,
        soundEnabled: true,
      };

      setNotificationPreferences(prefs);
      expect(getNotificationPreferences()).toEqual(prefs);
    });

    it('should return null for missing notification preferences', () => {
      expect(getNotificationPreferences()).toBeNull();
    });

    it('should handle partial preferences', () => {
      const prefs = { emailNotifications: true };
      setNotificationPreferences(prefs);
      expect(getNotificationPreferences()).toEqual(prefs);
    });
  });

  describe('Search History', () => {
    it('should add search terms to history', () => {
      addSearchToHistory('test1');
      expect(getSearchHistory()).toEqual(['test1']);

      addSearchToHistory('test2');
      expect(getSearchHistory()).toEqual(['test2', 'test1']);
    });

    it('should limit history to 5 items', () => {
      addSearchToHistory('test1');
      addSearchToHistory('test2');
      addSearchToHistory('test3');
      addSearchToHistory('test4');
      addSearchToHistory('test5');
      addSearchToHistory('test6');

      const history = getSearchHistory();
      expect(history).toHaveLength(5);
      expect(history).toEqual(['test6', 'test5', 'test4', 'test3', 'test2']);
    });

    it('should not duplicate search terms', () => {
      addSearchToHistory('test1');
      addSearchToHistory('test2');
      addSearchToHistory('test1');

      expect(getSearchHistory()).toEqual(['test1', 'test2']);
    });

    it('should clear search history', () => {
      addSearchToHistory('test1');
      addSearchToHistory('test2');

      clearSearchHistory();
      expect(getSearchHistory()).toEqual([]);
    });
  });

  describe('Filter Preferences', () => {
    it('should set and get filter preferences', () => {
      const filters = {
        ageMin: 18,
        ageMax: 30,
        distanceMax: 50,
        fameMin: 10,
        fameMax: 100,
        interests: 'sports,music',
      };

      setFilterPreferences(filters);
      expect(getFilterPreferences()).toEqual(filters);
    });

    it('should handle partial filters', () => {
      const filters = { ageMin: 18 };
      setFilterPreferences(filters);
      expect(getFilterPreferences()).toEqual(filters);
    });

    it('should clear filter preferences', () => {
      setFilterPreferences({ ageMin: 18 });
      clearFilterPreferences();
      expect(getFilterPreferences()).toBeNull();
    });
  });

  describe('Last Viewed Profile', () => {
    it('should set and get last viewed profile', () => {
      setLastViewedProfile('user123');
      expect(getLastViewedProfile()).toBe('user123');
    });

    it('should return null for missing last viewed profile', () => {
      expect(getLastViewedProfile()).toBeNull();
    });
  });

  describe('Sidebar Collapsed State', () => {
    it('should set and get sidebar collapsed state', () => {
      setSidebarCollapsed(true);
      expect(getSidebarCollapsed()).toBe(true);

      setSidebarCollapsed(false);
      expect(getSidebarCollapsed()).toBe(false);
    });

    it('should return null for missing sidebar state', () => {
      expect(getSidebarCollapsed()).toBeNull();
    });
  });

  describe('Chat Preferences', () => {
    it('should set and get chat preferences', () => {
      const prefs = {
        soundEnabled: true,
        showTypingIndicator: false,
        enterToSend: true,
      };

      setChatPreferences(prefs);
      expect(getChatPreferences()).toEqual(prefs);
    });

    it('should return null for missing chat preferences', () => {
      expect(getChatPreferences()).toBeNull();
    });
  });

  describe('Clear All Preferences', () => {
    it('should clear all preference cookies', () => {
      setThemePreference('dark');
      setBrowseSortPreference('fame-desc');
      setBrowseItemsPerPagePreference(30);
      setLanguagePreference('en');
      addSearchToHistory('test');

      clearAllPreferences();

      expect(getThemePreference()).toBeNull();
      expect(getBrowseSortPreference()).toBeNull();
      expect(getBrowseItemsPerPagePreference()).toBeNull();
      expect(getLanguagePreference()).toBeNull();
      expect(getSearchHistory()).toEqual([]);
    });
  });
});
