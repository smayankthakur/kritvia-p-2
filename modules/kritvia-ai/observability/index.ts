/**
 * Kritvia Logging and Observability System
 * 
 * Centralized logging for API calls, agent actions, AI decisions, and automation triggers.
 */

export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

/** Simple logger for backward compatibility */
export const logger = {
  debug: (category: string, msg: string, ctx?: Record<string, unknown>) => 
    log(LogLevel.DEBUG, `[${category}] ${msg}`, ctx),
  info: (category: string, msg: string, ctx?: Record<string, unknown>) => 
    log(LogLevel.INFO, `[${category}] ${msg}`, ctx),
  warn: (category: string, msg: string, ctx?: Record<string, unknown>) => 
    log(LogLevel.WARN, `[${category}] ${msg}`, ctx),
  error: (category: string, msg: string, ctx?: Record<string, unknown>) => 
    log(LogLevel.ERROR, `[${category}] ${msg}`, ctx),
};

/** Log entry structure */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  duration?: number;
  error?: Error;
}

/** Log event types */
export const LogEvents = {
  // API events
  API_REQUEST: 'api_request',
  API_RESPONSE: 'api_response',
  API_ERROR: 'api_error',
  
  // Agent events
  AGENT_START: 'agent_start',
  AGENT_COMPLETE: 'agent_complete',
  AGENT_ERROR: 'agent_error',
  
  // AI events
  AI_DECISION: 'ai_decision',
  AI_ANALYSIS: 'ai_analysis',
  AI_PREDICTION: 'ai_prediction',
  
  // Automation events
  AUTOMATION_TRIGGER: 'automation_trigger',
  AUTOMATION_EXECUTE: 'automation_execute',
  AUTOMATION_COMPLETE: 'automation_complete',
  AUTOMATION_ERROR: 'automation_error',
} as const;

export type LogEvent = typeof LogEvents[keyof typeof LogEvents];

/** In-memory log storage for development */
const logStorage: LogEntry[] = [];
const MAX_LOG_ENTRIES = 1000;

/**
 * Core logging function
 */
export function log(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: Error
): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    error,
  };
  
  // Store in memory
  logStorage.push(entry);
  if (logStorage.length > MAX_LOG_ENTRIES) {
    logStorage.shift();
  }
  
  // Console output (would use proper logger in production)
  const logFn = level === LogLevel.ERROR ? console.error : 
                 level === LogLevel.WARN ? console.warn :
                 level === LogLevel.DEBUG ? console.debug : console.log;
  
  logFn(`[${level.toUpperCase()}] ${message}`, context || '');
  
  if (error) {
    console.error(error);
  }
  
  return entry;
}

/**
 * Log API request
 */
export function logAPIRequest(
  endpoint: string,
  method: string,
  params?: Record<string, unknown>
): LogEntry {
  return log(LogLevel.INFO, `API Request: ${method} ${endpoint}`, {
    event: LogEvents.API_REQUEST,
    endpoint,
    method,
    params,
  });
}

/**
 * Log API response
 */
export function logAPIResponse(
  endpoint: string,
  statusCode: number,
  duration: number,
  params?: Record<string, unknown>
): LogEntry {
  const level = statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO;
  return log(level, `API Response: ${endpoint}`, {
    event: LogEvents.API_RESPONSE,
    endpoint,
    statusCode,
    duration,
    params,
  });
}

/**
 * Log agent action
 */
export function logAgentAction(
  agentType: string,
  action: string,
  context?: Record<string, unknown>
): LogEntry {
  return log(LogLevel.INFO, `Agent: ${agentType} - ${action}`, {
    event: LogEvents.AGENT_START,
    agentType,
    action,
    ...context,
  });
}

/**
 * Log AI decision
 */
export function logAIDecision(
  decisionType: string,
  result: unknown,
  confidence?: number,
  context?: Record<string, unknown>
): LogEntry {
  return log(LogLevel.INFO, `AI Decision: ${decisionType}`, {
    event: LogEvents.AI_DECISION,
    decisionType,
    confidence,
    result,
    ...context,
  });
}

/**
 * Log automation trigger
 */
export function logAutomationTrigger(
  automationId: string,
  triggerType: string,
  context?: Record<string, unknown>
): LogEntry {
  return log(LogLevel.INFO, `Automation Trigger: ${automationId}`, {
    event: LogEvents.AUTOMATION_TRIGGER,
    automationId,
    triggerType,
    ...context,
  });
}

/**
 * Log error with context
 */
export function logError(
  message: string,
  error: Error,
  context?: Record<string, unknown>
): LogEntry {
  return log(LogLevel.ERROR, message, context, error);
}

/**
 * Get recent logs
 */
export function getRecentLogs(level?: LogLevel, limit: number = 100): LogEntry[] {
  let logs = logStorage;
  if (level) {
    logs = logs.filter(l => l.level === level);
  }
  return logs.slice(-limit);
}

/**
 * Clear logs
 */
export function clearLogs(): void {
  logStorage.length = 0;
}

/**
 * Performance timing helper
 */
export function timing<T>(
  label: string,
  fn: () => Promise<T> | T
): Promise<T> {
  const start = Date.now();
  return Promise.resolve(fn()).then(result => {
    const duration = Date.now() - start;
    log(LogLevel.DEBUG, `Performance: ${label}`, { duration });
    return result;
  });
}
