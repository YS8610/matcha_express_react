'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { FormInput, Button, Alert } from '@/components/ui';
import {
  validateUsername,
  validateEmail,
  validateFirstName,
  validateLastName,
  validateBirthDate,
  validatePassword,
  validateConfirmPassword,
  validateRegisterForm,
} from '@/lib/validation';
import { isRateLimited, resetRateLimit, getResetTime } from '@/lib/rateLimit';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const validateField = useCallback((name: string, value: string) => {
    let fieldError: string | null = null;

    switch (name) {
      case 'username':
        fieldError = validateUsername(value);
        break;
      case 'email':
        fieldError = validateEmail(value);
        break;
      case 'firstName':
        fieldError = validateFirstName(value);
        break;
      case 'lastName':
        fieldError = validateLastName(value);
        break;
      case 'birthDate':
        fieldError = validateBirthDate(value);
        break;
      case 'password':
        fieldError = validatePassword(value);
        break;
      case 'confirmPassword':
        fieldError = validateConfirmPassword(formData.password, value);
        break;
      default:
        break;
    }

    return fieldError;
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (touched[name]) {
      const error = validateField(name, value);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error || '',
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const rateLimitKey = `register:${formData.email.toLowerCase()}`;
    if (isRateLimited(rateLimitKey, 5, 15 * 60 * 1000)) {
      const resetMs = getResetTime(rateLimitKey);
      const resetMinutes = resetMs ? Math.ceil(resetMs / 60000) : 15;
      const errorMsg = `Too many registration attempts. Please try again in ${resetMinutes} minute${resetMinutes > 1 ? 's' : ''}.`;
      setError(errorMsg);
      addToast(errorMsg, 'error', 5000);
      return;
    }

    const errors = validateRegisterForm(formData);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const errorMsg = 'Please fix the errors below';
      setError(errorMsg);
      addToast(errorMsg, 'warning', 3000);
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        password: formData.password,
        password2: formData.confirmPassword,
      });
      resetRateLimit(rateLimitKey);
      addToast('Registration successful! Check your email for activation link.', 'success', 4000);
      router.push('/activate');
    } catch (err: unknown) {
      const errorMsg = (err as Error).message || 'Registration failed. Please try again.';
      setError(errorMsg);
      addToast(errorMsg, 'error', 4000);
    } finally {
      setLoading(false);
    }
  };

  const isFieldValid = (fieldName: string): boolean => {
    return touched[fieldName] && !fieldErrors[fieldName];
  };

  const isFieldInvalid = (fieldName: string): boolean => {
    return touched[fieldName] && !!fieldErrors[fieldName];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md px-4 sm:px-0">
      <FormInput
        type="text"
        id="username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        onBlur={handleBlur}
        label="Username"
        placeholder="3-20 characters, letters, numbers, _, -"
        error={touched.username ? fieldErrors.username : undefined}
        showValidation={touched.username}
        isValid={isFieldValid('username')}
      />

      <FormInput
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        label="Email"
        placeholder="your.email@example.com"
        error={touched.email ? fieldErrors.email : undefined}
        showValidation={touched.email}
        isValid={isFieldValid('email')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          label="First Name"
          placeholder="John"
          error={touched.firstName ? fieldErrors.firstName : undefined}
          showValidation={touched.firstName}
          isValid={isFieldValid('firstName')}
        />

        <FormInput
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Last Name"
          placeholder="Doe"
          error={touched.lastName ? fieldErrors.lastName : undefined}
          showValidation={touched.lastName}
          isValid={isFieldValid('lastName')}
        />
      </div>

      <div>
        <FormInput
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Birth Date"
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
          error={touched.birthDate ? fieldErrors.birthDate : undefined}
          showValidation={touched.birthDate}
          isValid={isFieldValid('birthDate')}
        />
        {!isFieldInvalid('birthDate') && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">You must be at least 18 years old</p>
        )}
      </div>

      <div>
        <FormInput
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Password"
          placeholder="Enter a strong password"
          error={touched.password ? fieldErrors.password : undefined}
          showValidation={touched.password}
          isValid={isFieldValid('password')}
        />
        {!isFieldInvalid('password') && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            8+ chars with uppercase, lowercase, number & special char (@$!%*?&)
          </p>
        )}
      </div>

      <FormInput
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        label="Confirm Password"
        placeholder="Re-enter your password"
        error={touched.confirmPassword ? fieldErrors.confirmPassword : undefined}
        showValidation={touched.confirmPassword}
        isValid={isFieldValid('confirmPassword')}
      />

      {error && <Alert type="error" message={error} />}

      <Button type="submit" fullWidth loading={loading}>
        {loading ? 'Creating Account...' : 'Register'}
      </Button>

      <Link href="/login" className="btn-secondary text-sm text-center w-full mt-4">
        Back to Login
      </Link>
    </form>
  );
}
