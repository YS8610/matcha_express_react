// src/components/auth/EmailVerification.tsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Mail, Loader2 } from 'lucide-react';
import * as api from '../../utils/api';

interface EmailVerificationProps {
  token?: string;
  onVerified: () => void;
  onResendEmail: (email: string) => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ 
  token, 
  onVerified, 
  onResendEmail 
}) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('pending');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setStatus('loading');
    try {
      await api.verifyEmail(verificationToken);
      setStatus('success');
      setMessage('Your email has been verified successfully!');
      setTimeout(() => {
        onVerified();
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage('Invalid or expired verification link.');
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setIsResending(true);
    try {
      await onResendEmail(email);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setMessage('Failed to send verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <Loader2 className="w-16 h-16 text-pink-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Email</h2>
          <p className="text-gray-600">Please wait while we verify your email address...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <p className="text-sm text-gray-500">Redirecting to your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        {status === 'error' ? (
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        ) : (
          <Mail className="w-16 h-16 text-pink-500 mx-auto mb-4" />
        )}
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {status === 'error' ? 'Verification Failed' : 'Check Your Email'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {status === 'error' 
            ? message 
            : 'We sent you a verification link. Please check your email and click the link to verify your account.'
          }
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          
          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            {isResending ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>

        {message && status === 'pending' && (
          <p className="mt-4 text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
