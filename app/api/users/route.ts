import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { supabaseServer } from '@/lib/supabase/supabase-server'
import { getCurrentUser } from '@/lib/auth-context'
import { userSchema } from '@/lib/validation/user'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch the user from the database to get the latest data
    const { data: dbUser, error } = await supabaseServer
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: dbUser })
  } catch (error) {
    console.error('Error in GET /api/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { data: updatedUser, error } = await supabaseServer
      .from('users')
      .update(body)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: updatedUser })
  } catch (error) {
    console.error('Error in PUT /api/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}