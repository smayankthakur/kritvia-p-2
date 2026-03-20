import Stripe from 'stripe'
import { safeEnv } from './env'

// Lazy initialization - only creates client at runtime
let stripeInstance: Stripe | null = null

export const getStripe = (): Stripe => {
  if (stripeInstance) {
    return stripeInstance
  }

  const env = safeEnv()
  
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable')
  }

  stripeInstance = new Stripe(env.STRIPE_SECRET_KEY)

  return stripeInstance
}

// Webhook signature verification
export const constructWebhookEvent = (payload: string, sig: string) => {
  const env = safeEnv()
  const stripe = getStripe()
  
  if (!env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Missing Stripe environment variables')
  }
  
  return stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET)
}

// Create checkout session
export const createCheckoutSession = async (params: {
  userId: string
  email: string
  planId: string
  interval: string
  successUrl: string
  cancelUrl: string
}) => {
  const stripe = getStripe()
  
  // Map planId to Stripe price ID based on interval
  const priceIds: Record<string, Record<string, string>> = {
    starter: {
      monthly: process.env.STRIPE_STARTER_PRICE_ID_MONTHLY!,
      yearly: process.env.STRIPE_STARTER_PRICE_ID_YEARLY!,
    },
    pro: {
      monthly: process.env.STRIPE_PRO_PRICE_ID_MONTHLY!,
      yearly: process.env.STRIPE_PRO_PRICE_ID_YEARLY!,
    },
    enterprise: {
      monthly: process.env.STRIPE_ENTERPRISE_PRICE_ID_MONTHLY!,
      yearly: process.env.STRIPE_ENTERPRISE_PRICE_ID_YEARLY!,
    },
  }

  const priceId = priceIds[params.planId]?.[params.interval]
  if (!priceId) {
    throw new Error(`Invalid plan ID: ${params.planId} with interval: ${params.interval}`)
  }

  // Create customer
  const customer = await stripe.customers.create({
    email: params.email,
    metadata: {
      userId: params.userId,
    },
  })

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
      planId: params.planId,
    },
  })

  return session
}

// Create billing portal session
export const createPortalSession = async (customerId: string) => {
  const stripe = getStripe()
  const env = safeEnv()
  
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })

  return session
}

// Get plan from price ID
export const getPlanFromPriceId = (priceId: string) => {
  const priceMap: Record<string, string> = {
    'price_free': 'free',
    'price_starter_monthly': 'starter',
    'price_starter_yearly': 'starter',
    'price_pro_monthly': 'pro',
    'price_pro_yearly': 'pro',
    'price_enterprise_monthly': 'enterprise',
    'price_enterprise_yearly': 'enterprise',
  }

  return priceMap[priceId] || 'free'
}
