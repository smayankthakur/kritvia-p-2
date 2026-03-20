import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { supabaseServer } from '@/lib/supabase/supabase-server'
import { getCurrentUser } from '@/lib/auth-context'
import { leadSchema } from '@/lib/validation/lead'
import { rateLimiter } from '@/lib/redis/rateLimiter'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting for GET leads (optional, but we can apply a higher limit)
    // Get IP address from headers (works with Vercel/proxies)
    const ip = 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      '127.0.0.1'
    
    const limit = await rateLimiter(ip, '/api/leads', 60, 60) // 60 requests per minute
    if (!limit.success) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }

    const { data: leads, error } = await supabaseServer
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching leads:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: leads })
  } catch (error) {
    console.error('Error in GET /api/leads:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting for creating leads
    // Get IP address from headers (works with Vercel/proxies)
    const ip = 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      '127.0.0.1'
    
    const limit = await rateLimiter(ip, '/api/leads', 10, 60) // 10 requests per minute
    if (!limit.success) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }

    const body = await request.json()
    const { name, email, phone } = leadSchema.parse(body)

    const { data: lead, error } = await supabaseServer
      .from('leads')
      .insert({
        user_id: user.id,
        name,
        email,
        phone,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // TODO: Send email notification for new lead (optional)

    return NextResponse.json({ success: true, data: lead })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }
    console.error('Error in POST /api/leads:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// We can also implement PUT and DELETE for individual leads if needed, but for simplicity, we'll leave them out.
// In a real app, you would have /api/leads/[id] for individual lead operations.
