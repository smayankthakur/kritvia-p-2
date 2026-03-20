/**
 * Dynamic Checkout API
 * 
 * Creates checkout sessions using the configured payment gateway
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { getPaymentProvider, getRecommendedProvider } from '@/lib/payments/factory'
import { PaymentProviderName, PaymentConfig } from '@/lib/payments/types'
import { z } from 'zod'

// Force runtime
export const dynamic = 'force-dynamic'

// Validation schema
const checkoutSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
  customerEmail: z.string().email(),
  customerName: z.string().optional(),
  description: z.string().optional(),
  provider: z.enum(['stripe', 'paypal', 'razorpay', 'cashfree', 'phonepe', 'paytm']).optional(),
  metadata: z.record(z.string(), z.string()).optional()
})

/**
 * POST /api/billing/checkout
 * Create a checkout session with the specified or recommended provider
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's company
    const { data: userCompany } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', user.id)
      .single()
    
    if (!userCompany) {
      return NextResponse.json({ error: 'No company found' }, { status: 400 })
    }
    
    // Validate request
    const body = await req.json()
    const validated = checkoutSchema.parse(body)
    
    // Determine which provider to use
    let providerName: PaymentProviderName
    
    if (validated.provider) {
      // Use specified provider
      providerName = validated.provider
    } else {
      // Get active provider from settings
      const { data: activeSetting } = await supabase
        .from('payment_settings')
        .select('provider')
        .eq('company_id', userCompany.company_id)
        .eq('is_active', true)
        .order('is_primary', { ascending: false })
        .limit(1)
        .single()
      
      if (activeSetting) {
        providerName = activeSetting.provider as PaymentProviderName
      } else {
        // Use recommended provider based on currency
        providerName = getRecommendedProvider(validated.currency)
      }
    }
    
    // Get provider instance
    const provider = getPaymentProvider(providerName)
    
    // Build payment config
    const paymentConfig: PaymentConfig = {
      amount: validated.amount,
      currency: validated.currency,
      customerEmail: validated.customerEmail,
      customerName: validated.customerName,
      description: validated.description,
      metadata: {
        ...validated.metadata,
        userId: user.id,
        companyId: userCompany.company_id,
        provider: providerName
      }
    }
    
    // Create checkout session
    const checkoutResult = await provider.createCheckoutSession(paymentConfig)
    
    // Log transaction
    await supabase.from('payment_transactions').insert({
      company_id: userCompany.company_id,
      provider: providerName,
      transaction_id: checkoutResult.sessionId,
      order_id: checkoutResult.sessionId,
      amount: validated.amount,
      currency: validated.currency,
      status: 'pending',
      customer_email: validated.customerEmail,
      metadata: paymentConfig.metadata
    })
    
    return NextResponse.json({
      url: checkoutResult.url,
      sessionId: checkoutResult.sessionId,
      provider: providerName
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }
    
    console.error('Error creating checkout:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create checkout' 
    }, { status: 500 })
  }
}

/**
 * GET /api/billing/checkout
 * Get available providers for checkout
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's company
    const { data: userCompany } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', user.id)
      .single()
    
    if (!userCompany) {
      return NextResponse.json({ error: 'No company found' }, { status: 400 })
    }
    
    // Get active providers
    const { data: settings } = await supabase
      .from('payment_settings')
      .select('provider, is_active, is_primary')
      .eq('company_id', userCompany.company_id)
      .eq('is_active', true)
    
    return NextResponse.json({
      activeProviders: settings || [],
      companyId: userCompany.company_id
    })
    
  } catch (error) {
    console.error('Error fetching checkout providers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
