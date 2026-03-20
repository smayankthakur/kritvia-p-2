import { NextRequest } from 'next/server'
import { supabaseServer } from './supabase/supabase-server'

export async function getCurrentUser(request: NextRequest) {
  const accessToken = request.cookies.get('sb-access-token')?.value
  if (!accessToken) {
    return null
  }

  const { data: { user }, error } = await supabaseServer.auth.getUser(accessToken)
  if (error || !user) {
    return null
  }

  // Fetch the user from our public.users table
  const { data: dbUser, error: dbError } = await supabaseServer
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (dbError || !dbUser) {
    return null
  }

  return dbUser
}