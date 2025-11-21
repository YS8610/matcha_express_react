import { sanitizeInput, stripAndEncode, isValidEmail as securityIsValidEmail } from './security';

const EMAIL_REGEX = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;

const BIOGRAPHY_REGEX = /^[\s\S]{0,500}$/;

const TAG_REGEX = /^[a-zA-Z0-9\s-]{1,30}$/;

const URL_REGEX = /^https?:\/\/.{1,2000}$/;

const GENDER_REGEX = /^(male|female|other)$/i;
const SEXUALITY_REGEX = /^(male|female|both)$/i;

const COMMON_PASSWORDS = [
  'password', 'qwerty', 'admin', 'letmein', 'welcome',
  'monkey', '123456', 'abc123', 'dragon', 'master',
  'passw0rd', 'password123', '12345678', 'qwerty123', 'admin123',
  'princess', 'football', 'solo', 'iloveyou', 'starwars'
];

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }

  if (email.length > 255) {
    return 'Email is too long (max 255 characters)';
  }

  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username.trim()) {
    return 'Username is required';
  }

  if (username.length < 3) {
    return 'Username must be at least 3 characters';
  }

  if (username.length > 20) {
    return 'Username must be no more than 20 characters';
  }

  if (!USERNAME_REGEX.test(username)) {
    return 'Username can only contain letters, numbers, underscores, and hyphens';
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  if (password.length > 128) {
    return 'Password is too long (max 128 characters)';
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter (a-z)';
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter (A-Z)';
  }

  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number (0-9)';
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return 'Password must contain at least one special character (@$!%*?&)';
  }

  if (COMMON_PASSWORDS.some(word => password.toLowerCase().includes(word))) {
    return 'Password contains common or weak patterns';
  }

  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return null;
};

