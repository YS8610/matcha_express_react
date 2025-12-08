'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { api } from '@/lib/api';
import Link from 'next/link';
import { FormInput, Button, Alert } from '@/components/ui';

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
      console.error('Activation error:', error);
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
      console.error('Resend activation error:', error);
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                  type="text"
                  id="token"
                  name="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  label="Activation Token"
                  placeholder="Enter your activation token"
                  disabled={status === 'loading'}
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={status === 'loading'}
                  disabled={status === 'loading' || !token.trim()}
                >
                  {status === 'loading' ? 'Activating...' : 'Activate Account'}
                </Button>
              </form>

              {status === 'success' && (
                <div className="mt-6">
                  <Alert type="success" message={message} />
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-2">Redirecting to profile setup...</p>
                </div>
              )}

              {status === 'error' && (
                <div className="mt-6">
                  <Alert type="error" message={message} />
                  {errorDetails && <p className="text-sm text-red-700 dark:text-red-300 mt-2">{errorDetails}</p>}
                </div>
              )}

              {status === 'error' && (
                <div className="mt-4">
                  <Button variant="secondary" fullWidth size="sm" onClick={() => setShowResendForm(true)}>
                    Resend Activation Email
                  </Button>
                </div>
              )}
            </>
          )}

          {showResendForm && (
            <div>
              <form onSubmit={handleResendActivation} className="space-y-6">
                <FormInput
                  type="email"
                  id="resend-email"
                  name="resend-email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  label="Email"
                  placeholder="Enter your email"
                  disabled={resendStatus === 'loading'}
                />

                <FormInput
                  type="text"
                  id="resend-username"
                  name="resend-username"
                  value={resendUsername}
                  onChange={(e) => setResendUsername(e.target.value)}
                  label="Username"
                  placeholder="Enter your username"
                  disabled={resendStatus === 'loading'}
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={resendStatus === 'loading'}
                  disabled={resendStatus === 'loading' || !resendEmail.trim() || !resendUsername.trim()}
                >
                  {resendStatus === 'loading' ? 'Sending...' : 'Send Activation Email'}
                </Button>
              </form>

              {resendStatus === 'success' && (
                <div className="mt-6">
                  <Alert type="success" message={resendMessage} />
                </div>
              )}

              {resendStatus === 'error' && (
                <div className="mt-6">
                  <Alert type="error" message={resendMessage} />
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
