'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ActivatePage({ params }: { params: Promise<{ token: string }> }) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-activated'>('loading');
  const [message, setMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const { activateAccount } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const activate = async () => {
      try {
        const resolvedParams = await params;
        const token = resolvedParams?.token;

        console.log('Attempting to activate with token:', token);

        if (!token || token.trim() === '') {
          throw new Error('No activation token provided');
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('Calling activateAccount API...');
        const result = await activateAccount(token);
        console.log('Activation result:', result);

        setStatus('success');
        setMessage('Your account has been successfully activated!');
        setTimeout(() => {
          router.push('/profile/setup');
        }, 3000);
      } catch (error) {
        console.error('Activation error:', error);
        console.error('Error details:', {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });

        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage.includes('already activated') || errorMessage.includes('Invalid token') || errorMessage.includes('JWT')) {
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

    activate();
  }, [params, activateAccount, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="rounded-2xl shadow-lg p-8 max-w-md w-full text-center" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--button-bg)' }}>
          Account Activation
        </h1>

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: 'var(--button-bg)', borderTopColor: 'transparent' }}></div>
            <p style={{ color: 'var(--foreground)' }}>Activating your account...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-success-bg rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-success-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-success-text font-medium">{message}</p>
            <p className="text-sm text-foreground-secondary">Redirecting to profile setup...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-error-bg rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-error-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-error-text font-medium">{message}</p>
            {errorDetails && <p className="text-sm text-foreground-secondary">{errorDetails}</p>}
            <Link
              href="/login"
              className="inline-block mt-4 px-4 py-2 rounded transition-colors font-bold"
              style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'already-activated' && (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-warning-bg rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-warning-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-warning-text font-medium">{message}</p>
            <p className="text-sm text-foreground-secondary">{errorDetails}</p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/login"
                className="inline-block px-4 py-2 rounded transition-colors font-bold"
                style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
              >
                Go to Login
              </Link>
              <Link
                href="/register"
                className="inline-block px-4 py-2 rounded transition-colors font-bold"
                style={{ backgroundColor: 'var(--border)', color: 'var(--foreground)' }}
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
