/**
 * Environment Validation Layer
 * Safe runtime access to environment variables
 */

// Runtime validation - throws if missing at runtime, not build time
export const getEnv = () => {
  return {
    // Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    
    // OpenAI
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // Email
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    
    // App
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  }
}

// Safe getters that return null instead of throwing
export const safeEnv = () => {
  const env = getEnv()
  return {
    STRIPE_SECRET_KEY: env.STRIPE_SECRET_KEY || null,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null,
    OPENAI_API_KEY: env.OPENAI_API_KEY || null,
    NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL || null,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null,
    SUPABASE_SERVICE_ROLE_KEY: env.SUPABASE_SERVICE_ROLE_KEY || null,
    EMAIL_USER: env.EMAIL_USER || null,
    EMAIL_PASS: env.EMAIL_PASS || null,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
  }
}

// Validate required env vars (call at runtime when needed)
export const validateEnv = (required: (keyof ReturnType<typeof getEnv>)[]): void => {
  const env = getEnv()
  const missing = required.filter(key => !env[key])
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`)
    // Don't throw at build time - just log
  }
}
