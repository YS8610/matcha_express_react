const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

const COMMON_PASSWORDS = [
  'password', 'qwerty', 'admin', 'letmein', 'welcome',
  'monkey', '123456', 'abc123', 'dragon', 'master'
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
