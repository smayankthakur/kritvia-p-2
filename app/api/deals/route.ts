import { NextRequest } from 'next/server'
import { createServerSupabase, getUser } from '@/lib/supabase-server'
import { validateInput, dealSchema } from '@/lib/validators'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse, 
  rateLimitResponse,
  serverErrorResponse 
} from '@/lib/api-response'

// GET all deals with pagination
export async function GET(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return unauthorizedResponse()
    }

    // Rate limit check
    const rateLimitKey = `deals:${user.id}`
    const rateLimitResult = rateLimit(rateLimitKey, RATE_LIMITS.DEALS)
    
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
      .from('deals')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Get paginated data
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return errorResponse(error.message)
    }

    return successResponse({
      deals: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      }
    })
  } catch (error) {
    console.error('GET Deals Error:', error)
    return serverErrorResponse()
  }
}

// CREATE new deal
export async function POST(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return unauthorizedResponse()
    }

    // Rate limit check
    const rateLimitKey = `deals:${user.id}`
    const rateLimitResult = rateLimit(rateLimitKey, RATE_LIMITS.DEALS)
    
    if (!rateLimitResult.success) {
      return rateLimitResponse()
    }

    const body = await request.json()
    
    // Validate input with Zod
    const validation = validateInput(dealSchema, body)
    if (!validation.success) {
      return errorResponse(validation.error)
    }

    const { title, value, stage, lead_id, notes } = validation.data

    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from('deals')
      .insert({
        title,
        value,
        stage: stage || 'new',
        lead_id,
        notes,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      return errorResponse(error.message)
    }

    return successResponse(data, 'Deal created successfully')
  } catch (error) {
    console.error('POST Deal Error:', error)
    return serverErrorResponse()
  }
}

// PUT - Update deal
export async function PUT(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return unauthorizedResponse()
    }

    // Rate limit check
    const rateLimitKey = `deals:${user.id}`
    const rateLimitResult = rateLimit(rateLimitKey, RATE_LIMITS.DEALS)
    
    if (!rateLimitResult.success) {
      return rateLimitResponse()
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return errorResponse('Deal ID is required')
    }

    // Validate the updates
    const validation = validateInput(dealSchema.partial(), updates)
    if (!validation.success) {
      return errorResponse(validation.error)
    }

    const supabase = await createServerSupabase()
    
    // Verify ownership before update
    const { data: existing } = await supabase
      .from('deals')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      return errorResponse('Deal not found', 'NOT_FOUND', 404)
    }

    const { data, error } = await supabase
      .from('deals')
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

    return successResponse(data, 'Deal updated successfully')
  } catch (error) {
    console.error('PUT Deal Error:', error)
    return serverErrorResponse()
  }
}

// DELETE - Delete deal
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return unauthorizedResponse()
    }

    // Rate limit check
    const rateLimitKey = `deals:${user.id}`
    const rateLimitResult = rateLimit(rateLimitKey, RATE_LIMITS.DEALS)
    
    if (!rateLimitResult.success) {
      return rateLimitResponse()
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return errorResponse('Deal ID is required')
    }

    const supabase = await createServerSupabase()
    
    // Verify ownership before delete
    const { data: existing } = await supabase
      .from('deals')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      return errorResponse('Deal not found', 'NOT_FOUND', 404)
    }

    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return errorResponse(error.message)
    }

    return successResponse({ success: true }, 'Deal deleted successfully')
  } catch (error) {
    console.error('DELETE Deal Error:', error)
    return serverErrorResponse()
  }
}
