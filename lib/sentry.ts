import * as Sentry from '@sentry/nextjs'

// Initialize Sentry
export function initSentry() {
  const sentryDsn = process.env.SENTRY_DSN
  
  if (!sentryDsn) {
    console.warn('⚠️ SENTRY_DSN not set - error tracking disabled')
    return
  }

  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.NODE_ENV,
    
    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Session replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Integrations
    integrations: [
      Sentry.replayIntegration(),
      Sentry.browserTracingIntegration(),
    ],
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    
    // Filter events
    beforeSend(event, hint) {
      // Filter out certain errors
      const error = hint.originalException
      
      // Don't send network errors from health checks
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return null
      }
      
      return event
    },
  })
}

// Capture custom error
export function captureError(error: Error, context?: Record<string, any>) {
  if (context) {
    Sentry.setContext('additional', context)
  }
  Sentry.captureException(error)
}

// Capture custom message
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level)
}

// Set user context
export function setUser(user: { id: string; email?: string } | null) {
  if (user) {
    Sentry.setUser({ id: user.id, email: user.email })
  } else {
    Sentry.setUser(null)
  }
}

// Add breadcrumb
export function addBreadcrumb(
  message: string,
  category: string,
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  })
}

// Performance monitoring helpers
export function startTransaction(name: string, op: string) {
  return Sentry.startSpan({ name, op }, () => {})
}

// API route wrapper for error tracking
export function withSentry<T>(fn: () => Promise<T>): Promise<T> {
  return Sentry.startSpan({ name: fn.name || 'anonymous', op: 'function' }, fn)
}
