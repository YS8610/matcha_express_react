'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Home, ArrowLeft } from 'lucide-react';

export default function Forbidden() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-background-secondary dark:bg-slate-900">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full blur-lg opacity-30 dark:opacity-50"></div>
            <div className="relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full p-6 border border-purple-200 dark:border-purple-700">
              <Shield className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto" />
            </div>
          </div>
        </div>

        <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent mb-2">
          403
        </h1>

        <h2 className="text-2xl font-bold text-foreground dark:text-white mb-3">
          Access Denied
        </h2>

        <p className="text-foreground-secondary dark:text-gray-400 mb-8">
          You don't have permission to access this resource. This action is restricted to authorized users only.
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
      </div>
    </div>
  );
}
