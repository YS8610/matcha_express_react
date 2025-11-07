'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
import { checkRateLimit } from '@/lib/rateLimiter';

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
  const [rateLimitWarning, setRateLimitWarning] = useState('');
  const { register } = useAuth();
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
    setRateLimitWarning('');

    const errors = validateRegisterForm(formData);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors below');
      return;
    }

    const registerRateLimit = checkRateLimit('api:register');
    if (!registerRateLimit.allowed) {
      const waitTime = Math.ceil(registerRateLimit.retryAfterMs / 1000);
      setRateLimitWarning(
        `Too many registration attempts from this email. Please try again in ${waitTime} seconds.`
      );
      return;
    }

    if (registerRateLimit.remainingRequests <= 1) {
      setRateLimitWarning(
        `⚠️ Only ${registerRateLimit.remainingRequests} registration attempt remaining. Please verify your information carefully.`
      );
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
      router.push('/activate');
    } catch (err: unknown) {
      setError((err as Error).message || 'Registration failed. Please try again.');
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
      <div>
        <label htmlFor="username" className="block text-xs sm:text-sm font-medium mb-2 text-green-700 dark:text-green-300">
          Username
        </label>
        <div className="relative">
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="3-20 characters, letters, numbers, _, -"
            className={`w-full px-3 py-2.5 sm:py-2 border rounded-md transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              isFieldInvalid('username')
                ? 'border-red-500 dark:border-red-500'
                : isFieldValid('username')
                ? 'border-green-500 dark:border-green-500'
                : 'border-gray-300 dark:border-slate-600'
            }`}
          />
          {isFieldValid('username') && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
          {isFieldInvalid('username') && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
          )}
        </div>
        {isFieldInvalid('username') && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">{fieldErrors.username}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-2 text-green-700 dark:text-green-300">
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="your.email@example.com"
            className={`w-full px-3 py-2.5 sm:py-2 border rounded-md transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              isFieldInvalid('email')
                ? 'border-red-500 dark:border-red-500'
                : isFieldValid('email')
                ? 'border-green-500 dark:border-green-500'
                : 'border-gray-300 dark:border-slate-600'
            }`}
          />
          {isFieldValid('email') && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
          {isFieldInvalid('email') && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
          )}
        </div>
        {isFieldInvalid('email') && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">{fieldErrors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium mb-2 text-green-700 dark:text-green-300">
            First Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John"
              className={`w-full px-3 py-2.5 sm:py-2 border rounded-md transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                isFieldInvalid('firstName')
                  ? 'border-red-500 dark:border-red-500'
                  : isFieldValid('firstName')
                  ? 'border-green-500 dark:border-green-500'
                  : 'border-gray-300 dark:border-slate-600'
              }`}
            />
            {isFieldValid('firstName') && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
            {isFieldInvalid('firstName') && (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </div>
          {isFieldInvalid('firstName') && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">{fieldErrors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium mb-2 text-green-700 dark:text-green-300">
            Last Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Doe"
              className={`w-full px-3 py-2.5 sm:py-2 border rounded-md transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                isFieldInvalid('lastName')
                  ? 'border-red-500 dark:border-red-500'
                  : isFieldValid('lastName')
                  ? 'border-green-500 dark:border-green-500'
                  : 'border-gray-300 dark:border-slate-600'
              }`}
            />
            {isFieldValid('lastName') && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
            {isFieldInvalid('lastName') && (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </div>
          {isFieldInvalid('lastName') && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">{fieldErrors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="birthDate" className="block text-xs sm:text-sm font-medium mb-2 text-green-700 dark:text-green-300">
          Birth Date
        </label>
        <div className="relative">
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            onBlur={handleBlur}
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
            className={`w-full px-3 py-2.5 sm:py-2 pr-10 border rounded-md transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              isFieldInvalid('birthDate')
                ? 'border-red-500 dark:border-red-500'
                : isFieldValid('birthDate')
                ? 'border-green-500 dark:border-green-500'
                : 'border-gray-300 dark:border-slate-600'
            }`}
          />
          {isFieldValid('birthDate') && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
          {isFieldInvalid('birthDate') && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
          )}
        </div>
        {isFieldInvalid('birthDate') ? (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">{fieldErrors.birthDate}</p>
        ) : (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">You must be at least 18 years old</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-xs sm:text-sm font-medium mb-2 text-green-700 dark:text-green-300">
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter a strong password"
            className={`w-full px-3 py-2.5 sm:py-2 border rounded-md transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              isFieldInvalid('password')
                ? 'border-red-500 dark:border-red-500'
                : isFieldValid('password')
                ? 'border-green-500 dark:border-green-500'
                : 'border-gray-300 dark:border-slate-600'
            }`}
          />
          {isFieldValid('password') && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
          {isFieldInvalid('password') && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
          )}
        </div>
        {isFieldInvalid('password') ? (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">{fieldErrors.password}</p>
        ) : (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            8+ chars with uppercase, lowercase, number & special char (@$!%*?&)
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium mb-2 text-green-700 dark:text-green-300">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Re-enter your password"
            className={`w-full px-3 py-2.5 sm:py-2 border rounded-md transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              isFieldInvalid('confirmPassword')
                ? 'border-red-500 dark:border-red-500'
                : isFieldValid('confirmPassword')
                ? 'border-green-500 dark:border-green-500'
                : 'border-gray-300 dark:border-slate-600'
            }`}
          />
          {isFieldValid('confirmPassword') && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
          {isFieldInvalid('confirmPassword') && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
          )}
        </div>
        {isFieldInvalid('confirmPassword') && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">{fieldErrors.confirmPassword}</p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </p>
        </div>
      )}

      {rateLimitWarning && (
        <div className={`p-3 border rounded-md ${
          rateLimitWarning.includes('Too many')
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        }`}>
          <p className={`text-sm flex items-center gap-2 ${
            rateLimitWarning.includes('Too many')
              ? 'text-red-700 dark:text-red-300'
              : 'text-yellow-700 dark:text-yellow-300'
          }`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {rateLimitWarning}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 text-white py-2.5 sm:py-2 rounded-full hover:from-green-700 hover:to-green-600 dark:hover:from-green-800 dark:hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all transform hover:scale-105 shadow-lg text-base sm:text-base"
      >
        {loading ? 'Creating Account...' : 'Register'}
      </button>

      <div className="text-center text-xs sm:text-sm text-gray-700 dark:text-gray-300">
        {`Already have an account? `}
        <Link href="/login" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline transition-colors font-semibold">
          Login
        </Link>
      </div>
    </form>
  );
}
