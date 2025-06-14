// src/components/auth/ForgotPassword.tsx
import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import * as api from '../../utils/api';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      await api.forgotPassword(email);
      setIsSuccess(true);
      setMessage('Password reset link sent to your email!');
    } catch (error) {
      setMessage('Failed to send reset email. Please check your email address.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Login
        </button>

        <div className="text-center mb-8">
          <Mail className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-4 ${
            isSuccess 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              disabled={isLoading}
              required
            />
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {isSuccess && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Check your email for the password reset link. It may take a few minutes to arrive.
            </p>
            <button
              onClick={onBack}
              className="text-pink-500 hover:text-pink-600"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
