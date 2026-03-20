import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { supabaseServer } from '@/lib/supabase/supabase-server'
import { getCurrentUser } from '@/lib/auth-context'
import { CRMService } from '@/lib/services/crm.service'
import { rateLimiter } from '@/lib/redis/rateLimiter'

// Update the deal schema to match the database
const dealSchema = z.object({
  title: z.string(),
  value: z.number().positive(),
  stage: z.enum(['lead', 'proposal', 'negotiation', 'closed']).default('lead'),
  status: z.enum(['open', 'won', 'lost']).default('open'),
  assigned_to: z.string().optional(), // UUID of the user
})

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting for GET deals
    const ip = 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      '127.0.0.1'
    
    const limit = await rateLimiter(ip, '/api/deals', 60, 60) // 60 requests per minute
    if (!limit.success) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }

    // Get the user's company
    const company = await CRMService.getCompanyByUserId(user.id)
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Fetch deals for the company
    const deals = await CRMService.getDealsByCompanyId(company.id)

    return NextResponse.json({ success: true, data: deals })
  } catch (error) {
    console.error('Error in GET /api/deals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting for creating deals
    const ip = 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      '127.0.0.1'
    
    const limit = await rateLimiter(ip, '/api/deals', 10, 60) // 10 requests per minute
    if (!limit.success) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }

    const body = await request.json()
    const { title, value, stage, status, assigned_to } = dealSchema.parse(body)

    // Get the user's company
    const company = await CRMService.getCompanyByUserId(user.id)
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Create the deal for the company
    const deal = await CRMService.createDeal({
      company_id: company.id,
      title,
      value,
      stage,
      status,
      assigned_to: assigned_to ?? null,
    })

    return NextResponse.json({ success: true, data: deal })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }
    console.error('Error in POST /api/deals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// We can also implement PUT and DELETE for individual deals if needed, but for simplicity, we'll leave them out.
// In a real app, you would have /api/deals/[id] for individual deal operations.
