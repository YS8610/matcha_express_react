'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [pingResult, setPingResult] = useState('');
  const [pinging, setPinging] = useState(false);

  useEffect(() => {
    if (!loading && pathname === '/') {
      if (user) {
        router.replace('/browse');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router, pathname]);

  const handlePing = async () => {
    setPinging(true);
    setPingResult('');
    try {
      const response = await api.ping();
      setPingResult(`API Connected: ${response.msg}`);
    } catch (error) {
      setPingResult(`API Error: ${error instanceof Error ? error.message : 'Failed to connect'}`);
    } finally {
      setPinging(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-b from-transparent via-transparent to-transparent">
      <div className="animate-pulse">
        <div className="w-16 h-16 border-4 border-matcha-medium dark:border-matcha-accent border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div className="text-center">
        <button
          onClick={handlePing}
          disabled={pinging}
          className="px-6 py-2 bg-gradient-to-r from-matcha-medium to-matcha-light text-white rounded-full hover:from-matcha-dark hover:to-matcha-medium disabled:opacity-50 font-medium transition-all transform hover:scale-105 shadow-lg"
        >
          {pinging ? 'Pinging...' : 'Test API Connection'}
        </button>
        {pingResult && (
          <div className="mt-4 p-3 rounded-lg bg-matcha-cream dark:bg-background-secondary border border-border dark:border-border">
            <code className="text-sm text-foreground dark:text-foreground">{pingResult}</code>
          </div>
        )}

      </div>
    </div>
  );
}
