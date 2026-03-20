import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { getPayPalAccessToken, createPayPalSubscription } from '@/lib/paypal'
import { supabaseServer } from '@/lib/supabase/supabase-server'
import { getCurrentUser } from '@/lib/auth-context'

// Define the schema for the request body
const createPayPalSubscriptionSchema = z.object({
  plan: z.enum(['starter', 'pro', 'enterprise']),
})

export async function POST(req: NextRequest) {
  try {
    // Get the current user
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate the request body
    const body = await req.json()
    const { plan } = createPayPalSubscriptionSchema.parse(body)

    // Map plan to PayPal plan ID (these should be set as environment variables)
    const payPalPlanIds: Record<string, string> = {
      starter: process.env.PAYPAL_STARTER_PLAN_ID!,
      pro: process.env.PAYPAL_PRO_PLAN_ID!,
      enterprise: process.env.PAYPAL_ENTERPRISE_PLAN_ID!,
    }

    const planId = payPalPlanIds[plan]
    if (!planId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken()

    // Create the PayPal subscription and get the approval URL
    const approvalUrl = await createPayPalSubscription(accessToken, planId, user)

    return NextResponse.json({ approval_url: approvalUrl })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }
    console.error('Error creating PayPal subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}