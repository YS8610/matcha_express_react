import { describe, it, expect } from 'vitest';

// Validation utilities that should be extracted from components
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 30 && /^[a-zA-Z0-9_-]+$/.test(username);
};

const validateAge = (birthDate: string): boolean => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 18;
};

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.email@domain.co.uk')).toBe(true);
      expect(validateEmail('name+tag@company.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@.com')).toBe(false);
      expect(validateEmail('user @example.com')).toBe(false);
    });

    it('should reject empty email', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should accept passwords with 8+ characters', () => {
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('SecurePass1!')).toBe(true);
      expect(validatePassword('12345678')).toBe(true);
    });

    it('should reject passwords shorter than 8 characters', () => {
      expect(validatePassword('short')).toBe(false);
      expect(validatePassword('1234567')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it('should accept valid usernames', () => {
      expect(validateUsername('john_doe')).toBe(true);
      expect(validateUsername('user123')).toBe(true);
      expect(validateUsername('test-user')).toBe(true);
      expect(validateUsername('abc')).toBe(true);
    });

    it('should reject usernames shorter than 3 characters', () => {
      expect(validateUsername('ab')).toBe(false);
      expect(validateUsername('')).toBe(false);
    });

    it('should reject usernames longer than 30 characters', () => {
      expect(validateUsername('a'.repeat(31))).toBe(false);
    });

    it('should reject usernames with invalid characters', () => {
      expect(validateUsername('user@name')).toBe(false);
      expect(validateUsername('user name')).toBe(false);
      expect(validateUsername('user!name')).toBe(false);
    });

    it('should accept exactly 3 and 30 character usernames', () => {
      expect(validateUsername('abc')).toBe(true);
      expect(validateUsername('a'.repeat(30))).toBe(true);
    });
  });

  describe('validateAge', () => {
    it('should accept users 18 years old or older', () => {
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      expect(validateAge(eighteenYearsAgo.toISOString().split('T')[0])).toBe(true);
    });

    it('should accept users older than 18', () => {
      const thirtyYearsAgo = new Date();
      thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30);
      expect(validateAge(thirtyYearsAgo.toISOString().split('T')[0])).toBe(true);
    });

    it('should reject users under 18', () => {
      const sixteenYearsAgo = new Date();
      sixteenYearsAgo.setFullYear(sixteenYearsAgo.getFullYear() - 16);
      expect(validateAge(sixteenYearsAgo.toISOString().split('T')[0])).toBe(false);
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(validateAge(futureDate.toISOString().split('T')[0])).toBe(false);
    });
  });
});
