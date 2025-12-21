'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { FormInput, Button, Alert } from '@/components/ui';
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
  const { addToast } = useToast();
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
    if (error) {
      setError('');
    }

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
      const errorMsg = `Too many login attempts. Please try again in ${resetMinutes} minute${resetMinutes > 1 ? 's' : ''}.`;
      setError(errorMsg);
      addToast(errorMsg, 'error', 5000);
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
      addToast('Login successful! Welcome back!', 'success', 3000);
      router.push('/browse');
    } catch (err: unknown) {
      const errorMsg = (err as Error).message || 'Invalid username or password';
      setError(errorMsg);
      addToast(errorMsg, 'error', 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert type="error" message={error} />}

        <FormInput
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Username"
          placeholder="Enter your username"
          error={touched.username ? fieldErrors.username : undefined}
          showValidation={touched.username}
          isValid={isFieldValid('username')}
          required
        />

        <FormInput
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Password"
          placeholder="Enter your password"
          error={touched.password ? fieldErrors.password : undefined}
          showValidation={touched.password}
          isValid={isFieldValid('password')}
          required
        />

        <Button type="submit" fullWidth loading={loading}>
          {loading ? 'Logging in...' : 'Sign In'}
        </Button>
      </form>

      <div className="space-y-3 pt-4 flex flex-col gap-3">
        <Link href="/register" className="btn-secondary text-sm text-center">
          Create Account
        </Link>

        <Link href="/reset-password" className="btn-secondary text-sm text-center">
          Forgot Password?
        </Link>

        <Link href="/activate?resend=true" className="btn-secondary text-sm text-center">
          Resend Activation Email
        </Link>
      </div>
    </div>
  );
}
