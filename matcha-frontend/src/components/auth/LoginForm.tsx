'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { validateLoginForm } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rateLimiter';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateLimitWarning, setRateLimitWarning] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const validateField = useCallback((name: string, value: string) => {
    const tempData = { ...formData, [name]: value };
    const errors = validateLoginForm(tempData.username, tempData.password);
    return errors[name] || null;
  }, [formData]);

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
    setRateLimitWarning('');

    setTouched({ username: true, password: true });

    const errors = validateLoginForm(formData.username, formData.password);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const loginRateLimit = checkRateLimit('api:login');
    if (!loginRateLimit.allowed) {
      const waitTime = Math.ceil(loginRateLimit.retryAfterMs / 1000);
      setRateLimitWarning(
        `Too many login attempts. Please try again in ${waitTime} seconds.`
      );
      return;
    }

    if (loginRateLimit.remainingRequests <= 2) {
      setRateLimitWarning(
        `⚠️ ${loginRateLimit.remainingRequests} login attempt${loginRateLimit.remainingRequests === 1 ? '' : 's'} remaining`
      );
    }

    setLoading(true);

    try {
      await login(formData.username, formData.password);
      router.push('/browse');
    } catch (err: unknown) {
      setError((err as Error).message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md px-4 sm:px-0">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 sm:p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {rateLimitWarning && (
          <div className={`flex items-center gap-2 p-3 sm:p-4 border rounded-md text-sm ${
            rateLimitWarning.includes('Too many')
              ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
              : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
          }`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{rateLimitWarning}</span>
          </div>
        )}

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
              required
              className={`w-full px-3 py-2.5 sm:py-2 border rounded-md transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                isFieldInvalid('username')
                  ? 'border-red-500 dark:border-red-500'
                  : isFieldValid('username')
                  ? 'border-green-500 dark:border-green-500'
                  : 'border-gray-300 dark:border-slate-600'
              }`}
              placeholder="Enter your username"
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
              required
              className={`w-full px-3 py-2.5 sm:py-2 border rounded-md transition-colors bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                isFieldInvalid('password')
                  ? 'border-red-500 dark:border-red-500'
                  : isFieldValid('password')
                  ? 'border-green-500 dark:border-green-500'
                  : 'border-gray-300 dark:border-slate-600'
              }`}
              placeholder="Enter your password"
            />
            {isFieldValid('password') && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
            {isFieldInvalid('password') && (
              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </div>
          {isFieldInvalid('password') && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">{fieldErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 text-white py-2.5 sm:py-2 rounded-full hover:from-green-700 hover:to-green-600 dark:hover:from-green-800 dark:hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all transform hover:scale-105 shadow-lg text-base sm:text-base"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          {`Don't have an account? `}
          <Link href="/register" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline transition-colors font-semibold">
            Register
          </Link>
        </div>

        <div className="text-center text-xs sm:text-sm">
          <Link href="/reset-password" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline transition-colors font-semibold">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}
