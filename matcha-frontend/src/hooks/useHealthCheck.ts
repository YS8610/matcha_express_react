'use client';

import { useState, useEffect } from 'react';
import { healthCheckService, HealthCheckResult } from '@/services/healthCheck';

export function useHealthCheck(intervalMs: number = 30000) {
  const [healthStatus, setHealthStatus] = useState<HealthCheckResult | null>(null);

  useEffect(() => {
    healthCheckService.startMonitoring(intervalMs);

    const unsubscribe = healthCheckService.subscribe((result) => {
      setHealthStatus(result);
    });

    return () => {
      unsubscribe();
      healthCheckService.stopMonitoring();
    };
  }, [intervalMs]);

  const checkNow = async () => {
    const result = await healthCheckService.checkHealth();
    setHealthStatus(result);
    return result;
  };

  return {
    healthStatus,
    checkNow,
    isHealthy: healthStatus?.isHealthy ?? true,
  };
}