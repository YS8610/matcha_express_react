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
    const urlToken = params.token as string | undefined;
    if (urlToken) {
      setToken(urlToken);
      performActivation(urlToken);
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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="rounded-2xl shadow-lg p-8 max-w-md w-full" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
        <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: 'var(--button-bg)' }}>
          Activate Your Account
        </h1>
        <p className="text-center mb-6" style={{ color: 'var(--foreground-secondary)' }}>
          Enter the activation token from your email
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Activation Token
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your activation token"
              className="w-full px-4 py-2 rounded-lg outline-none transition focus:ring-2"
              style={{
                borderColor: 'var(--border)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--foreground)'
              }}
              disabled={status === 'loading'}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || !token.trim()}
            className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white"
            style={{ backgroundColor: 'var(--button-bg)' }}
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--success-bg)' }}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--success-text)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="font-medium" style={{ color: 'var(--success-text)' }}>{message}</p>
            </div>
            <p className="text-sm mt-2" style={{ color: 'var(--foreground-secondary)' }}>Redirecting to profile setup...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--error-bg)' }}>
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--error-text)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="font-medium" style={{ color: 'var(--error-text)' }}>{message}</p>
                {errorDetails && <p className="text-sm mt-1" style={{ color: 'var(--foreground-secondary)' }}>{errorDetails}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
            Didn&apos;t receive an activation email?
          </p>
          <Link
            href="/register"
            className="font-medium text-sm inline-block transition-colors"
            style={{ color: 'var(--button-bg)' }}
          >
            Register again
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-sm transition-colors"
            style={{ color: 'var(--foreground-secondary)' }}
          >
            Already activated? Go to login
          </Link>
        </div>
      </div>
    </div>
  );
}
