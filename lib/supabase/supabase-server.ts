import { createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabaseServer: any

// Check if we're in a build environment (when env vars might not be available)
if (typeof supabaseUrl !== 'string' || typeof supabaseServiceRoleKey !== 'string') {
  // During build or if env vars are missing, create a dummy client
  // This prevents build errors while allowing runtime functionality
  supabaseServer = {
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
  supabaseServer = createServerClient(supabaseUrl, supabaseServiceRoleKey, {
    cookies: {
      getAll() {
        return []
      },
      setAll() {},
    },
  })
}

export { supabaseServer }