// src/utils/passwordValidation.ts
const COMMON_PASSWORDS = [
  'password', 'password123', '123456', 'qwerty', 'abc123', 'letmein', 
  'monkey', '1234567890', 'dragon', 'princess', 'password1', 'admin',
  'welcome', 'solo', 'master', 'hello', 'freedom', 'whatever', 'qazwsx',
  'trustno1', 'jordan', 'hunter', 'buster', 'soccer', 'harley', 'ranger',
  'shadow', 'dolphin', 'basketball', 'michelle', 'charlie', 'andrew',
  'daniel', 'joshua', 'maggie', 'jessica', 'computer', 'superman',
  'asshole', 'fuckyou', 'dallas', 'batman', 'tigger', 'please', 'spencer',
  'eagles', 'nascar', 'tiffany', 'football', 'redsox', 'toyota', 'sierra'
];

const COMMON_WORDS = [
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
  'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
  'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who',
  'boy', 'did', 'man', 'men', 'own', 'said', 'she', 'too', 'use'
];

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('This password is too common. Please choose a more secure password');
  }

  const lowerPassword = password.toLowerCase();
  for (const word of COMMON_WORDS) {
    if (lowerPassword.includes(word) && word.length > 3) {
      errors.push('Password should not contain common English words');
      break;
    }
  }

  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password should not contain repeated characters');
  }

  let strength: 'weak' | 'medium' | 'strong';
  if (score <= 2) {
    strength = 'weak';
  } else if (score <= 4) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
};
