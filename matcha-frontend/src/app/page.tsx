'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [pingResult, setPingResult] = useState('');
  const [pinging, setPinging] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/browse');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

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
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <div className="animate-pulse">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div className="text-center">
        <button
          onClick={handlePing}
          disabled={pinging}
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full hover:from-green-700 hover:to-green-600 disabled:opacity-50 font-medium transition-all transform hover:scale-105 shadow-lg"
        >
          {pinging ? 'Pinging...' : 'Test API Connection'}
        </button>
        {pingResult && (
          <div className="mt-4 p-3 rounded-lg bg-gray-100">
            <code className="text-sm">{pingResult}</code>
          </div>
        )}

        <div className="mt-4">
          <a
            href="/token-helper"
            className="text-green-600 hover:text-green-700 hover:underline transition-colors text-sm"
          >
            🔧 Token Extraction Helper (Dev Tool)
          </a>
        </div>
      </div>
    </div>
  );
}
