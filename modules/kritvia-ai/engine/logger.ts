/**
 * Logging Service - Observability
 * 
 * Provides structured logging for AI requests, agent selection,
 * decision output, and action execution.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  category: string;
  message: string;
  metadata?: Record<string, unknown>;
}

// In-memory log storage (in production, use a proper logging service)
const logs: LogEntry[] = [];
const MAX_LOGS = 10000;

/**
 * Create a log entry
 */
function createLogEntry(
  level: LogLevel,
  category: string,
  message: string,
  metadata?: Record<string, unknown>
): LogEntry {
  const entry: LogEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    level,
    category,
    message,
    metadata,
  };

  // Add to storage
  logs.push(entry);
  
  // Trim if exceeds max
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }

  // Console output for development
  const color = getLevelColor(level);
  console.log(
    `%c[${category}]%c ${message}`,
    `color: ${color}; font-weight: bold`,
    'color: inherit',
    metadata ? JSON.stringify(metadata) : ''
  );

  return entry;
}

/**
 * Get color for log level
 */
function getLevelColor(level: LogLevel): string {
  const colors: Record<LogLevel, string> = {
    debug: '#888',
    info: '#2196F3',
    warn: '#FF9800',
    error: '#F44336',
  };
  return colors[level];
}

/**
 * Log debug message
 */
export function debug(category: string, message: string, metadata?: Record<string, unknown>): LogEntry {
  return createLogEntry('debug', category, message, metadata);
}

/**
 * Log info message
 */
export function info(category: string, message: string, metadata?: Record<string, unknown>): LogEntry {
  return createLogEntry('info', category, message, metadata);
}

/**
 * Log warning message
 */
export function warn(category: string, message: string, metadata?: Record<string, unknown>): LogEntry {
  return createLogEntry('warn', category, message, metadata);
}

/**
 * Log error message
 */
export function error(category: string, message: string, metadata?: Record<string, unknown>): LogEntry {
  return createLogEntry('error', category, message, metadata);
}

/**
 * Get logs by category
 */
export function getLogsByCategory(category: string, limit: number = 100): LogEntry[] {
  return logs
    .filter(log => log.category === category)
    .slice(-limit);
}

/**
 * Get recent logs
 */
export function getRecentLogs(limit: number = 100): LogEntry[] {
  return logs.slice(-limit);
}

/**
 * Clear logs
 */
export function clearLogs(): void {
  logs.length = 0;
}

/**
 * Get logs by level
 */
export function getLogsByLevel(level: LogLevel, limit: number = 100): LogEntry[] {
  return logs
    .filter(log => log.level === level)
    .slice(-limit);
}

// Pre-configured loggers for common categories
export const aiLogger = {
  request: (message: string, metadata?: Record<string, unknown>) => 
    info('AI_REQUEST', message, metadata),
  response: (message: string, metadata?: Record<string, unknown>) => 
    info('AI_RESPONSE', message, metadata),
  error: (message: string, metadata?: Record<string, unknown>) => 
    error('AI_ERROR', message, metadata),
};

export const agentLogger = {
  selection: (agent: string, reason: string) => 
    info('AGENT', `Selected: ${agent} - ${reason}`),
  execution: (agent: string, status: string) => 
    info('AGENT', `Agent ${agent}: ${status}`),
  error: (agent: string, errMsg: string) => 
    error('AGENT_ERROR', `Agent ${agent}: ${errMsg}`),
};

export const decisionLogger = {
  input: (context: Record<string, unknown>) => 
    debug('DECISION', 'Processing decision request', context),
  output: (decision: string, confidence: number) => 
    info('DECISION', `Decision: ${decision} (${confidence}% confidence)`),
  error: (errMsg: string) => 
    error('DECISION_ERROR', errMsg),
};

export const actionLogger = {
  execution: (action: string, target: string) => 
    info('ACTION', `Executing: ${action} on ${target}`),
  success: (actionId: string) => 
    info('ACTION', `Action completed: ${actionId}`),
  failure: (actionId: string, errMsg: string) => 
    error('ACTION_ERROR', `Action failed: ${actionId}`, { error: errMsg }),
};

export default {
  debug,
  info,
  warn,
  error,
  getLogsByCategory,
  getRecentLogs,
  getLogsByLevel,
  clearLogs,
  aiLogger,
  agentLogger,
  decisionLogger,
  actionLogger,
};
