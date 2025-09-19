'use client';

import { useHealthCheck } from '@/hooks/useHealthCheck';
import { useEffect, useState } from 'react';

export function HealthStatusBanner() {
  const { healthStatus, checkNow } = useHealthCheck(30000);
  const [isVisible, setIsVisible] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    setIsVisible(healthStatus ? !healthStatus.isHealthy : false);
  }, [healthStatus]);

  const handleRetry = async () => {
    setIsRetrying(true);
    await checkNow();
    setIsRetrying(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[2000] bg-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <span className="font-semibold">Backend Connection Error</span>
                {healthStatus?.error && (
                  <span className="text-sm ml-2 opacity-90">
                    ({healthStatus.error})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs opacity-75">
              Last check: {healthStatus ? new Date(healthStatus.timestamp).toLocaleTimeString() : 'Never'}
            </span>
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="px-3 py-1 bg-white text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRetrying ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Retrying...
                </span>
              ) : (
                'Retry'
              )}
            </button>
          </div>
        </div>

        <div className="mt-2 text-sm">
          <p>
            Unable to connect to the backend service. Some features may be unavailable.
            {' '}Please check your connection or try again later.
          </p>
        </div>
      </div>
    </div>
  );
}