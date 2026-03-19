import Stripe from 'stripe'

// Initialize Stripe with API key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  console.warn('⚠️ STRIPE_SECRET_KEY not set - Stripe payments disabled')
}

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, { 
      apiVersion: '2026-02-25.clover',
      typescript: true,
    })
  : null

// Plan to Stripe Price ID mapping
export const PLAN_PRICES: Record<string, { monthly: string; yearly: string }> = {
  free: { monthly: '', yearly: '' },
  starter: { 
    monthly: process.env.STRIPE_STARTER_MONTHLY || 'price_starter_monthly',
    yearly: process.env.STRIPE_STARTER_YEARLY || 'price_starter_yearly'
  },
  pro: { 
    monthly: process.env.STRIPE_PRO_MONTHLY || 'price_pro_monthly',
    yearly: process.env.STRIPE_PRO_YEARLY || 'price_pro_yearly'
  },
  enterprise: { 
    monthly: process.env.STRIPE_ENTERPRISE_MONTHLY || 'price_enterprise_monthly',
    yearly: process.env.STRIPE_ENTERPRISE_YEARLY || 'price_enterprise_yearly'
  },
}

// Create checkout session
export async function createCheckoutSession({
  userId,
  email,
  planId,
  interval = 'monthly',
  successUrl,
  cancelUrl,
}: {
  userId: string
  email: string
  planId: string
  interval?: 'monthly' | 'yearly'
  successUrl: string
  cancelUrl: string
}): Promise<{ url: string; sessionId: string } | null> {
  if (!stripe) {
    throw new Error('Stripe is not configured')
  }

  const priceId = PLAN_PRICES[planId]?.[interval]
  if (!priceId) {
    throw new Error(`Invalid plan: ${planId}`)
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      metadata: {
        userId,
        planId,
      },
      trial_period_days: 14,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      planId,
    },
  })

  return { url: session.url!, sessionId: session.id }
}

// Create portal session (for managing subscription)
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}): Promise<string | null> {
  if (!stripe) {
    throw new Error('Stripe is not configured')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session.url
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  if (!stripe) return null
  return stripe.subscriptions.retrieve(subscriptionId)
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) return null
  return stripe.subscriptions.cancel(subscriptionId)
}

// Webhook event types
export type WebhookEvent = {
  type: 'checkout.session.completed' | 'customer.subscription.updated' | 'customer.subscription.deleted'
  data: {
    object: {
      id: string
      customer?: string
      metadata?: Record<string, string>
      status?: string
      items?: {
        data: Array<{ price: { id: string } }>
      }
    }
  }
}

// Construct webhook event
export function constructWebhookEvent(payload: string, signature: string) {
  if (!stripe) throw new Error('Stripe not configured')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET not set')
  
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

// Get plan from price ID
export function getPlanFromPriceId(priceId: string): string | null {
  for (const [plan, prices] of Object.entries(PLAN_PRICES)) {
    if (prices.monthly === priceId || prices.yearly === priceId) {
      return plan
    }
  }
  return null
}
