import { Redis } from '@upstash/redis'

// Initialize Upstash Redis with fallback to in-memory for development
let redis: Redis | null = null

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

// In-memory store for fallback
const memoryStore = new Map<string, { count: number; resetTime: number }>()

export async function rateLimiter(
  identifier: string,
  endpoint: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  const key = `rate_limit:${identifier}:${endpoint}`
  const now = Date.now()

  if (redis) {
    try {
      const result = await redis.incr(key)
      if (result === 1) {
        await redis.expire(key, Math.ceil(windowMs / 1000))
      }
      const ttl = await redis.ttl(key)
      const remaining = Math.max(0, limit - result)
      const resetTime = now + (ttl > 0 ? ttl * 1000 : windowMs)
      return {
        success: result <= limit,
        remaining,
        resetTime,
      }
    } catch (error) {
      console.error('Rate limiter Redis error:', error)
      // Fallback to memory on error
    }
  }

  // Fallback to in-memory rate limiting
  const windowStart = memoryStore.get(key) ?? { count: 0, resetTime: now + windowMs }
  if (now > windowStart.resetTime) {
    // Reset the window
    memoryStore.set(key, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: limit - 1, resetTime: now + windowMs }
  }

  const newCount = windowStart.count + 1
  memoryStore.set(key, { count: newCount, resetTime: windowStart.resetTime })

  return {
    success: newCount <= limit,
    remaining: Math.max(0, limit - newCount),
    resetTime: windowStart.resetTime,
  }
}