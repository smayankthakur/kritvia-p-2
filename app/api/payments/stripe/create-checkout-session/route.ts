import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { createCheckoutSession } from '@/lib/stripe'
import { supabaseServer } from '@/lib/supabase/supabase-server'
import { getCurrentUser } from '@/lib/auth-context'

// Define the schema for the request body
const createCheckoutSessionSchema = z.object({
  plan: z.enum(['starter', 'pro', 'enterprise']),
})

export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate the request body
    const body = await request.json()
    const { plan } = createCheckoutSessionSchema.parse(body)

    // Map plan to Stripe price ID (in a real app, these would come from environment variables or a config)
    const priceIds: Record<string, string> = {
      starter: process.env.STRIPE_STARTER_PRICE_ID!,
      pro: process.env.STRIPE_PRO_PRICE_ID!,
      enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    }

    const priceId = priceIds[plan]
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Get or create Stripe customer for the user
    const { data: customerData, error: customerError } = await supabaseServer
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = customerData?.customer_id || undefined

    // Create a checkout session using our helper function
    const session = await createCheckoutSession({
      userId: user.id,
      email: user.email!,
      planId: plan,
      interval: 'monthly', // Default to monthly, could be made configurable
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}