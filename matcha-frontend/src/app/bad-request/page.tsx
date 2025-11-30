'use client';

import { Suspense } from 'react';
import BadRequestContent from './content';

export default function BadRequest() {
  return (
    <Suspense fallback={<BadRequestFallback />}>
      <BadRequestContent />
    </Suspense>
  );
}

function BadRequestFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-background-secondary dark:bg-slate-900">
      <div className="max-w-md w-full text-center">
        <div className="animate-pulse">
          <div className="w-24 h-24 bg-gradient-to-r from-yellow-200 to-orange-200 dark:from-yellow-900/40 dark:to-orange-900/40 rounded-full mx-auto mb-6"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>
        </div>
      </div>
    </div>
  );
}
