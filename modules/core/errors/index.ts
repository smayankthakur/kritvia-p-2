/**
 * Kritvia Error Handling System
 * 
 * Centralized error handling, logging, and API error responses.
 */

import { ZodError } from 'zod';

/** Error codes for API responses */
export const ErrorCodes = {
  // Validation errors (1xxx)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Authentication/Authorization errors (2xxx)
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Resource errors (3xxx)
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  RESOURCE_LOCKED: 'RESOURCE_LOCKED',
  
  // External service errors (4xxx)
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // Internal errors (5xxx)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  
  // Business logic errors (6xxx)
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

/**
 * Custom application error class
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    
    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * Convert to JSON-serializable error response
   */
  toJSON() {
    return {
      error: this.message,
      code: this.code,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: this.stack,
        details: this.details 
      }),
    };
  }
}

/**
 * Create error response for API routes
 */
export function createErrorResponse(
  error: unknown
): { error: string; code: ErrorCode; statusCode: number; details?: unknown } {
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (error instanceof ZodError) {
    const zodError = error as ZodError;
    return {
      error: 'Validation failed',
      code: ErrorCodes.VALIDATION_ERROR,
      statusCode: 400,
      details: zodError.errors.map((e: ZodError['errors'][number]) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    };
  }

  if (error instanceof Error) {
    console.error('[Unhandled Error]', error.message, error.stack);
    return {
      error: 'An unexpected error occurred',
      code: ErrorCodes.INTERNAL_ERROR,
      statusCode: 500,
    };
  }

  return {
    error: 'An unknown error occurred',
    code: ErrorCodes.INTERNAL_ERROR,
    statusCode: 500,
  };
}

/**
 * Wrap async route handlers with error handling
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  handler: T
): T {
  return (async (...args: unknown[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      const response = createErrorResponse(error);
      return Response.json(response, { status: response.statusCode });
    }
  }) as T;
}

/**
 * Validation error helper
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCodes.VALIDATION_ERROR, 400, true, details);
    this.name = 'ValidationError';
  }
}

/**
 * Not found error helper
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id 
      ? `${resource} with id '${id}' not found` 
      : `${resource} not found`;
    super(message, ErrorCodes.NOT_FOUND, 404, true);
    this.name = 'NotFoundError';
  }
}

/**
 * Unauthorized error helper
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, ErrorCodes.UNAUTHORIZED, 401, true);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Forbidden error helper
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, ErrorCodes.FORBIDDEN, 403, true);
    this.name = 'ForbiddenError';
  }
}

/**
 * Rate limit error helper
 */
export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super('Rate limit exceeded', ErrorCodes.RATE_LIMIT_EXCEEDED, 429, true, { retryAfter });
    this.name = 'RateLimitError';
  }
}

/**
 * External service error helper
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, originalError?: Error) {
    super(
      `External service error: ${service}`,
      ErrorCodes.EXTERNAL_SERVICE_ERROR,
      502,
      true,
      originalError?.message
    );
    this.name = 'ExternalServiceError';
  }
}

// Import ZodError for type checking
import { z } from 'zod';
