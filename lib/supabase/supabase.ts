import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: any

// Check if we're in a build environment (when env vars might not be available)
if (typeof supabaseUrl !== 'string' || typeof supabaseAnonKey !== 'string') {
  // During build or if env vars are missing, create a dummy client
  // This prevents build errors while allowing runtime functionality
  supabase = {
    // Provide a minimal interface to prevent runtime errors
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      update: () => ({ eq: () => ({ }) }),
      delete: () => ({ eq: () => ({ }) }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  }
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }