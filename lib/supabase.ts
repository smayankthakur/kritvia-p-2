import { createBrowserClient, createServerClient, isBrowser, parse } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client for client-side
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server client for server-side
export function createSupabaseServerClient(cookies: any) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookies.setAll(cookiesToSet)
      },
    },
  })
}

// Admin client (for server-side operations that need full access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey)

export { supabaseUrl, supabaseAnonKey }
