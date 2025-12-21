'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { Leaf, Mail, Key, AlertCircle, CheckCircle, Send, Lock, User } from 'lucide-react';
import { FormInput, Button, Alert } from '@/components/ui';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();

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
      const successMsg = 'Password reset email sent! Please check your email for the reset link.';
      setRequestSuccess(successMsg);
      addToast(successMsg, 'success', 4000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Password reset request failed';
      setRequestError(errorMsg);
      addToast(errorMsg, 'error', 4000);
    } finally {
      setRequestLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (resetData.newPassword !== resetData.newPassword2) {
      const errorMsg = 'Passwords do not match';
      setResetError(errorMsg);
      addToast(errorMsg, 'warning', 3000);
      return;
    }

    if (resetData.newPassword.length < 8) {
      const errorMsg = 'Password must be at least 8 characters long';
      setResetError(errorMsg);
      addToast(errorMsg, 'warning', 3000);
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
      const successMsg = `Success: ${response.msg}`;
      setResetSuccess(successMsg);
      addToast('Password reset successfully! Redirecting to login...', 'success', 3000);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Password reset failed';
      setResetError(errorMsg);
      addToast(errorMsg, 'error', 4000);
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
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                    Forgot your password?
                  </h3>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    Enter your email and username below. We'll send you a reset link with instructions to create a new password.
                  </p>
                </div>
              </div>
            </div>

            {requestError && (
              <Alert type="error" message={requestError} onClose={() => setRequestError('')} />
            )}

            {requestSuccess && (
              <Alert type="success" message={requestSuccess} />
            )}

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </div>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={requestData.email}
                  onChange={handleRequestChange}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-3 py-2 border rounded-md transition-colors bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-300 dark:border-slate-600"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </div>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={requestData.username}
                  onChange={handleRequestChange}
                  placeholder="your_username"
                  required
                  className="w-full px-3 py-2 border rounded-md transition-colors bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-300 dark:border-slate-600"
                />
              </div>

              <Button type="submit" fullWidth loading={requestLoading}>
                <div className="flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Reset Email
                </div>
              </Button>
            </form>
          </div>
        )}

        {activeTab === 'reset' && (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Key className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                    Reset with Token
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Copy the User ID and Reset Token from the email we sent you, then create your new password below.
                  </p>
                </div>
              </div>
            </div>

            {resetError && (
              <Alert type="error" message={resetError} onClose={() => setResetError('')} />
            )}

            {resetSuccess && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                      Password Reset Successful!
                    </h3>
                    <p className="text-xs text-green-700 dark:text-green-400">
                      {resetSuccess}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    User ID
                  </div>
                </label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  value={resetData.userId}
                  onChange={(e) => handleResetChange(e as any)}
                  placeholder="Paste your User ID from the email"
                  required
                  className="w-full px-3 py-2 border rounded-md transition-colors bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-300 dark:border-slate-600 font-mono"
                />
              </div>

              <div>
                <label htmlFor="token" className="block text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Reset Token
                  </div>
                </label>
                <textarea
                  id="token"
                  name="token"
                  value={resetData.token}
                  onChange={handleResetChange}
                  required
                  rows={3}
                  placeholder="Paste the reset token from the email"
                  className="w-full px-3 py-2 border rounded-md transition-colors bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-300 dark:border-slate-600 font-mono"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    New Password
                  </div>
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={resetData.newPassword}
                  onChange={(e) => handleResetChange(e as any)}
                  placeholder="Enter new password (minimum 8 characters)"
                  minLength={8}
                  required
                  className="w-full px-3 py-2 border rounded-md transition-colors bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-300 dark:border-slate-600"
                />
              </div>

              <div>
                <label htmlFor="newPassword2" className="block text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm New Password
                  </div>
                </label>
                <input
                  type="password"
                  id="newPassword2"
                  name="newPassword2"
                  value={resetData.newPassword2}
                  onChange={(e) => handleResetChange(e as any)}
                  placeholder="Confirm your new password"
                  minLength={8}
                  required
                  className="w-full px-3 py-2 border rounded-md transition-colors bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-300 dark:border-slate-600"
                />
              </div>

              <Button type="submit" fullWidth loading={resetLoading} disabled={!!resetSuccess}>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Reset Password
                </div>
              </Button>
            </form>
          </div>
        )}

        <Link href="/login" className="btn-secondary text-sm text-center w-full mt-10 block">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
