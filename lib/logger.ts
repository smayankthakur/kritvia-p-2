// Production logging utility with structured logging

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const CURRENT_LEVEL = process.env.LOG_LEVEL 
  ? parseInt(process.env.LOG_LEVEL) 
  : LogLevel.INFO

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` ${JSON.stringify(context)}` : ''
    return `[${timestamp}] [${level}] ${message}${contextStr}`
  }

  debug(message: string, context?: LogContext): void {
    if (CURRENT_LEVEL <= LogLevel.DEBUG) {
      console.debug(this.formatMessage('DEBUG', message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    if (CURRENT_LEVEL <= LogLevel.INFO) {
      console.log(this.formatMessage('INFO', message, context))
    }
  }

  warn(message: string, context?: LogContext): void {
    if (CURRENT_LEVEL <= LogLevel.WARN) {
      console.warn(this.formatMessage('WARN', message, context))
    }
  }

  error(message: string, error?: Error | LogContext): void {
    if (CURRENT_LEVEL <= LogLevel.ERROR) {
      const context = error instanceof Error 
        ? { message: error.message, stack: error.stack }
        : error
      console.error(this.formatMessage('ERROR', message, context))
    }
  }

  // API request logging helper
  logAPIRequest(method: string, path: string, userId?: string, duration?: number): void {
    this.info('API Request', { method, path, userId, duration })
  }

  // Database operation logging
  logDBOperation(operation: string, table: string, success: boolean, duration?: number): void {
    this.info('DB Operation', { operation, table, success, duration })
  }

  // Authentication logging
  logAuth(action: string, userId: string, success: boolean, ip?: string): void {
    this.info('Auth Event', { action, userId, success, ip })
  }

  // Rate limit logging
  logRateLimit(userId: string, endpoint: string, limit: number): void {
    this.warn('Rate limit exceeded', { userId, endpoint, limit })
  }
}

export const logger = new Logger()

// Request ID middleware helper
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
