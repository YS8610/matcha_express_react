'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && pathname === '/') {
      if (user) {
        router.replace('/browse');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router, pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-b from-transparent via-transparent to-transparent">
      <div className="animate-pulse">
        <div className="w-16 h-16 border-4 border-matcha-medium dark:border-matcha-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
