'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Leaf } from 'lucide-react';

export default function ResetPasswordTokenPage({ params }: { params: Promise<{ id: string; token: string }> }) {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    const initializeParams = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams?.id;
        const tok = resolvedParams?.token;

        if (!id || !tok || id.trim() === '' || tok.trim() === '') {
          setResetError('Invalid reset link. Please request a new password reset.');
          setLoading(false);
          return;
        }

        setUserId(id);
        setToken(tok);
        setLoading(false);
      } catch (error) {
        console.error('Error processing reset link:', error);
        setResetError('Failed to process reset link. Please try again.');
        setLoading(false);
      }
    };

    initializeParams();
  }, [params]);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (newPassword !== newPassword2) {
      setResetError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setResetError('Password must be at least 8 characters long');
      return;
    }

    setResetLoading(true);

    try {
      const response = await api.confirmPasswordReset(
        userId,
        token,
        newPassword,
        newPassword2
      );
      setResetSuccess(`Success: ${response.msg}`);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setResetLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <svg className="w-8 h-8 text-brand-green dark:text-brand-lime" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading reset form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-green-300 dark:bg-green-900 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5"></div>
        <div className="absolute -bottom-8 left-10 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-sm border border-green-200 dark:border-green-900/50 rounded-2xl shadow-xl dark:shadow-2xl p-6 sm:p-8 bg-white dark:bg-gray-900">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-full">
                <Leaf className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-green-400 dark:from-green-300 dark:via-green-400 dark:to-green-300 bg-clip-text text-transparent mb-3">
              Reset Password
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your new password below
            </p>
          </div>

          {resetError && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 dark:text-red-200">{resetError}</p>
              </div>
            </div>
          )}

          {resetSuccess && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-medium text-emerald-800 dark:text-emerald-200">{resetSuccess}</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">Redirecting to login...</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleResetSubmit} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-green dark:focus:ring-brand-lime"
                placeholder="Enter new password (min 8 characters)"
              />
            </div>

            <div>
              <label htmlFor="newPassword2" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="newPassword2"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-green dark:focus:ring-brand-lime"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={resetLoading || !!resetSuccess}
              className="w-full btn-primary dark:btn-primary-dark text-base py-3"
            >
              {resetLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting Password...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
