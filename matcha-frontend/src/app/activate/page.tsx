'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { api } from '@/lib/api';
import Link from 'next/link';
import { FormInput, Button, Alert } from '@/components/ui';
import { Mail, User, Key, CheckCircle, AlertCircle, Send } from 'lucide-react';

function ActivatePageContent() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendUsername, setResendUsername] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');
  const { activateAccount } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    const shouldShowResend = searchParams.get('resend') === 'true';
    if (shouldShowResend) {
      setShowResendForm(true);
      return;
    }

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
  }, [params, searchParams]);

  const performActivation = async (activationToken: string) => {
    if (!activationToken.trim()) {
      setErrorDetails('Please enter an activation token');
      return;
    }

    setStatus('loading');
    setMessage('');
    setErrorDetails('');

    try {
      await activateAccount(activationToken);
      setStatus('success');
      setMessage('Your account has been successfully activated!');
      addToast('Account activated successfully! Redirecting...', 'success', 3000);
      setTimeout(() => {
        router.push('/profile/setup');
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('already activated') || errorMessage.includes('Invalid token')) {
        setStatus('error');
        setMessage('Invalid or expired activation token');
        setErrorDetails('This token may have already been used or has expired. Please check your email for the latest activation link.');
        addToast('Activation failed: Invalid or expired token', 'error', 4000);
      } else {
        setStatus('error');
        setMessage('Failed to activate account');
        setErrorDetails(errorMessage || 'An unexpected error occurred. Please try again or contact support.');
        addToast('Activation failed: ' + errorMessage, 'error', 4000);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performActivation(token);
  };

  const handleResendActivation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resendEmail.trim() || !resendUsername.trim()) {
      setResendMessage('Please enter both email and username');
      setResendStatus('error');
      return;
    }

    setResendStatus('loading');
    setResendMessage('');

    try {
      await api.resendActivationEmail(resendEmail, resendUsername);
      setResendStatus('success');
      setResendMessage('Activation email has been resent! Please check your inbox.');
      setResendEmail('');
      setResendUsername('');
      setTimeout(() => {
        setShowResendForm(false);
        setResendStatus('idle');
        setResendMessage('');
      }, 3000);
    } catch (error) {
      setResendStatus('error');
      setResendMessage(error instanceof Error ? error.message : 'Failed to resend activation email');
    }
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
              {showResendForm ? 'Resend Activation Email' : 'Activate Your Account'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {showResendForm ? 'Enter your email and username to resend activation email' : 'Enter the activation token from your email'}
            </p>
          </div>

          {!showResendForm && (
            <>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Key className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                      Check Your Email
                    </h3>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      We've sent you an activation token. Copy it from the email and paste it below to activate your account.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="token" className="block text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Activation Token
                    </div>
                  </label>
                  <input
                    type="text"
                    id="token"
                    name="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste your activation token from email"
                    disabled={status === 'loading'}
                    className="w-full px-3 py-2 border rounded-md transition-colors bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-300 dark:border-slate-600 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <Button
                  type="submit"
                  fullWidth
                  loading={status === 'loading'}
                  disabled={status === 'loading' || !token.trim()}
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {status === 'loading' ? 'Activating...' : 'Activate Account'}
                  </div>
                </Button>
              </form>

              {status === 'success' && (
                <div className="mt-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                          {message}
                        </h3>
                        <p className="text-xs text-green-700 dark:text-green-400">
                          Redirecting to profile setup...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="mt-6">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                          {message}
                        </h3>
                        {errorDetails && (
                          <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                            {errorDetails}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="mt-4">
                  <Button variant="secondary" fullWidth size="sm" onClick={() => setShowResendForm(true)}>
                    <div className="flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Resend Activation Email
                    </div>
                  </Button>
                </div>
              )}
            </>
          )}

          {showResendForm && (
            <div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                      Resend Activation Email
                    </h3>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Enter your email and username to receive a new activation token.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleResendActivation} className="space-y-6">
                <div>
                  <label htmlFor="resend-email" className="block text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </div>
                  </label>
                  <input
                    type="email"
                    id="resend-email"
                    name="resend-email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    disabled={resendStatus === 'loading'}
                    className="w-full px-3 py-2 border rounded-md transition-colors bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-300 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="resend-username" className="block text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Username
                    </div>
                  </label>
                  <input
                    type="text"
                    id="resend-username"
                    name="resend-username"
                    value={resendUsername}
                    onChange={(e) => setResendUsername(e.target.value)}
                    placeholder="your_username"
                    disabled={resendStatus === 'loading'}
                    className="w-full px-3 py-2 border rounded-md transition-colors bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-300 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <Button
                  type="submit"
                  fullWidth
                  loading={resendStatus === 'loading'}
                  disabled={resendStatus === 'loading' || !resendEmail.trim() || !resendUsername.trim()}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    {resendStatus === 'loading' ? 'Sending...' : 'Send Activation Email'}
                  </div>
                </Button>
              </form>

              {resendStatus === 'success' && (
                <div className="mt-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                          Email Sent!
                        </h3>
                        <p className="text-xs text-green-700 dark:text-green-400">
                          {resendMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {resendStatus === 'error' && (
                <div className="mt-6">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                          Failed to Send Email
                        </h3>
                        <p className="text-xs text-red-700 dark:text-red-400">
                          {resendMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {searchParams.get('resend') !== 'true' && (
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    fullWidth
                    size="sm"
                    onClick={() => {
                      setShowResendForm(false);
                      setResendStatus('idle');
                      setResendMessage('');
                      setResendEmail('');
                      setResendUsername('');
                    }}
                  >
                    Back to Activation
                  </Button>
                </div>
              )}
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

export default function ActivatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 dark:border-green-400 border-t-transparent"></div>
          <p className="mt-4 text-green-700 dark:text-green-300">Loading...</p>
        </div>
      </div>
    }>
      <ActivatePageContent />
    </Suspense>
  );
}
