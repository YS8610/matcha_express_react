// src/app/page.tsx
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Heart, Loader2 } from 'lucide-react';

const WebMatchaApp = dynamic(() => import('../components/WebMatchaApp'), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Heart className="text-green-500 animate-heart-beat" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Web Matcha</h1>
        <p className="text-green-100 mb-4">Find your perfect blend</p>
        <div className="flex items-center justify-center space-x-2 text-white">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    </div>
  ),
  ssr: false
});

export default function HomePage() {
  return (
    <Suspense>
      <WebMatchaApp />
    </Suspense>
  );
}
