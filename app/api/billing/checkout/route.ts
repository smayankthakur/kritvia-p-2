import { NextRequest } from 'next/server'
import { getUser } from '@/lib/supabase-server'
import { createCheckoutSession } from '@/lib/stripe'
import { successResponse, unauthorizedResponse, errorResponse, serverErrorResponse } from '@/lib/api-response'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    
    if (!user) {
      return unauthorizedResponse()
    }

    const body = await request.json()
    const { planId, interval = 'monthly' } = body

    // Validate plan
    const validPlans = ['starter', 'pro', 'enterprise']
    if (!validPlans.includes(planId)) {
      return errorResponse('Invalid plan', 'INVALID_PLAN', 400)
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const session = await createCheckoutSession({
      userId: user.id,
      email: user.email!,
      planId,
      interval,
      successUrl: `${baseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/pricing?canceled=true`,
    })

    if (!session) {
      return errorResponse('Failed to create checkout session', 'CHECKOUT_ERROR', 500)
    }

    logger.info('Checkout session created', { 
      userId: user.id, 
      planId, 
      interval,
      sessionId: session.sessionId 
    })

    return successResponse({ url: session.url })
  } catch (error) {
    logger.error('Checkout error', error as Error)
    return serverErrorResponse('Failed to create checkout session')
  }
}
