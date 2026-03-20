/**
 * Billing System
 * Stripe integration for subscription management
 */

import Stripe from 'stripe'
import { safeEnv } from './env'

// Lazy initialization
let stripeInstance: Stripe | null = null

const getStripe = (): Stripe | null => {
  if (stripeInstance) {
    return stripeInstance
  }
  
  const env = safeEnv()
  
  if (!env.STRIPE_SECRET_KEY) {
    console.warn('STRIPE_SECRET_KEY not configured')
    return null
  }
  
  stripeInstance = new Stripe(env.STRIPE_SECRET_KEY)
  return stripeInstance
}

// Plan definitions
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: {
      leads: 100,
      aiMessages: 50,
      users: 1,
      automation: false,
      advancedAnalytics: false,
      prioritySupport: false,
      customIntegrations: false,
    },
  },
  starter: {
    name: 'Starter',
    price: 2999,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
    features: {
      leads: 5000,
      aiMessages: 5000,
      users: 5,
      automation: true,
      advancedAnalytics: false,
      prioritySupport: false,
      customIntegrations: false,
    },
  },
  pro: {
    name: 'Pro',
    price: 7999,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    features: {
      leads: 50000,
      aiMessages: 25000,
      users: 25,
      automation: true,
      advancedAnalytics: true,
      prioritySupport: true,
      customIntegrations: true,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: -1,
    priceId: null,
    features: {
      leads: -1,
      aiMessages: -1,
      users: -1,
      automation: true,
      advancedAnalytics: true,
      prioritySupport: true,
      customIntegrations: true,
    },
  },
} as const

export type PlanType = keyof typeof PLANS

// Create checkout session
export async function createCheckoutSession(
  workspaceId: string,
  customerId: string | null,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const stripe = getStripe()
  if (!stripe) return null
  
  return await stripe.checkout.sessions.create({
    customer: customerId || undefined,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { workspace_id: workspaceId },
  })
}

// Create customer
export async function createCustomer(email: string, name: string, workspaceId: string) {
  const stripe = getStripe()
  if (!stripe) return null
  
  return await stripe.customers.create({ email, name, metadata: { workspace_id: workspaceId } })
}

// Create portal session
export async function createPortalSession(customerId: string, returnUrl: string) {
  const stripe = getStripe()
  if (!stripe) return null
  
  return await stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl })
}

// Get plan from price ID
export function getPlanFromPriceId(priceId: string): PlanType | null {
  for (const [planName, plan] of Object.entries(PLANS)) {
    if (plan.priceId === priceId) return planName as PlanType
  }
  return null
}

// Get workspace subscription
export async function getWorkspaceSubscription(workspaceId: string) {
  const env = safeEnv()
  
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }
  
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  
  return await supabase.from('subscriptions').select('*').eq('workspace_id', workspaceId).in('status', ['active', 'trialing']).single()
}

export default { 
  PLANS, 
  createCheckoutSession, 
  createCustomer, 
  createPortalSession, 
  getPlanFromPriceId, 
  getWorkspaceSubscription 
}
