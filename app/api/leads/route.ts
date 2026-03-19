import { NextRequest } from 'next/server'
import { createServerSupabase, getUser } from '@/lib/supabase-server'
import { validateInput, leadSchema } from '@/lib/validators'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse, 
  rateLimitResponse,
  serverErrorResponse 
} from '@/lib/api-response'

// GET all leads with pagination
export async function GET(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return unauthorizedResponse()
    }

    // Rate limit check
    const rateLimitKey = `leads:${user.id}`
    const rateLimitResult = rateLimit(rateLimitKey, RATE_LIMITS.LEADS)
    
    if (!rateLimitResult.success) {
      return rateLimitResponse()
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const supabase = await createServerSupabase()
    
    // Get total count
    const { count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Get paginated data
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return errorResponse(error.message)
    }

    return successResponse({
      leads: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      }
    })
  } catch (error) {
    console.error('GET Leads Error:', error)
    return serverErrorResponse()
  }
}

// CREATE new lead
export async function POST(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return unauthorizedResponse()
    }

    // Rate limit check
    const rateLimitKey = `leads:${user.id}`
    const rateLimitResult = rateLimit(rateLimitKey, RATE_LIMITS.LEADS)
    
    if (!rateLimitResult.success) {
      return rateLimitResponse()
    }

    const body = await request.json()
    
    // Validate input with Zod
    const validation = validateInput(leadSchema, body)
    if (!validation.success) {
      return errorResponse(validation.error)
    }

    const { name, email, phone, company, status, source, notes } = validation.data

    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name,
        email,
        phone,
        company,
        status: status || 'new',
        source,
        notes,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      return errorResponse(error.message)
    }

    return successResponse(data, 'Lead created successfully')
  } catch (error) {
    console.error('POST Lead Error:', error)
    return serverErrorResponse()
  }
}

// PUT - Update lead
export async function PUT(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return unauthorizedResponse()
    }

    // Rate limit check
    const rateLimitKey = `leads:${user.id}`
    const rateLimitResult = rateLimit(rateLimitKey, RATE_LIMITS.LEADS)
    
    if (!rateLimitResult.success) {
      return rateLimitResponse()
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return errorResponse('Lead ID is required')
    }

    // Validate the updates
    const validation = validateInput(leadSchema.partial(), updates)
    if (!validation.success) {
      return errorResponse(validation.error)
    }

    const supabase = await createServerSupabase()
    
    // Verify ownership before update
    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      return errorResponse('Lead not found', 'NOT_FOUND', 404)
    }

    const { data, error } = await supabase
      .from('leads')
      .update({
        ...validation.data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return errorResponse(error.message)
    }

    return successResponse(data, 'Lead updated successfully')
  } catch (error) {
    console.error('PUT Lead Error:', error)
    return serverErrorResponse()
  }
}

// DELETE - Delete lead
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return unauthorizedResponse()
    }

    // Rate limit check
    const rateLimitKey = `leads:${user.id}`
    const rateLimitResult = rateLimit(rateLimitKey, RATE_LIMITS.LEADS)
    
    if (!rateLimitResult.success) {
      return rateLimitResponse()
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return errorResponse('Lead ID is required')
    }

    const supabase = await createServerSupabase()
    
    // Verify ownership before delete
    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      return errorResponse('Lead not found', 'NOT_FOUND', 404)
    }

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return errorResponse(error.message)
    }

    return successResponse({ success: true }, 'Lead deleted successfully')
  } catch (error) {
    console.error('DELETE Lead Error:', error)
    return serverErrorResponse()
  }
}
