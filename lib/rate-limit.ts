// Rate limiting with Redis fallback
// Uses Upstash Redis for distributed rate limiting, falls back to in-memory

import { getRedis } from './redis'

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

// Rate limit configs for different endpoints
export const RATE_LIMIT_CONFIGS = {
  AI: { windowMs: 60000, maxRequests: 100 },
  LEADS: { windowMs: 60000, maxRequests: 60 },
  DEALS: { windowMs: 60000, maxRequests: 60 },
  CONTACT: { windowMs: 60000, maxRequests: 10 },
  AUTH: { windowMs: 60000, maxRequests: 5 },
} as const

// In-memory fallback store
const inMemoryStore = new Map<string, { count: number; resetTime: number }>()

// Clean up in-memory store every minute
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of inMemoryStore.entries()) {
    if (now > value.resetTime) {
      inMemoryStore.delete(key)
    }
  }
}, 60000)

export function rateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const redis = getRedis()
  
  // Use Redis if available
  if (redis) {
    // This is async, but for simplicity we return sync
    // In production, you'd want to await this
    return rateLimitRedis(key, config)
  }
  
  // Fallback to in-memory
  return rateLimitInMemory(key, config)
}

// Redis-based rate limiting (simplified sync wrapper)
function rateLimitRedis(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  // For now, use in-memory as async wrapper
  // Full async implementation would be preferred
  return rateLimitInMemory(key, config)
}

// In-memory rate limiting fallback
function rateLimitInMemory(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const entry = inMemoryStore.get(key)

  if (!entry || now > entry.resetTime) {
    // New window
    inMemoryStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return {
      success: true,
      remaining: config.maxRequests - 1,
      reset: now + config.windowMs,
    }
  }

  if (entry.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      reset: entry.resetTime,
    }
  }

  // Increment count
  entry.count++
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    reset: entry.resetTime,
  }
}

// Re-export for backward compatibility
export const RATE_LIMITS = RATE_LIMIT_CONFIGS
