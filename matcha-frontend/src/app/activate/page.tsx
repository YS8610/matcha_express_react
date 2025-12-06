'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ActivatePage() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const { activateAccount } = useAuth();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? sessionStorage.getItem('activationToken') : null;
    if (storedToken) {
      setToken(storedToken);
      sessionStorage.removeItem('activationToken');
      performActivation(storedToken);
    } else {
      const urlToken = params.token as string | undefined;
      if (urlToken) {
        setToken(urlToken);
        performActivation(urlToken);
      }
    }
  }, [params]);

  const performActivation = async (activationToken: string) => {
    if (!activationToken.trim()) {
      setErrorDetails('Please enter an activation token');
      return;
    }

    setStatus('loading');
    setMessage('');
    setErrorDetails('');

    try {
      console.log('Attempting to activate with token:', activationToken);
      await activateAccount(activationToken);
      setStatus('success');
      setMessage('Your account has been successfully activated!');
      setTimeout(() => {
        router.push('/profile/setup');
      }, 3000);
    } catch (error) {
      console.error('Activation error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('already activated') || errorMessage.includes('Invalid token')) {
        setStatus('error');
        setMessage('Invalid or expired activation token');
        setErrorDetails('This token may have already been used or has expired. Please check your email for the latest activation link.');
      } else {
        setStatus('error');
        setMessage('Failed to activate account');
        setErrorDetails(errorMessage || 'An unexpected error occurred. Please try again or contact support.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performActivation(token);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-green-300 dark:bg-green-900 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5"></div>
        <div className="absolute -bottom-8 left-10 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-sm border border-green-200 dark:border-green-900/50 rounded-2xl shadow-xl dark:shadow-2xl p-6 sm:p-8 bg-white dark:bg-gray-900">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-green-400 dark:from-green-300 dark:via-green-400 dark:to-green-300 bg-clip-text text-transparent mb-3">
              Activate Your Account
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Enter the activation token from your email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="token" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Activation Token
              </label>
              <input
                type="text"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your activation token"
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-green dark:focus:ring-brand-lime"
                disabled={status === 'loading'}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || !token.trim()}
              className="w-full btn-primary dark:btn-primary-dark text-base py-3"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Activating...
                </span>
              ) : (
                'Activate Account'
              )}
            </button>
          </form>

          {status === 'success' && (
            <div className="mt-6 p-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-medium text-emerald-800 dark:text-emerald-200">{message}</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">Redirecting to profile setup...</p>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">{message}</p>
                  {errorDetails && <p className="text-sm text-red-700 dark:text-red-300 mt-1">{errorDetails}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3 flex flex-col gap-3">
            <Link
              href="/register"
              className="btn-secondary text-sm text-center w-full"
            >
              Register Again
            </Link>

            <Link
              href="/login"
              className="btn-secondary text-sm text-center w-full"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
