'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { validateUsername, validatePassword } from '@/lib/validation';
import { isRateLimited, resetRateLimit, getRemainingAttempts, getResetTime } from '@/lib/rateLimit';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const validateField = useCallback((name: string, value: string) => {
    if (name === 'username') {
      return validateUsername(value);
    } else if (name === 'password') {
      return validatePassword(value);
    }
    return null;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setFieldErrors(prev => {
        if (fieldError) {
          return { ...prev, [name]: fieldError };
        } else {
          const { [name]: _, ...rest } = prev;
          return rest;
        }
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const fieldError = validateField(name, formData[name as keyof typeof formData]);
    setFieldErrors(prev => {
      if (fieldError) {
        return { ...prev, [name]: fieldError };
      } else {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  const isFieldValid = (fieldName: string) => {
    return touched[fieldName] && !fieldErrors[fieldName];
  };

  const isFieldInvalid = (fieldName: string) => {
    return touched[fieldName] && !!fieldErrors[fieldName];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const rateLimitKey = `login:${formData.username.toLowerCase()}`;
    if (isRateLimited(rateLimitKey, 5, 15 * 60 * 1000)) {
      const resetMs = getResetTime(rateLimitKey);
      const resetMinutes = resetMs ? Math.ceil(resetMs / 60000) : 15;
      setError(`Too many login attempts. Please try again in ${resetMinutes} minute${resetMinutes > 1 ? 's' : ''}.`);
      return;
    }

    setTouched({ username: true, password: true });

    const errors: Record<string, string> = {};
    const usernameError = validateUsername(formData.username);
    if (usernameError) errors.username = usernameError;
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await login(formData.username, formData.password);
      resetRateLimit(rateLimitKey);
      router.push('/browse');
    } catch (err: unknown) {
      setError((err as Error).message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm animate-in fade-in slide-in-from-top">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Username
          </label>
          <div className="relative group">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 bg-white dark:bg-slate-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base focus:outline-none ${
                isFieldInvalid('username')
                  ? 'border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : isFieldValid('username')
                  ? 'border-green-500 dark:border-green-500 focus:ring-2 focus:ring-green-500/20'
                  : 'border-gray-300 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500/10'
              }`}
              placeholder="Enter your username"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-200">
              {isFieldValid('username') && (
                <CheckCircle className="w-5 h-5 text-green-500 animate-in scale-in" />
              )}
              {isFieldInvalid('username') && (
                <AlertCircle className="w-5 h-5 text-red-500 animate-in scale-in" />
              )}
            </div>
          </div>
          {isFieldInvalid('username') && (
            <p className="text-xs text-red-500 dark:text-red-400 font-medium animate-in fade-in">{fieldErrors.username}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Password
          </label>
          <div className="relative group">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 bg-white dark:bg-slate-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base focus:outline-none ${
                isFieldInvalid('password')
                  ? 'border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : isFieldValid('password')
                  ? 'border-green-500 dark:border-green-500 focus:ring-2 focus:ring-green-500/20'
                  : 'border-gray-300 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500/10'
              }`}
              placeholder="Enter your password"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-200">
              {isFieldValid('password') && (
                <CheckCircle className="w-5 h-5 text-green-500 animate-in scale-in" />
              )}
              {isFieldInvalid('password') && (
                <AlertCircle className="w-5 h-5 text-red-500 animate-in scale-in" />
              )}
            </div>
          </div>
          {isFieldInvalid('password') && (
            <p className="text-xs text-red-500 dark:text-red-400 font-medium animate-in fade-in">{fieldErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-600 dark:hover:from-green-800 dark:hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-green-500/30 dark:hover:shadow-green-700/30 text-base"
        >
          <span className="flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Logging in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </span>
        </button>
      </form>

      <div className="space-y-3 pt-4 flex flex-col gap-3">
        <Link href="/register" className="btn-secondary text-sm text-center">
          Create Account
        </Link>

        <Link href="/reset-password" className="btn-secondary text-sm text-center">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}
