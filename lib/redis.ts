import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Redis client
let redis: Redis | null = null

export function getRedis(): Redis | null {
  if (redis) return redis
  
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
  
  if (!redisUrl || !redisToken) {
    console.warn('⚠️ Upstash Redis not configured - using in-memory fallback')
    return null
  }
  
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  })
  
  return redis
}

// Rate limit configurations
export const RATE_LIMITS = {
  AI: { limit: 100, window: 60 },      // 100 requests per minute
  LEADS: { limit: 60, window: 60 },    // 60 requests per minute
  DEALS: { limit: 60, window: 60 },    // 60 requests per minute
  CONTACT: { limit: 10, window: 60 },   // 10 requests per minute
  AUTH: { limit: 5, window: 60 },       // 5 requests per minute
} as const

// Create a rate limiter for a specific endpoint
export function createRateLimiter(
  prefix: string,
  limit: number,
  window: number
): Ratelimit {
  const redisClient = getRedis()
  
  if (redisClient) {
    // Use Upstash Redis for distributed rate limiting
    return new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(limit, `${window}s`),
      prefix: `kritvia:${prefix}`,
    })
  }
  
  // Fallback to in-memory (not recommended for production)
  const inMemoryStore = new Map<string, { count: number; resetTime: number }>()
  
  return {
    limit: async (key: string) => {
      const now = Date.now()
      const windowMs = window * 1000
      const record = inMemoryStore.get(key)
      
      if (!record || now > record.resetTime) {
        inMemoryStore.set(key, { count: 1, resetTime: now + windowMs })
        return { success: true, remaining: limit - 1, reset: now + windowMs }
      }
      
      if (record.count >= limit) {
        return { success: false, remaining: 0, reset: record.resetTime }
      }
      
      record.count++
      return { success: true, remaining: limit - record.count, reset: record.resetTime }
    }
  } as unknown as Ratelimit
}

// Check rate limit
export async function checkRateLimit(
  key: string,
  type: keyof typeof RATE_LIMITS
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const config = RATE_LIMITS[type]
  const limiter = createRateLimiter(type.toLowerCase(), config.limit, config.window)
  
  const result = await limiter.limit(key)
  
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  }
}

// Health check for Redis
export async function checkRedisHealth(): Promise<boolean> {
  const redisClient = getRedis()
  if (!redisClient) return false
  
  try {
    await redisClient.ping()
    return true
  } catch {
    return false
  }
}
