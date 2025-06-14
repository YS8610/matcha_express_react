// src/app.page.tsx
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Heart, Loader2 } from 'lucide-react';

const WebMatchaApp = dynamic(() => import('../components/WebMatchaApp'), {
  loading: () => <AppLoading />,
  ssr: false, 
});

function AppLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="text-pink-500 animate-heart-beat" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Web Matcha</h1>
          <p className="text-white/80">Find your perfect match</p>
        </div>

        <div className="flex items-center justify-center space-x-2 text-white">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-lg">Loading...</span>
        </div>

        <div className="flex space-x-2 mt-6 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white/50 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AppErrorFallback() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">😞</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We're having trouble loading Web Matcha. Please try refreshing the page.
        </p>
        <button
          onClick={handleReload}
          className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

function useErrorHandler() {
  const handleError = (error: Error, errorInfo: any) => {
    console.error('App Error:', error, errorInfo);
    
    if (process.env.NODE_ENV === 'production') {
    }
  };

  return handleError;
}

export default function HomePage() {
  const handleError = useErrorHandler();

  const checkBrowserSupport = () => {
    if (typeof window === 'undefined') return true;

    const required = [
      'localStorage',
      'fetch',
      'Promise',
      'WebSocket'
    ];

    return required.every(feature => feature in window);
  };

  if (typeof window !== 'undefined' && !checkBrowserSupport()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Browser Not Supported</h2>
          <p className="text-gray-600 mb-6">
            Web Matcha requires a modern browser. Please update your browser or try using Chrome, Firefox, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<AppLoading />}>
      <ErrorBoundaryWrapper>
        <WebMatchaApp />
      </ErrorBoundaryWrapper>
    </Suspense>
  );
}

function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Error rendering app:', error);
    return <AppErrorFallback />;
  }
}
