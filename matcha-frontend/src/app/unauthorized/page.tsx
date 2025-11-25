'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Home, LogIn } from 'lucide-react';

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-background-secondary dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-lg opacity-30 dark:opacity-50"></div>
            <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full p-6 border border-blue-200 dark:border-blue-700">
              <Lock className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto" />
            </div>
          </div>
        </div>

        <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent mb-2">
          401
        </h1>

        <h2 className="text-2xl font-bold text-foreground dark:text-white mb-3">
          Unauthorized
        </h2>

        <p className="text-foreground-secondary dark:text-gray-400 mb-8">
          You need to log in to access this page. Please sign in with your credentials.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-600 dark:hover:from-green-800 dark:hover:to-green-700 transition-all transform hover:scale-105 shadow-md"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>

          <Link
            href="/register"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 text-foreground dark:text-white border border-border dark:border-slate-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            Create Account
          </Link>
        </div>

        <p className="text-sm text-text-muted dark:text-gray-500 mt-8">
          <button
            onClick={() => router.back()}
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            Go back
          </button>
          {' '}or visit our{' '}
          <Link href="/" className="text-green-600 dark:text-green-400 hover:underline">home page</Link>
        </p>
      </div>
    </div>
  );
}
