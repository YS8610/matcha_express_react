'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Leaf } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const token = params.token as string;

  const [resetData, setResetData] = useState({
    newPassword: '',
    newPassword2: ''
  });
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (resetData.newPassword !== resetData.newPassword2) {
      setResetError('Passwords do not match');
      return;
    }

    if (resetData.newPassword.length < 8) {
      setResetError('Password must be at least 8 characters long');
      return;
    }

    setResetLoading(true);

    try {
      const response = await api.confirmPasswordReset(
        userId,
        token,
        resetData.newPassword,
        resetData.newPassword2
      );
      setResetSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <Leaf className="w-8 h-8 text-green-600 dark:text-green-400 mr-2" />
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">Matcha</h1>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Reset Password</h2>

        {resetSuccess && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
            <p className="text-green-700 dark:text-green-200 text-sm">{resetSuccess}</p>
          </div>
        )}

        {resetError && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-200 text-sm">{resetError}</p>
          </div>
        )}

        <form onSubmit={handleResetSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={resetData.newPassword}
              onChange={handleResetChange}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:focus:ring-green-400"
              disabled={resetLoading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Must be at least 8 characters</p>
          </div>

          <div>
            <label htmlFor="newPassword2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="newPassword2"
              name="newPassword2"
              value={resetData.newPassword2}
              onChange={handleResetChange}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:focus:ring-green-400"
              disabled={resetLoading}
            />
          </div>

          <button
            type="submit"
            disabled={resetLoading || !resetData.newPassword || !resetData.newPassword2}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-2 rounded-lg hover:from-green-700 hover:to-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resetLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
            <Link href="/login" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
