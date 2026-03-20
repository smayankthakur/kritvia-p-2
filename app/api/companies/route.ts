import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { supabaseServer } from '@/lib/supabase/supabase-server'
import { getCurrentUser } from '@/lib/auth-context'
import { CRMService } from '@/lib/services/crm.service'
import { rateLimiter } from '@/lib/redis/rateLimiter'

// Update the company schema to match the database
const companySchema = z.object({
  name: z.string(),
  industry: z.string().optional(),
  size: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting for GET companies
    const ip = 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      '127.0.0.1'
    
    const limit = await rateLimiter(ip, '/api/companies', 60, 60) // 60 requests per minute
    if (!limit.success) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }

    // Get the user's company
    const company = await CRMService.getCompanyByUserId(user.id)
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: company })
  } catch (error) {
    console.error('Error in GET /api/companies:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting for creating companies
    const ip = 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      '127.0.0.1'
    
    const limit = await rateLimiter(ip, '/api/companies', 5, 60) // 5 requests per minute
    if (!limit.success) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }

    const body = await request.json()
    const { name, industry, size } = companySchema.parse(body)

    // Create the company
    const { data: company, error } = await supabaseServer
      .from('companies')
      .insert({
        name,
        industry,
        size,
      })
      .select()
      .single()

    if (error) throw error

    // Update the user's company_id and set role to admin (since they created the company)
    const { error: updateError } = await supabaseServer
      .from('users')
      .update({
        company_id: company.id,
        role: 'admin',
      })
      .eq('id', user.id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true, data: company })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }
    console.error('Error in POST /api/companies:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// We can also implement PATCH and DELETE for individual companies if needed, but for simplicity, we'll leave them out.
// In a real app, you would have /api/companies/[id] for individual company operations.