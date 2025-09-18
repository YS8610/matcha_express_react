export interface HealthCheckResult {
  isHealthy: boolean;
  message?: string;
  timestamp: number;
  error?: string;
}

class HealthCheckService {
  private checkInterval: NodeJS.Timeout | null = null;
  private lastResult: HealthCheckResult | null = null;
  private listeners: Set<(result: HealthCheckResult) => void> = new Set();

  async checkHealth(): Promise<HealthCheckResult> {
    const timestamp = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/pubapi/ping', {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const result: HealthCheckResult = {
          isHealthy: true,
          message: data.msg || 'Backend is operational',
          timestamp,
        };
        this.lastResult = result;
        this.notifyListeners(result);
        return result;
      } else {
        const result: HealthCheckResult = {
          isHealthy: false,
          message: 'Backend service unavailable',
          error: `HTTP ${response.status}: ${response.statusText}`,
          timestamp,
        };
        this.lastResult = result;
        this.notifyListeners(result);
        return result;
      }
    } catch (error) {
      const result: HealthCheckResult = {
        isHealthy: false,
        message: 'Cannot connect to backend',
        error: error instanceof Error ? error.message : 'Connection failed',
        timestamp,
      };
      this.lastResult = result;
      this.notifyListeners(result);
      return result;
    }
  }

  startMonitoring(intervalMs: number = 30000): void {
    if (this.checkInterval) {
      this.stopMonitoring();
    }

    this.checkHealth();

    this.checkInterval = setInterval(() => {
      this.checkHealth();
    }, intervalMs);
  }

  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  subscribe(callback: (result: HealthCheckResult) => void): () => void {
    this.listeners.add(callback);

    if (this.lastResult) {
      callback(this.lastResult);
    }

    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(result: HealthCheckResult): void {
    this.listeners.forEach(callback => callback(result));
  }

  getLastResult(): HealthCheckResult | null {
    return this.lastResult;
  }
}

export const healthCheckService = new HealthCheckService();