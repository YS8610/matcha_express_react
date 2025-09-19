'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ActivatePage({ params }: { params: { token: string } }) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-activated'>('loading');
  const [message, setMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const { activateAccount } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const activate = async () => {
      try {
        console.log('Attempting to activate with token:', params.token);

        await new Promise(resolve => setTimeout(resolve, 500));

        await activateAccount(params.token);
        setStatus('success');
        setMessage('Your account has been successfully activated!');
        setTimeout(() => {
          router.push('/profile/setup');
        }, 3000);
      } catch (error) {
        console.error('Activation error:', error);

        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage.includes('already activated') || errorMessage.includes('Invalid token')) {
          setStatus('already-activated');
          setMessage('This activation link has expired or already been used.');
          setErrorDetails('Your account may already be activated. Please try logging in.');
        } else {
          setStatus('error');
          setMessage('Failed to activate account');
          setErrorDetails(errorMessage || 'An unexpected error occurred. Please try again or contact support.');
        }
      }
    };

    if (params.token) {
      activate();
    } else {
      setStatus('error');
      setMessage('Invalid activation link');
      setErrorDetails('No activation token was provided.');
    }
  }, [params.token, activateAccount, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
          Account Activation
        </h1>

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-gray-600">Activating your account...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-600 font-medium">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to profile setup...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">{message}</p>
            {errorDetails && <p className="text-sm text-gray-500">{errorDetails}</p>}
            <Link
              href="/login"
              className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'already-activated' && (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-yellow-600 font-medium">{message}</p>
            <p className="text-sm text-gray-500">{errorDetails}</p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/login"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Go to Login
              </Link>
              <Link
                href="/register"
                className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Create New Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
