'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [error]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-background-secondary dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-full blur-lg opacity-30 dark:opacity-50"></div>
            <div className="relative bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-full p-6 border border-red-200 dark:border-red-700">
              <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto" />
            </div>
          </div>
        </div>

        <h1 className="text-7xl font-bold bg-gradient-to-r from-red-600 to-orange-400 dark:from-red-400 dark:to-orange-300 bg-clip-text text-transparent mb-2">
          500
        </h1>

        <h2 className="text-2xl font-bold text-foreground dark:text-white mb-3">
          Something Went Wrong
        </h2>

        <p className="text-foreground-secondary dark:text-gray-400 mb-6">
          We encountered an unexpected error. Our team has been notified and we're working to fix it.
        </p>

        {error.message && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-left">
            <p className="text-xs text-red-600 dark:text-red-300 font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-600 dark:hover:from-green-800 dark:hover:to-green-700 transition-all transform hover:scale-105 shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/browse"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 text-foreground dark:text-white border border-border dark:border-slate-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Browse
          </Link>
        </div>
      </div>
    </div>
  );
}
