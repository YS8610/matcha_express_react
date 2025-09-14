'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ActivatePage({ params }: { params: { token: string } }) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const { activateAccount } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const activate = async () => {
      try {
        await activateAccount(params.token);
        setStatus('success');
        setMessage('Your account has been successfully activated!');
        setTimeout(() => {
          router.push('/profile/setup');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage((error as Error).message || 'Failed to activate account');
      }
    };

    activate();
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
            <Link
              href="/login"
              className="inline-block mt-4 text-green-600 hover:text-green-700 hover:underline"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}