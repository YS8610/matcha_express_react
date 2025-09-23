'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      router.push('/browse');
    } catch (err: unknown) {
      setError((err as Error).message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1 text-green-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Enter your username"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-green-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded-full hover:from-green-700 hover:to-green-600 disabled:opacity-50 font-medium transition-all transform hover:scale-105 shadow-lg"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="text-center text-sm">
          {`Don't have an account? `}
          <Link href="/register" className="text-green-600 hover:text-green-700 hover:underline transition-colors">
            Register
          </Link>
        </div>

        <div className="text-center text-sm">
          <Link href="/reset-password" className="text-green-600 hover:text-green-700 hover:underline transition-colors">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}
