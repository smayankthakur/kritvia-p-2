import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export const constructWebhookEvent = (payload: string, sig: string) => {
  return stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!)
}

export const createCheckoutSession = async (params: {
  userId: string
  email: string
  planId: string
  interval: string
  successUrl: string
  cancelUrl: string
}) => {
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

  // If no customerId, create a new customer
  // First check if we have a Stripe customer for this user
  // For now, we'll create a new customer each time (in production, you'd want to store and reuse)
  const customer = await stripe.customers.create({
    email: params.email,
    metadata: {
      userId: params.userId,
    },
  })

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

export const createPortalSession = async (customerId: string) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })

  return session
}

export const getPlanFromPriceId = (priceId: string) => {
  const priceMap: Record<string, string> = {
    // Free plan
    'price_free': 'free',
    // Starter plan
    'price_starter_monthly': 'starter',
    'price_starter_yearly': 'starter',
    // Pro plan
    'price_pro_monthly': 'pro',
    'price_pro_yearly': 'pro',
    // Enterprise plan
    'price_enterprise_monthly': 'enterprise',
    'price_enterprise_yearly': 'enterprise',
  }

  return priceMap[priceId] || 'free'
}

export default stripe
