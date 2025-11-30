'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Filter } from 'lucide-react';

const UserMap = lazy(() => import('@/components/map/UserMap'));

export default function MapPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [center, setCenter] = useState<[number, number]>([48.8566, 2.3522]); // Default: Paris

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && !user.profileComplete) {
      router.push('/profile/setup');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 dark:border-green-400 border-t-transparent mb-4"></div>
          <p className="text-green-700 dark:text-green-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.profileComplete) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-green-600 to-green-500 p-3 rounded-full">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Discover on Map
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Explore users around you in real-time
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-green-100 dark:border-green-900 mb-8">
          <Suspense fallback={<div className="w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 dark:border-green-400 border-t-transparent mb-4"></div><p className="text-gray-600 dark:text-gray-400">Loading map...</p></div></div>}>
            <UserMap center={center} zoom={10} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
