/**
 * Multi-Gateway Webhook Handler
 * 
 * Dynamic webhook routing for all payment providers
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPaymentProvider } from '@/lib/payments/factory'
import { PaymentProviderName } from '@/lib/payments/types'
import { createServerSupabase } from '@/lib/supabase-server'

// Force runtime
export const dynamic = 'force-dynamic'

// Valid providers
const validProviders = ['stripe', 'paypal', 'razorpay', 'cashfree', 'phonepe', 'paytm']

/**
 * POST /api/webhooks/[provider]
 * Handle webhook events from payment providers
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider: providerName } = await params
    
    // Validate provider
    if (!validProviders.includes(providerName)) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }
    
    const provider = getPaymentProvider(providerName as PaymentProviderName)
    
    // Get signature from headers
    const signature = req.headers.get('x-signature') 
      || req.headers.get('stripe-signature')
      || req.headers.get('x-verification')
      || ''
    
    const payload = await req.text()
    
    // Verify webhook
    const event = await provider.verifyWebhook(payload, signature)
    
    if (!event) {
      return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 })
    }
    
    // Process event based on type
    await processWebhookEvent(providerName as PaymentProviderName, event)
    
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}

/**
 * Process webhook events
 */
async function processWebhookEvent(provider: PaymentProviderName, event: any) {
  const supabase = await createServerSupabase()
  
  console.log(`Processing ${provider} webhook:`, event.type)
  
  switch (event.type) {
    case 'checkout.session.completed':
    case 'payment_intent.succeeded':
    case 'payment_success':
    case 'PAYMENT_SUCCESS':
    case 'order.completed': {
      // Find transaction and mark as complete
      const transactionId = event.data?.session_id 
        || event.data?.transaction_id 
        || event.data?.order_id
        
      if (transactionId) {
        await supabase
          .from('payment_transactions')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('transaction_id', transactionId)
      }
      break
    }
    
    case 'payment_intent.payment_failed':
    case 'payment_failed':
    case 'PAYMENT_FAILED':
    case 'order.failed': {
      // Mark transaction as failed
      const transactionId = event.data?.session_id 
        || event.data?.transaction_id 
        || event.data?.order_id
        
      if (transactionId) {
        await supabase
          .from('payment_transactions')
          .update({ 
            status: 'failed',
            error_message: event.data?.error_message || 'Payment failed'
          })
          .eq('transaction_id', transactionId)
      }
      break
    }
    
    case 'customer.subscription.created':
    case 'subscription_created': {
      // Handle subscription creation
      const customerEmail = event.data?.customer_email
        || event.data?.email
        || event.data?.payer?.email_address
        
      if (customerEmail) {
        // Update subscription status
        console.log('Subscription created for:', customerEmail)
      }
      break
    }
    
    case 'customer.subscription.deleted':
    case 'subscription_cancelled': {
      // Handle subscription cancellation
      const subscriptionId = event.data?.subscription_id
        || event.data?.id
        
      if (subscriptionId) {
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscriptionId)
      }
      break
    }
    
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
}
