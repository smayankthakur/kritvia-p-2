/**
 * Kritvia AI Observability Module
 * 
 * Comprehensive logging, metrics, and monitoring for AI operations.
 */

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  source: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface Metric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

export interface HealthCheck {
  component: string;
  status: 'healthy' | 'degraded' | 'down';
  message?: string;
  lastCheck: Date;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  requestsPerMinute: number;
  avgResponseTime: number;
  errorRate: number;
  activeAgents: number;
  queuedTasks: number;
}

class KritviaLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 10000;
  private listeners: Array<(log: LogEntry) => void> = [];

  /**
   * Log a message
   */
  log(
    level: LogEntry['level'],
    source: string,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    const entry: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      timestamp: new Date(),
      level,
      source,
      message,
      metadata,
    };
    
    this.logs.push(entry);
    
    // Trim logs if needed
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    // Notify listeners
    this.listeners.forEach(listener => listener(entry));
    
    // Console output
    const prefix = `[${source}]`;
    switch (level) {
      case 'debug':
        console.debug(prefix, message, metadata || '');
        break;
      case 'info':
        console.info(prefix, message, metadata || '');
        break;
      case 'warn':
        console.warn(prefix, message, metadata || '');
        break;
      case 'error':
        console.error(prefix, message, metadata || '');
        break;
    }
  }

  debug(source: string, message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', source, message, metadata);
  }

  info(source: string, message: string, metadata?: Record<string, unknown>): void {
    this.log('info', source, message, metadata);
  }

  warn(source: string, message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', source, message, metadata);
  }

  error(source: string, message: string, metadata?: Record<string, unknown>): void {
    this.log('error', source, message, metadata);
  }

  /**
   * Get recent logs
   */
  getLogs(options?: {
    level?: LogEntry['level'];
    source?: string;
    limit?: number;
    since?: Date;
  }): LogEntry[] {
    let filtered = this.logs;
    
    if (options?.level) {
      filtered = filtered.filter(l => l.level === options.level);
    }
    
    if (options?.source) {
      filtered = filtered.filter(l => l.source === options.source);
    }
    
    if (options?.since) {
      filtered = filtered.filter(l => l.timestamp >= options.since!);
    }
    
    const limit = options?.limit || 100;
    return filtered.slice(-limit);
  }

  /**
   * Add log listener
   */
  addListener(callback: (log: LogEntry) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  /**
   * Clear logs
   */
  clear(): void {
    this.logs = [];
  }
}

class MetricsCollector {
  private metrics: Map<string, Metric[]> = new Map();
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();
  private maxMetricsPerName = 1000;

  /**
   * Record a counter metric
   */
  incrementCounter(name: string, value = 1, tags?: Record<string, string>): void {
    const key = this.getKey(name, tags);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);
    
    this.recordMetric(name, current + value, 'count', tags);
  }

  /**
   * Record a gauge metric
   */
  setGauge(name: string, value: number, tags?: Record<string, string>): void {
    const key = this.getKey(name, tags);
    this.gauges.set(key, value);
    
    this.recordMetric(name, value, 'gauge', tags);
  }

  /**
   * Record a histogram value
   */
  recordHistogram(name: string, value: number, tags?: Record<string, string>): void {
    const key = this.getKey(name, tags);
    const values = this.histograms.get(key) || [];
    values.push(value);
    
    // Keep only recent values
    if (values.length > 100) values.shift();
    this.histograms.set(key, values);
    
    this.recordMetric(name, value, 'histogram', tags);
  }

  /**
   * Record a metric
   */
  private recordMetric(name: string, value: number, unit: string, tags?: Record<string, string>): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const metric: Metric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      tags,
    };
    
    const metrics = this.metrics.get(name)!;
    metrics.push(metric);
    
    // Trim
    if (metrics.length > this.maxMetricsPerName) {
      metrics.shift();
    }
  }

  /**
   * Get metric by name
   */
  getMetric(name: string, limit = 100): Metric[] {
    return (this.metrics.get(name) || []).slice(-limit);
  }

  /**
   * Get counter value
   */
  getCounter(name: string, tags?: Record<string, string>): number {
    const key = this.getKey(name, tags);
    return this.counters.get(key) || 0;
  }

  /**
   * Get gauge value
   */
  getGauge(name: string, tags?: Record<string, string>): number {
    const key = this.getKey(name, tags);
    return this.gauges.get(key) || 0;
  }

  /**
   * Get histogram statistics
   */
  getHistogramStats(name: string, tags?: Record<string, string>): {
    count: number;
    sum: number;
    avg: number;
    min: number;
    max: number;
    p50: number;
    p95: number;
    p99: number;
  } | null {
    const key = this.getKey(name, tags);
    const values = this.histograms.get(key);
    
    if (!values || values.length === 0) return null;
    
    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      count: values.length,
      sum,
      avg: sum / values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  /**
   * Get all metrics summary
   */
  getSummary(): Record<string, unknown> {
    const summary: Record<string, unknown> = {};
    
    for (const name of Array.from(this.histograms.keys())) {
      const stats = this.getHistogramStats(name);
      if (stats) {
        summary[name] = stats;
      }
    }
    
    return summary;
  }

  /**
   * Generate metric key
   */
  private getKey(name: string, tags?: Record<string, string>): string {
    if (!tags) return name;
    const tagStr = Object.entries(tags).sort().map(([k, v]) => `${k}:${v}`).join(',');
    return `${name}{${tagStr}}`;
  }
}

class HealthMonitor {
  private checks: Map<string, HealthCheck> = new Map();

  /**
   * Register a health check
   */
  registerCheck(
    component: string,
    check: () => Promise<{ status: HealthCheck['status']; message?: string }>
  ): void {
    const runCheck = async () => {
      const result = await check();
      this.checks.set(component, {
        component,
        status: result.status,
        message: result.message,
        lastCheck: new Date(),
      });
    };
    
    // Run immediately
    runCheck();
    
    // Run every 30 seconds
    setInterval(runCheck, 30000);
  }

  /**
   * Get all health checks
   */
  getHealthChecks(): HealthCheck[] {
    return Array.from(this.checks.values());
  }

  /**
   * Get overall health status
   */
  getOverallStatus(): 'healthy' | 'degraded' | 'down' {
    const checks = this.getHealthChecks();
    
    if (checks.some(c => c.status === 'down')) return 'down';
    if (checks.some(c => c.status === 'degraded')) return 'degraded';
    return 'healthy';
  }
}

// Export singletons
export const logger = new KritviaLogger();
export const metrics = new MetricsCollector();
export const healthMonitor = new HealthMonitor();

/**
 * Create a logger for a specific module
 */
export function createLogger(source: string) {
  return {
    debug: (message: string, metadata?: Record<string, unknown>) => 
      logger.debug(source, message, metadata),
    info: (message: string, metadata?: Record<string, unknown>) => 
      logger.info(source, message, metadata),
    warn: (message: string, metadata?: Record<string, unknown>) => 
      logger.warn(source, message, metadata),
    error: (message: string, metadata?: Record<string, unknown>) => 
      logger.error(source, message, metadata),
  };
}

/**
 * Get system metrics
 */
export async function getSystemMetrics(): Promise<SystemMetrics> {
  // Simulated metrics
  return {
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    requestsPerMinute: Math.floor(Math.random() * 1000),
    avgResponseTime: Math.random() * 500,
    errorRate: Math.random() * 5,
    activeAgents: 4,
    queuedTasks: Math.floor(Math.random() * 50),
  };
}

export default {
  logger,
  metrics,
  healthMonitor,
  createLogger,
  getSystemMetrics,
};