export const validateFirstName = (firstName: string): string | null => {
  if (!firstName.trim()) {
    return 'First name is required';
  }

  if (firstName.length < 2) {
    return 'First name must be at least 2 characters';
  }

  if (firstName.length > 50) {
    return 'First name must be no more than 50 characters';
  }

  if (!/^[a-zA-Z\s'-]+$/.test(firstName)) {
    return 'First name can only contain letters, spaces, hyphens, and apostrophes';
  }

  return null;
};

export const validateLastName = (lastName: string): string | null => {
  if (!lastName.trim()) {
    return 'Last name is required';
  }

  if (lastName.length < 2) {
    return 'Last name must be at least 2 characters';
  }

  if (lastName.length > 50) {
    return 'Last name must be no more than 50 characters';
  }

  if (!/^[a-zA-Z\s'-]+$/.test(lastName)) {
    return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
  }

  return null;
};

export const validateBirthDate = (birthDate: string): string | null => {
  if (!birthDate) {
    return 'Birth date is required';
  }

  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    const actualAge = age - 1;
    if (actualAge < 18) {
      return 'You must be at least 18 years old to register';
    }
  } else {
    if (age < 18) {
      return 'You must be at least 18 years old to register';
    }
  }

  if (age > 120) {
    return 'Please enter a valid birth date';
  }

  return null;
};

export const validateRegisterForm = (formData: {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  const usernameError = validateUsername(formData.username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const firstNameError = validateFirstName(formData.firstName);
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateLastName(formData.lastName);
  if (lastNameError) errors.lastName = lastNameError;

  const birthDateError = validateBirthDate(formData.birthDate);
  if (birthDateError) errors.birthDate = birthDateError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return errors;
};

export const validateLoginForm = (username: string, password: string): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!username.trim()) {
    errors.username = 'Username is required';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const getPasswordValidationChecks = (password: string) => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const hasCommonWord = COMMON_PASSWORDS.some(word => password.toLowerCase().includes(word));

  return {
    ...checks,
    commonWord: !hasCommonWord,
    isValid: Object.values(checks).every(Boolean) && !hasCommonWord,
  };
};

export const validateBiography = (bio: string): string | null => {
  if (bio === undefined || bio === null) {
    return null;
  }

  const sanitized = sanitizeInput(bio, 500);

  if (sanitized.length > 500) {
    return 'Biography must be no more than 500 characters';
  }

  if (sanitized.includes('<script') || sanitized.includes('javascript:') || sanitized.includes('onerror=')) {
    return 'Biography contains invalid characters';
  }

  return null;
};

export const validateTag = (tag: string): string | null => {
  if (!tag.trim()) {
    return 'Tag is required';
  }

  const sanitized = sanitizeInput(tag.trim(), 30);

  if (sanitized.length < 2) {
    return 'Tag must be at least 2 characters';
  }

  if (sanitized.length > 30) {
    return 'Tag must be no more than 30 characters';
  }

  if (!TAG_REGEX.test(sanitized)) {
    return 'Tag can only contain letters, numbers, spaces, and hyphens';
  }

  return null;
};

export const validateGender = (gender: string): string | null => {
  if (!gender) {
    return 'Gender is required';
  }

  const sanitized = sanitizeInput(gender.trim(), 50);

  if (!GENDER_REGEX.test(sanitized)) {
    return 'Please select a valid gender option';
  }

  return null;
};

export const validateSexuality = (sexuality: string): string | null => {
  if (!sexuality) {
    return 'Sexual preference is required';
  }

  const sanitized = sanitizeInput(sexuality.trim(), 50);

  if (!SEXUALITY_REGEX.test(sanitized)) {
    return 'Please select a valid sexual preference option';
  }

  return null;
};

export const validateAge = (ageMin: number | null, ageMax: number | null): string | null => {
  const minAge = 18;
  const maxAge = 120;

  if (ageMin !== null && (ageMin < minAge || ageMin > maxAge)) {
    return `Minimum age must be between ${minAge} and ${maxAge}`;
  }

  if (ageMax !== null && (ageMax < minAge || ageMax > maxAge)) {
    return `Maximum age must be between ${minAge} and ${maxAge}`;
  }

  if (ageMin !== null && ageMax !== null && ageMin > ageMax) {
    return 'Minimum age must be less than maximum age';
  }

  return null;
};

export const validateDistance = (distance: number | null): string | null => {
  if (distance === null || distance === undefined) {
    return null;
  }

  if (distance < 0 || distance > 10000) {
    return 'Distance must be between 0 and 10000 km';
  }

  return null;
};

export const validateFameRating = (fame: number | null): string | null => {
  if (fame === null || fame === undefined) {
    return null;
  }

  if (fame < 0 || fame > 100) {
    return 'Fame rating must be between 0 and 100';
  }

  return null;
};

export const validateFile = (
  file: File,
  maxSizeBytes: number = 5 * 1024 * 1024, 
  allowedMimes: string[] = ['image/jpeg', 'image/png', 'image/webp']
): string | null => {
  if (!file) {
    return 'File is required';
  }

  if (file.size > maxSizeBytes) {
    const maxSizeMB = maxSizeBytes / (1024 * 1024);
    return `File size must be less than ${maxSizeMB}MB`;
  }

  if (!allowedMimes.includes(file.type)) {
    return `File type must be one of: ${allowedMimes.join(', ')}`;
  }

  if (file.name.includes('<') || file.name.includes('>') || file.name.includes('javascript')) {
    return 'File name contains invalid characters';
  }

  if (file.name.includes('\0')) {
    return 'File name contains invalid characters';
  }

  return null;
};

export const validateCoordinates = (latitude: number | null, longitude: number | null): string | null => {
  if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) {
    return null;
  }

  if (latitude < -90 || latitude > 90) {
    return 'Latitude must be between -90 and 90';
  }

  if (longitude < -180 || longitude > 180) {
    return 'Longitude must be between -180 and 180';
  }

  return null;
};

export const validateProfileUpdate = (profileData: {
  firstName?: string;
  lastName?: string;
  biography?: string;
  gender?: string;
  sexuality?: string;
  tags?: string[];
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (profileData.firstName !== undefined) {
    const error = validateFirstName(profileData.firstName);
    if (error) errors.firstName = error;
  }

  if (profileData.lastName !== undefined) {
    const error = validateLastName(profileData.lastName);
    if (error) errors.lastName = error;
  }

  if (profileData.biography !== undefined) {
    const error = validateBiography(profileData.biography);
    if (error) errors.biography = error;
  }

  if (profileData.gender !== undefined) {
    const error = validateGender(profileData.gender);
    if (error) errors.gender = error;
  }

  if (profileData.sexuality !== undefined) {
    const error = validateSexuality(profileData.sexuality);
    if (error) errors.sexuality = error;
  }

  if (profileData.tags !== undefined && Array.isArray(profileData.tags)) {
    for (let i = 0; i < profileData.tags.length; i++) {
      const error = validateTag(profileData.tags[i]);
      if (error) {
        errors[`tags.${i}`] = error;
        break;
      }
    }
  }

  return errors;
};
