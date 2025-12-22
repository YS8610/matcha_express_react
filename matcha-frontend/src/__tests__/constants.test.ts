import { describe, it, expect } from 'vitest';
import {
  FAME_RATING_MIN,
  FAME_RATING_MAX,
  DEFAULT_FAME_RATING,
  FAME_INCREMENT_LIKE,
  FAME_DECREMENT_UNLIKE,
  FAME_DECREMENT_BLOCK,
  FAME_INCREMENT_UNBLOCK,
  USER_MAX_TAGS,
  USER_MAX_PHOTOS,
  GENDER_MALE,
  GENDER_FEMALE,
  GENDER_OTHER,
  SEXUAL_PREFERENCE_MALE,
  SEXUAL_PREFERENCE_FEMALE,
  SEXUAL_PREFERENCE_BISEXUAL,
  NOTIFICATION_TYPE,
  MIN_AGE,
  MAX_AGE,
  DEFAULT_GENDER,
  DEFAULT_BIOGRAPHY,
} from '../constants';

describe('constants', () => {
  describe('Fame Rating Constants', () => {
    it('should have valid fame rating range', () => {
      expect(FAME_RATING_MIN).toBe(0);
      expect(FAME_RATING_MAX).toBe(10000);
      expect(FAME_RATING_MIN).toBeLessThan(FAME_RATING_MAX);
    });

    it('should have default fame rating within valid range', () => {
      expect(DEFAULT_FAME_RATING).toBeGreaterThanOrEqual(FAME_RATING_MIN);
      expect(DEFAULT_FAME_RATING).toBeLessThanOrEqual(FAME_RATING_MAX);
      expect(DEFAULT_FAME_RATING).toBe(50);
    });

    it('should have positive fame increment for likes', () => {
      expect(FAME_INCREMENT_LIKE).toBeGreaterThan(0);
      expect(FAME_INCREMENT_LIKE).toBe(10);
    });

    it('should have negative fame decrement for unlikes', () => {
      expect(FAME_DECREMENT_UNLIKE).toBeLessThan(0);
      expect(FAME_DECREMENT_UNLIKE).toBe(-10);
    });

    it('should have negative fame decrement for blocks', () => {
      expect(FAME_DECREMENT_BLOCK).toBeLessThan(0);
      expect(FAME_DECREMENT_BLOCK).toBe(-5);
    });

    it('should have positive fame increment for unblocks', () => {
      expect(FAME_INCREMENT_UNBLOCK).toBeGreaterThan(0);
      expect(FAME_INCREMENT_UNBLOCK).toBe(5);
    });

    it('should have symmetric like/unlike values', () => {
      expect(FAME_INCREMENT_LIKE).toBe(-FAME_DECREMENT_UNLIKE);
    });

    it('should have symmetric block/unblock values', () => {
      expect(FAME_INCREMENT_UNBLOCK).toBe(-FAME_DECREMENT_BLOCK);
    });
  });

  describe('User Limit Constants', () => {
    it('should have reasonable max tags limit', () => {
      expect(USER_MAX_TAGS).toBeGreaterThan(0);
      expect(USER_MAX_TAGS).toBe(10);
    });

    it('should have reasonable max photos limit', () => {
      expect(USER_MAX_PHOTOS).toBeGreaterThan(0);
      expect(USER_MAX_PHOTOS).toBe(5);
    });
  });

  describe('Gender Constants', () => {
    it('should have three distinct gender values', () => {
      expect(GENDER_MALE).toBe(1);
      expect(GENDER_FEMALE).toBe(2);
      expect(GENDER_OTHER).toBe(0);
    });

    it('should have unique gender values', () => {
      const genders = [GENDER_MALE, GENDER_FEMALE, GENDER_OTHER];
      const uniqueGenders = new Set(genders);
      expect(uniqueGenders.size).toBe(3);
    });

    it('should have non-negative gender values', () => {
      expect(GENDER_MALE).toBeGreaterThanOrEqual(0);
      expect(GENDER_FEMALE).toBeGreaterThanOrEqual(0);
      expect(GENDER_OTHER).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Sexual Preference Constants', () => {
    it('should have three distinct sexual preference values', () => {
      expect(SEXUAL_PREFERENCE_MALE).toBe(1);
      expect(SEXUAL_PREFERENCE_FEMALE).toBe(2);
      expect(SEXUAL_PREFERENCE_BISEXUAL).toBe(3);
    });

    it('should have unique sexual preference values', () => {
      const preferences = [
        SEXUAL_PREFERENCE_MALE,
        SEXUAL_PREFERENCE_FEMALE,
        SEXUAL_PREFERENCE_BISEXUAL,
      ];
      const uniquePreferences = new Set(preferences);
      expect(uniquePreferences.size).toBe(3);
    });

    it('should have positive sexual preference values', () => {
      expect(SEXUAL_PREFERENCE_MALE).toBeGreaterThan(0);
      expect(SEXUAL_PREFERENCE_FEMALE).toBeGreaterThan(0);
      expect(SEXUAL_PREFERENCE_BISEXUAL).toBeGreaterThan(0);
    });
  });

  describe('Notification Type Enum', () => {
    it('should have all expected notification types', () => {
      expect(NOTIFICATION_TYPE.VIEW).toBe('view');
      expect(NOTIFICATION_TYPE.LIKE).toBe('like');
      expect(NOTIFICATION_TYPE.UNLIKE).toBe('unlike');
      expect(NOTIFICATION_TYPE.MATCH).toBe('match');
      expect(NOTIFICATION_TYPE.MESSAGE).toBe('message');
    });

    it('should have string values', () => {
      Object.values(NOTIFICATION_TYPE).forEach(value => {
        expect(typeof value).toBe('string');
      });
    });

    it('should have lowercase values', () => {
      Object.values(NOTIFICATION_TYPE).forEach(value => {
        expect(value).toBe(value.toLowerCase());
      });
    });

    it('should have unique notification types', () => {
      const values = Object.values(NOTIFICATION_TYPE);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe('Age Constants', () => {
    it('should have legal minimum age', () => {
      expect(MIN_AGE).toBe(18);
      expect(MIN_AGE).toBeGreaterThanOrEqual(18);
    });

    it('should have reasonable maximum age', () => {
      expect(MAX_AGE).toBe(120);
      expect(MAX_AGE).toBeLessThanOrEqual(150);
    });

    it('should have valid age range', () => {
      expect(MIN_AGE).toBeLessThan(MAX_AGE);
      expect(MAX_AGE - MIN_AGE).toBeGreaterThan(50);
    });
  });

  describe('Default Values', () => {
    it('should have default gender matching GENDER_OTHER', () => {
      expect(DEFAULT_GENDER).toBe(GENDER_OTHER);
      expect(DEFAULT_GENDER).toBe(0);
    });

    it('should have empty string as default biography', () => {
      expect(DEFAULT_BIOGRAPHY).toBe('');
      expect(typeof DEFAULT_BIOGRAPHY).toBe('string');
    });
  });

  describe('Constant Types', () => {
    it('should have number types for fame rating constants', () => {
      expect(typeof FAME_RATING_MIN).toBe('number');
      expect(typeof FAME_RATING_MAX).toBe('number');
      expect(typeof DEFAULT_FAME_RATING).toBe('number');
    });

    it('should have number types for fame action constants', () => {
      expect(typeof FAME_INCREMENT_LIKE).toBe('number');
      expect(typeof FAME_DECREMENT_UNLIKE).toBe('number');
      expect(typeof FAME_DECREMENT_BLOCK).toBe('number');
      expect(typeof FAME_INCREMENT_UNBLOCK).toBe('number');
    });

    it('should have number types for limit constants', () => {
      expect(typeof USER_MAX_TAGS).toBe('number');
      expect(typeof USER_MAX_PHOTOS).toBe('number');
    });

    it('should have number types for gender constants', () => {
      expect(typeof GENDER_MALE).toBe('number');
      expect(typeof GENDER_FEMALE).toBe('number');
      expect(typeof GENDER_OTHER).toBe('number');
    });

    it('should have number types for sexual preference constants', () => {
      expect(typeof SEXUAL_PREFERENCE_MALE).toBe('number');
      expect(typeof SEXUAL_PREFERENCE_FEMALE).toBe('number');
      expect(typeof SEXUAL_PREFERENCE_BISEXUAL).toBe('number');
    });

    it('should have number types for age constants', () => {
      expect(typeof MIN_AGE).toBe('number');
      expect(typeof MAX_AGE).toBe('number');
    });
  });

  describe('Business Logic Validations', () => {
    it('should allow fame rating to increase from default with multiple likes', () => {
      const afterOneLike = DEFAULT_FAME_RATING + FAME_INCREMENT_LIKE;
      const afterTwoLikes = afterOneLike + FAME_INCREMENT_LIKE;

      expect(afterOneLike).toBeLessThanOrEqual(FAME_RATING_MAX);
      expect(afterTwoLikes).toBeLessThanOrEqual(FAME_RATING_MAX);
    });

    it('should not allow default fame rating to go negative with single unlike', () => {
      const afterUnlike = DEFAULT_FAME_RATING + FAME_DECREMENT_UNLIKE;
      expect(afterUnlike).toBeGreaterThanOrEqual(FAME_RATING_MIN);
    });

    it('should have block penalty less severe than unlike', () => {
      expect(Math.abs(FAME_DECREMENT_BLOCK)).toBeLessThan(Math.abs(FAME_DECREMENT_UNLIKE));
    });

    it('should allow reasonable number of tags per user', () => {
      expect(USER_MAX_TAGS).toBeGreaterThanOrEqual(5);
      expect(USER_MAX_TAGS).toBeLessThanOrEqual(20);
    });

    it('should allow reasonable number of photos per user', () => {
      expect(USER_MAX_PHOTOS).toBeGreaterThanOrEqual(3);
      expect(USER_MAX_PHOTOS).toBeLessThanOrEqual(10);
    });
  });
});
