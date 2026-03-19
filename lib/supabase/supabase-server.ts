import { createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseServer = createServerClient(supabaseUrl, supabaseServiceRoleKey, {
  cookies: {
    getAll() {
      return []
    },
    setAll() {},
  },
})