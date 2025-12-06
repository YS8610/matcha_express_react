'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Leaf } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();

  const [resetData, setResetData] = useState(() => {
    if (typeof window !== 'undefined') {
      const resetUserId = sessionStorage.getItem('resetUserId');
      const resetToken = sessionStorage.getItem('resetToken');
      if (resetUserId && resetToken) {
        return {
          userId: resetUserId,
          token: resetToken,
          newPassword: '',
          newPassword2: ''
        };
      }
    }
    return {
      userId: '',
      token: '',
      newPassword: '',
      newPassword2: ''
    };
  });

  const [activeTab, setActiveTab] = useState<'request' | 'reset'>(resetData.userId && resetData.token ? 'reset' : 'request');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('resetUserId');
      sessionStorage.removeItem('resetToken');
    }
  }, []);

  const [requestData, setRequestData] = useState({
    email: '',
    username: '',
  });
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleRequestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequestData({
      ...requestData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestError('');
    setRequestSuccess('');
    setRequestLoading(true);

    try {
      await api.requestPasswordReset(requestData.email, requestData.username);
      setRequestSuccess('Password reset email sent! Please check your email for the reset link.');
    } catch (err) {
      setRequestError(err instanceof Error ? err.message : 'Password reset request failed');
    } finally {
      setRequestLoading(false);
    }
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
        resetData.userId,
        resetData.token,
        resetData.newPassword,
        resetData.newPassword2
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

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen bg-[var(--background)]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-full">
              <Leaf className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">
            Reset Password
          </h1>
          <p className="text-green-600 dark:text-green-400">Request a reset email or use your reset token</p>
        </div>

        <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('request')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'request'
                ? 'bg-white dark:bg-gray-700 text-green-700 dark:text-green-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
            }`}
          >
            Request Reset Email
          </button>
          <button
            onClick={() => setActiveTab('reset')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'reset'
                ? 'bg-white dark:bg-gray-700 text-green-700 dark:text-green-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
            }`}
          >
            Reset with Token
          </button>
        </div>

        {activeTab === 'request' && (
          <div className="space-y-4">
            {requestError && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded">
                {requestError}
              </div>
            )}

            {requestSuccess && (
              <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 px-4 py-3 rounded">
                {requestSuccess}
              </div>
            )}

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-green-700 dark:text-green-400">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={requestData.email}
                  onChange={handleRequestChange}
                  required
                  className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white dark:focus:ring-green-400 transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1 text-green-700 dark:text-green-400">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={requestData.username}
                  onChange={handleRequestChange}
                  required
                  className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white dark:focus:ring-green-400 transition-colors"
                  placeholder="Enter your username"
                />
              </div>

              <button
                type="submit"
                disabled={requestLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded-full hover:from-green-700 hover:to-green-600 disabled:opacity-50 font-medium transition-all transform hover:scale-105 shadow-lg"
              >
                {requestLoading ? 'Sending...' : 'Send Reset Email'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'reset' && (
          <div className="space-y-4">
            {resetError && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded">
                {resetError}
              </div>
            )}

            {resetSuccess && (
              <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 px-4 py-3 rounded">
                {resetSuccess}
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium mb-1 text-green-700 dark:text-green-400">
                  User ID
                </label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  value={resetData.userId}
                  onChange={handleResetChange}
                  required
                  placeholder="Paste user ID from email"
                  className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white dark:focus:ring-green-400 transition-colors font-mono text-sm"
                />
              </div>

              <div>
                <label htmlFor="token" className="block text-sm font-medium mb-1 text-green-700 dark:text-green-400">
                  Reset Token
                </label>
                <textarea
                  id="token"
                  name="token"
                  value={resetData.token}
                  onChange={handleResetChange}
                  required
                  rows={3}
                  placeholder="Paste reset token from email"
                  className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white dark:focus:ring-green-400 transition-colors font-mono text-sm"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1 text-green-700 dark:text-green-400">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={resetData.newPassword}
                  onChange={handleResetChange}
                  required
                  minLength={8}
                  className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white dark:focus:ring-green-400 transition-colors"
                  placeholder="Enter new password (min 8 characters)"
                />
              </div>

              <div>
                <label htmlFor="newPassword2" className="block text-sm font-medium mb-1 text-green-700 dark:text-green-400">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="newPassword2"
                  name="newPassword2"
                  value={resetData.newPassword2}
                  onChange={handleResetChange}
                  required
                  minLength={8}
                  className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white dark:focus:ring-green-400 transition-colors"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={resetLoading || !!resetSuccess}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded-full hover:from-green-700 hover:to-green-600 disabled:opacity-50 font-medium transition-all transform hover:scale-105 shadow-lg"
              >
                {resetLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          </div>
        )}

        <Link href="/login" className="btn-secondary text-sm text-center w-full mt-6">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
