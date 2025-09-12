'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function HealthCheck() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    setStatus('checking');
    try {
      await api.ping();
      setStatus('online');
      setLastChecked(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
      setStatus('offline');
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center space-x-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${
        status === 'online' ? 'bg-green-500' : 
        status === 'offline' ? 'bg-red-500' : 
        'bg-yellow-500 animate-pulse'
      }`} />
      <span className="text-gray-600">
        API {status === 'checking' ? 'Checking...' : status}
      </span>
      {lastChecked && (
        <span className="text-gray-400 text-xs">
          ({lastChecked.toLocaleTimeString()})
        </span>
      )}
    </div>
  );
}