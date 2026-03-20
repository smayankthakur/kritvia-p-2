/**
 * Global API Error Handler
 * Consistent error handling for all API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { logger, generateRequestId } from './logger'

export type ErrorCode = 
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'BAD_REQUEST'
  | 'SERVICE_UNAVAILABLE'

export interface APIError {
  error: string
  code: ErrorCode
  requestId: string
  details?: Record<string, unknown>
  timestamp: string
}

/**
 * Create error response
 */
export function errorResponse(
  message: string,
  code: ErrorCode,
  status: number,
  details?: Record<string, unknown>,
  requestId?: string
): NextResponse<APIError> {
  const id = requestId || generateRequestId()
  
  const body: APIError = {
    error: message,
    code,
    requestId: id,
    details: details as Record<string, unknown> | undefined,
    timestamp: new Date().toISOString(),
  }

  logger.error(`API Error: ${code}`, { 
    message, 
    code, 
    status,
    requestId: id,
    ...(details && { details }) 
  })

  return NextResponse.json(body, { status })
}

/**
 * Handle known error types
 */
export function handleError(error: unknown, requestId?: string): NextResponse<APIError> {
  const id = requestId || generateRequestId()

  // Zod validation errors
  if (error instanceof ZodError) {
    return errorResponse(
      'Validation failed',
      'VALIDATION_ERROR',
      400,
      { errors: error.issues },
      id
    )
  }

  // Custom API errors
  if (error instanceof APIErrorException) {
    return errorResponse(
      error.message,
      error.code,
      error.status,
      error.details,
      id
    )
  }

  // Authentication errors
  if (error instanceof AuthError) {
    return errorResponse(
      error.message,
      error.code,
      error.status,
      undefined,
      id
    )
  }

  // Rate limit errors
  if (error instanceof RateLimitError) {
    return errorResponse(
      error.message,
      'RATE_LIMITED',
      429,
      { retryAfter: error.retryAfter },
      id
    )
  }

  // Default to internal error
  const message = error instanceof Error ? error.message : 'An unexpected error occurred'
  
  return errorResponse(
    'Internal server error',
    'INTERNAL_ERROR',
    500,
    process.env.NODE_ENV === 'development' ? { message } : undefined,
    id
  )
}

/**
 * Custom API Error Exception
 */
export class APIErrorException extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public status: number,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Authentication Error
 */
export class AuthError extends Error {
  constructor(message: string, public code: ErrorCode = 'UNAUTHORIZED') {
    super(message)
    this.name = 'AuthError'
    this.status = code === 'FORBIDDEN' ? 403 : 401
  }
  status: number = 401
}

/**
 * Rate Limit Error
 */
export class RateLimitError extends Error {
  constructor(message: string = 'Too many requests', public retryAfter: number = 60) {
    super(message)
    this.name = 'RateLimitError'
  }
}

/**
 * Validation Error
 */
export class ValidationError extends Error {
  constructor(message: string, public details?: Record<string, unknown>) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

/**
 * Async wrapper for API route handlers
 */
export function withErrorHandling(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const requestId = generateRequestId()
    
    try {
      // Add request ID to headers for tracking
      const response = await handler(req)
      response.headers.set('x-request-id', requestId)
      return response
    } catch (error) {
      return handleError(error, requestId)
    }
  }
}

/**
 * Require authentication middleware
 */
export async function requireAuth(req: NextRequest): Promise<{ userId: string }> {
  const authHeader = req.headers.get('authorization')
  
  if (!authHeader) {
    throw new AuthError('Missing authorization header')
  }

  // In production, verify the token with Supabase
  // For now, we'll extract user ID from the header
  // This would typically call: supabase.auth.getUser()
  
  return { userId: 'authenticated-user' }
}

/**
 * Require specific role
 */
export async function requireRole(req: NextRequest, allowedRoles: string[]): Promise<void> {
  const { userId } = await requireAuth(req)
  
  // In production, check user's role from database
  // For now, this is a placeholder
  
  if (!allowedRoles.includes('member')) {
    throw new AuthError('Insufficient permissions', 'FORBIDDEN')
  }
}

export default {
  errorResponse,
  handleError,
  APIErrorException,
  AuthError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  withErrorHandling,
  requireAuth,
  requireRole,
}
