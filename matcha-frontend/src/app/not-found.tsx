'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-background-secondary dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-lg opacity-30 dark:opacity-50"></div>
            <div className="relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-full p-6 border border-green-200 dark:border-green-700">
              <AlertCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto" />
            </div>
          </div>
        </div>

        <h1 className="text-7xl font-bold bg-gradient-to-r from-green-600 to-green-400 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent mb-2">
          404
        </h1>

        <h2 className="text-2xl font-bold text-foreground dark:text-white mb-3">
          Page Not Found
        </h2>

        <p className="text-foreground-secondary dark:text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 text-foreground dark:text-white border border-border dark:border-slate-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <Link
            href="/browse"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-600 dark:hover:from-green-800 dark:hover:to-green-700 transition-all transform hover:scale-105 shadow-md"
          >
            <Home className="w-4 h-4" />
            Go to Browse
          </Link>
        </div>

        <Link href="/" className="btn-secondary text-sm text-center w-full mt-8">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
