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
  EMAIL_USER: z.string().email(),
  EMAIL_PASS: z.string().min(1),
  
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
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
