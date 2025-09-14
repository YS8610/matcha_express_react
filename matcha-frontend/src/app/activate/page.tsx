'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ActivatePage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleActivate = async () => {
    setLoading(true);
    setMessage('');
    try {
      const token = btoa(JSON.stringify({ username, email }));

      const response = await api.activateAccount(token);
      setMessage('Account activated successfully!');

      setTimeout(() => {
        router.push('/profile/setup');
      }, 2000);
    } catch (error) {
      setMessage('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
          Activate Account
        </h1>
        <p className="text-gray-600 mb-6">
          Enter your registration details to activate your account.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1 text-green-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-green-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            onClick={handleActivate}
            disabled={loading || !username || !email}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded-full hover:from-green-700 hover:to-green-600 disabled:opacity-50 font-medium transition-all transform hover:scale-105 shadow-lg"
          >
            {loading ? 'Activating...' : 'Activate Account'}
          </button>

          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.startsWith('Error')
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          WIP email, for now manual activate.
        </div>
      </div>
    </div>
  );
}
