import { z } from 'zod'

// Environment variables validation schema
export const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  // OpenAI
  OPENAI_API_KEY: z.string().min(1),
  
  // Email
  EMAIL_USER: z.string().email().optional(),
  EMAIL_PASS: z.string().optional(),
  
  // Stripe (Billing)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_STARTER_MONTHLY: z.string().optional(),
  STRIPE_STARTER_YEARLY: z.string().optional(),
  STRIPE_PRO_MONTHLY: z.string().optional(),
  STRIPE_PRO_YEARLY: z.string().optional(),
  STRIPE_ENTERPRISE_MONTHLY: z.string().optional(),
  STRIPE_ENTERPRISE_YEARLY: z.string().optional(),
  
  // Upstash Redis (Rate Limiting)
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // Sentry (Monitoring)
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  
  // Logging
  LOG_LEVEL: z.string().optional(),
})

// Type for validated env
export type Env = z.infer<typeof envSchema>

// Validate and get environment variables
let envCache: Env | null = null

export function getEnv(): Env {
  if (envCache) {
    return envCache
  }
  
  const result = envSchema.safeParse(process.env)
  
  if (!result.success) {
    console.error('Environment validation failed:', result.error.flatten().fieldErrors)
    throw new Error('Invalid environment configuration')
  }
  
  envCache = result.data
  return envCache
}

// Check if running in production
export function isProduction(): boolean {
  return getEnv().NODE_ENV === 'production'
}

// Check if Stripe is configured
export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY
}

// Check if Redis is configured
export function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

// Check if Sentry is configured
export function isSentryConfigured(): boolean {
  return !!process.env.SENTRY_DSN
}
