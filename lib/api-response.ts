import { NextResponse } from 'next/server'

// Standard API response types
export interface ApiSuccess<T = unknown> {
  success: true
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: string
  code?: string
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

// Helper to create success response
export function successResponse<T>(data: T, message?: string): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  } as ApiSuccess<T>, { status: 200 })
}

// Helper to create error response
export function errorResponse(error: string, code?: string, status = 400): NextResponse<ApiError> {
  return NextResponse.json({
    success: false,
    error,
    code,
  } as ApiError, { status })
}

// Helper to create 401 response
export function unauthorizedResponse(): NextResponse<ApiError> {
  return errorResponse('Unauthorized', 'UNAUTHORIZED', 401)
}

// Helper to create 404 response
export function notFoundResponse(resource = 'Resource'): NextResponse<ApiError> {
  return errorResponse(`${resource} not found`, 'NOT_FOUND', 404)
}

// Helper to create 429 response (rate limit)
export function rateLimitResponse(): NextResponse<ApiError> {
  return errorResponse('Rate limit exceeded', 'RATE_LIMITED', 429)
}

// Helper to create 500 response
export function serverErrorResponse(error = 'Internal server error'): NextResponse<ApiError> {
  return errorResponse(error, 'SERVER_ERROR', 500)
}
