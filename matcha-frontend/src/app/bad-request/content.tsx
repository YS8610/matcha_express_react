'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function BadRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'The request could not be processed. Please check your input and try again.';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-background-secondary dark:bg-slate-900">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full blur-lg opacity-30 dark:opacity-50"></div>
            <div className="relative bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/30 dark:to-orange-800/30 rounded-full p-6 border border-yellow-200 dark:border-yellow-700">
              <AlertCircle className="w-16 h-16 text-yellow-600 dark:text-yellow-400 mx-auto" />
            </div>
          </div>
        </div>

        <h1 className="text-7xl font-bold bg-gradient-to-r from-yellow-600 to-orange-400 dark:from-yellow-400 dark:to-orange-300 bg-clip-text text-transparent mb-2">
          400
        </h1>

        <h2 className="text-2xl font-bold text-foreground dark:text-white mb-3">
          Bad Request
        </h2>

        <p className="text-foreground-secondary dark:text-gray-400 mb-8">
          {message}
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
