/**
 * Rate Limiting Middleware
 * 
 * IP-based and tenant-based rate limiting for API protection.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Rate limit configuration */
export interface RateLimitConfig {
  /** Max requests per window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
  /** Custom message when rate limited */
  message?: string;
}

/** Default rate limits by endpoint type */
export const rateLimitDefaults: Record<string, RateLimitConfig> = {
  // AI APIs - stricter limits
  'ai': { limit: 60, windowSeconds: 60, message: 'AI request limit exceeded. Please try again later.' },
  'ai/analyze': { limit: 30, windowSeconds: 60 },
  'ai/decision': { limit: 60, windowSeconds: 60 },
  'ai/chat': { limit: 60, windowSeconds: 60 },
  
  // Analytics APIs - moderate limits
  'analytics': { limit: 120, windowSeconds: 60 },
  'analytics/metrics': { limit: 120, windowSeconds: 60 },
  'analytics/forecast': { limit: 60, windowSeconds: 60 },
  
  // CRM APIs
  'crm': { limit: 180, windowSeconds: 60 },
  'crm/leads': { limit: 180, windowSeconds: 60 },
  'crm/deals': { limit: 180, windowSeconds: 60 },
  
  // Default for unknown endpoints
  'default': { limit: 100, windowSeconds: 60 },
};

/** In-memory rate limit store */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/** Clean up old entries periodically */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

/**
 * Get rate limit key from request
 */
function getRateLimitKey(request: NextRequest, tenantId?: string): string {
  // Use IP as primary key
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    || request.headers.get('x-real-ip') 
    || 'unknown';
  
  // Add tenant ID if available for tenant-specific limiting
  if (tenantId) {
    return `${ip}:${tenantId}`;
  }
  
  return ip;
}

/**
 * Get rate limit config for a path
 */
function getRateLimitConfig(path: string): RateLimitConfig {
  // Check for specific endpoint matches
  for (const [key, config] of Object.entries(rateLimitDefaults)) {
    if (path.includes(key) && key !== 'default') {
      return config;
    }
  }
  
  return rateLimitDefaults.default;
}

/**
 * Check and update rate limit
 */
function checkRateLimit(key: string, config: RateLimitConfig): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  
  let entry = rateLimitStore.get(key);
  
  // Reset if window expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, entry);
  }
  
  entry.count++;
  
  const remaining = Math.max(0, config.limit - entry.count);
  const allowed = entry.count <= config.limit;
  
  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limiting middleware
 */
export function rateLimit(
  request: NextRequest,
  config?: Partial<RateLimitConfig>,
  tenantId?: string
): NextResponse | null {
  const path = request.nextUrl.pathname;
  const baseConfig = getRateLimitConfig(path);
  const finalConfig = { ...baseConfig, ...config };
  
  const key = getRateLimitKey(request, tenantId);
  const result = checkRateLimit(key, finalConfig);
  
  // Add rate limit headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(finalConfig.limit));
  response.headers.set('X-RateLimit-Remaining', String(result.remaining));
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetTime / 1000)));
  
  if (!result.allowed) {
    return NextResponse.json(
      {
        error: finalConfig.message || 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000)),
        },
      }
    );
  }
  
  return null; // Continue to handler
}

/**
 * Create rate-limited API route handler
 */
export function withRateLimit<T extends (
  request: NextRequest,
  ...args: unknown[]
) => Promise<Response>>(
  handler: T,
  config?: Partial<RateLimitConfig>,
  getTenantId?: (request: NextRequest) => string | undefined
) {
  return async function rateLimitedHandler(
    request: NextRequest,
    ...args: unknown[]
  ): Promise<Response> {
    const tenantId = getTenantId ? getTenantId(request) : undefined;
    const rateLimitResponse = rateLimit(request, config, tenantId);
    
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    
    return handler(request, ...args);
  };
}
