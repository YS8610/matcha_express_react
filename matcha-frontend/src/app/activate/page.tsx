'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ActivatePage() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const { activateAccount } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token.trim()) {
      setErrorDetails('Please enter an activation token');
      return;
    }

    setStatus('loading');
    setMessage('');
    setErrorDetails('');

    try {
      console.log('Attempting to activate with token:', token);
      await activateAccount(token);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
          Activate Your Account
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter the activation token from your email
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
              Activation Token
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your activation token"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              disabled={status === 'loading'}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || !token.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-600 font-medium">{message}</p>
            </div>
            <p className="text-sm text-gray-600 mt-2">Redirecting to profile setup...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-red-600 font-medium">{message}</p>
                {errorDetails && <p className="text-sm text-gray-600 mt-1">{errorDetails}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Didn&apos;t receive an activation email?
          </p>
          <Link
            href="/register"
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            Register again
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Already activated? Go to login
          </Link>
        </div>
      </div>
    </div>
  );
}