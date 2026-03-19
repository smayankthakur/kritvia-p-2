import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Lazy initialization for environment variables
function getSupabaseUrl(): string {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }
  return process.env.NEXT_PUBLIC_SUPABASE_URL
}

function getSupabaseAnonKey(): string {
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

function getServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY
}

// Server-side Supabase client for API routes

// Admin client - use only in server-side API routes (bypasses RLS)
export const supabaseAdmin = createClient(
  getSupabaseUrl(),
  getServiceRoleKey() || getSupabaseAnonKey()
)

// Create a server client that respects RLS
export async function createServerSupabase() {
  const cookieStore = await cookies()

  return createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Called from Server Component
          }
        },
      },
    }
  )
}

// Get user from request
export async function getUser() {
  const supabase = await createServerSupabase()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}
