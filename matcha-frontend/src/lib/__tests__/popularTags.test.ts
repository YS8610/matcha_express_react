import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  POPULAR_TAGS,
  getTagSuggestions,
  getRandomPopularTags,
  TAG_CATEGORIES,
  getTagsByCategory,
  type TagCategory,
} from '../popularTags';

describe('popularTags', () => {
  describe('POPULAR_TAGS', () => {
    it('should contain expected popular tags', () => {
      expect(POPULAR_TAGS).toContain('travel');
      expect(POPULAR_TAGS).toContain('fitness');
      expect(POPULAR_TAGS).toContain('music');
      expect(POPULAR_TAGS).toContain('gaming');
    });

    it('should have all tags in lowercase', () => {
      POPULAR_TAGS.forEach(tag => {
        expect(tag).toBe(tag.toLowerCase());
      });
    });

    it('should have at least 50 tags', () => {
      expect(POPULAR_TAGS.length).toBeGreaterThanOrEqual(50);
    });

    it('should not have duplicate tags', () => {
      const uniqueTags = new Set(POPULAR_TAGS);
      expect(uniqueTags.size).toBe(POPULAR_TAGS.length);
    });
  });

  describe('getTagSuggestions', () => {
    it('should return matching tags for partial input', () => {
      const suggestions = getTagSuggestions('trav');
      expect(suggestions).toContain('travel');
    });

    it('should return empty array for empty input', () => {
      const suggestions = getTagSuggestions('');
      expect(suggestions).toEqual([]);
    });

    it('should return empty array for whitespace input', () => {
      const suggestions = getTagSuggestions('   ');
      expect(suggestions).toEqual([]);
    });

    it('should be case insensitive', () => {
      const lower = getTagSuggestions('music');
      const upper = getTagSuggestions('MUSIC');
      const mixed = getTagSuggestions('MuSiC');

      expect(lower).toEqual(upper);
      expect(lower).toEqual(mixed);
    });

    it('should exclude already selected tags', () => {
      const currentTags = ['travel'];
      const suggestions = getTagSuggestions('trav', currentTags);

      expect(suggestions).not.toContain('travel');
    });

    it('should limit results to 10 suggestions', () => {
      const suggestions = getTagSuggestions('a');
      expect(suggestions.length).toBeLessThanOrEqual(10);
    });

    it('should return tags that contain the input substring', () => {
      const suggestions = getTagSuggestions('ing');
      suggestions.forEach(tag => {
        expect(tag).toContain('ing');
      });
    });

    it('should handle multiple excluded tags', () => {
      const currentTags = ['music', 'movies', 'gaming'];
      const suggestions = getTagSuggestions('m', currentTags);

      currentTags.forEach(tag => {
        expect(suggestions).not.toContain(tag);
      });
    });

    it('should return empty array when no matches found', () => {
      const suggestions = getTagSuggestions('zzz');
      expect(suggestions).toEqual([]);
    });

    it('should trim whitespace from input', () => {
      const suggestions1 = getTagSuggestions('  music  ');
      const suggestions2 = getTagSuggestions('music');
      expect(suggestions1).toEqual(suggestions2);
    });
  });

  describe('getRandomPopularTags', () => {
    beforeEach(() => {
      vi.spyOn(Math, 'random');
    });

    it('should return default 15 tags when count not specified', () => {
      const tags = getRandomPopularTags();
      expect(tags).toHaveLength(15);
    });

    it('should return specified number of tags', () => {
      const tags = getRandomPopularTags(5);
      expect(tags).toHaveLength(5);
    });

    it('should not include already selected tags', () => {
      const currentTags = ['travel', 'music', 'gaming'];
      const randomTags = getRandomPopularTags(10, currentTags);

      currentTags.forEach(tag => {
        expect(randomTags).not.toContain(tag);
      });
    });

    it('should return tags from POPULAR_TAGS', () => {
      const tags = getRandomPopularTags(10);

      tags.forEach(tag => {
        expect(POPULAR_TAGS).toContain(tag as any);
      });
    });

    it('should handle requesting more tags than available', () => {
      const currentTags = [...POPULAR_TAGS].slice(0, -5);
      const tags = getRandomPopularTags(100, currentTags);

      expect(tags.length).toBeLessThanOrEqual(5);
    });

    it('should return empty array when all tags are excluded', () => {
      const tags = getRandomPopularTags(10, [...POPULAR_TAGS]);
      expect(tags).toEqual([]);
    });

    it('should not have duplicate tags in result', () => {
      const tags = getRandomPopularTags(20);
      const uniqueTags = new Set(tags);
      expect(uniqueTags.size).toBe(tags.length);
    });

    it('should randomize order', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.5);

      const tags1 = getRandomPopularTags(5);
      const tags2 = getRandomPopularTags(5);

      expect(tags1).not.toEqual(tags2);
    });
  });

  describe('TAG_CATEGORIES', () => {
    it('should have expected categories', () => {
      expect(TAG_CATEGORIES).toHaveProperty('lifestyle');
      expect(TAG_CATEGORIES).toHaveProperty('hobbies');
      expect(TAG_CATEGORIES).toHaveProperty('tech');
      expect(TAG_CATEGORIES).toHaveProperty('sports');
      expect(TAG_CATEGORIES).toHaveProperty('entertainment');
    });

    it('should have arrays of tags for each category', () => {
      Object.values(TAG_CATEGORIES).forEach(categoryTags => {
        expect(Array.isArray(categoryTags)).toBe(true);
        expect(categoryTags.length).toBeGreaterThan(0);
      });
    });

    it('should have all category tags in POPULAR_TAGS', () => {
      Object.values(TAG_CATEGORIES).forEach(categoryTags => {
        categoryTags.forEach(tag => {
          expect(POPULAR_TAGS).toContain(tag);
        });
      });
    });

    it('should have correct lifestyle tags', () => {
      expect(TAG_CATEGORIES.lifestyle).toContain('vegan');
      expect(TAG_CATEGORIES.lifestyle).toContain('yoga');
      expect(TAG_CATEGORIES.lifestyle).toContain('fitness');
    });

    it('should have correct tech tags', () => {
      expect(TAG_CATEGORIES.tech).toContain('gaming');
      expect(TAG_CATEGORIES.tech).toContain('technology');
      expect(TAG_CATEGORIES.tech).toContain('anime');
    });

    it('should have correct sports tags', () => {
      expect(TAG_CATEGORIES.sports).toContain('running');
      expect(TAG_CATEGORIES.sports).toContain('cycling');
      expect(TAG_CATEGORIES.sports).toContain('swimming');
    });
  });

  describe('getTagsByCategory', () => {
    it('should return tags for lifestyle category', () => {
      const tags = getTagsByCategory('lifestyle');
      expect(tags).toContain('vegan');
      expect(tags).toContain('yoga');
      expect(tags).toContain('fitness');
    });

    it('should return tags for tech category', () => {
      const tags = getTagsByCategory('tech');
      expect(tags).toContain('gaming');
      expect(tags).toContain('technology');
    });

    it('should return tags for sports category', () => {
      const tags = getTagsByCategory('sports');
      expect(tags).toContain('running');
      expect(tags).toContain('cycling');
    });

    it('should return tags for hobbies category', () => {
      const tags = getTagsByCategory('hobbies');
      expect(tags).toContain('photography');
      expect(tags).toContain('cooking');
    });

    it('should return tags for entertainment category', () => {
      const tags = getTagsByCategory('entertainment');
      expect(tags).toContain('movies');
      expect(tags).toContain('netflix');
    });

    it('should return a new array (not reference)', () => {
      const tags1 = getTagsByCategory('lifestyle');
      const tags2 = getTagsByCategory('lifestyle');

      expect(tags1).toEqual(tags2);
      expect(tags1).not.toBe(tags2);

      tags1.push('newTag');
      expect(tags2).not.toContain('newTag');
    });

    it('should work for all valid categories', () => {
      const categories: TagCategory[] = [
        'lifestyle', 'hobbies', 'tech', 'sports', 'style',
        'entertainment', 'food', 'pets', 'social',
        'musicInstruments', 'outdoor', 'learning'
      ];

      categories.forEach(category => {
        const tags = getTagsByCategory(category);
        expect(Array.isArray(tags)).toBe(true);
        expect(tags.length).toBeGreaterThan(0);
      });
    });

    it('should return arrays with expected lengths', () => {
      expect(getTagsByCategory('tech').length).toBeGreaterThan(0);
      expect(getTagsByCategory('hobbies').length).toBeGreaterThan(5);
      expect(getTagsByCategory('lifestyle').length).toBeGreaterThan(5);
    });
  });
});
