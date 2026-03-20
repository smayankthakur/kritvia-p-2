import { NextRequest } from 'next/server'
import { getUser } from '@/lib/supabase-server'
import { createPortalSession } from '@/lib/stripe'
import { successResponse, unauthorizedResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    
    if (!user) {
      return unauthorizedResponse()
    }

    // Get customer ID from user metadata
    const customerId = user.user_metadata?.stripe_customer_id
    
    if (!customerId) {
      return errorResponse('No active subscription found', 'NO_SUBSCRIPTION', 400)
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const portalUrl = await createPortalSession(customerId)

    if (!portalUrl) {
      return errorResponse('Failed to create portal session', 'PORTAL_ERROR', 500)
    }

    logger.info('Portal session created', { userId: user.id, customerId })

    return successResponse({ url: portalUrl })
  } catch (error) {
    logger.error('Portal error', error as Error)
    return serverErrorResponse('Failed to create portal session')
  }
}
