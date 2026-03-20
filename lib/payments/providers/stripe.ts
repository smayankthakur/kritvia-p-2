/**
 * Stripe Payment Provider
 * 
 * Implements PaymentProvider interface for Stripe gateway
 */

import Stripe from 'stripe'
import { 
  PaymentProvider, 
  PaymentConfig, 
  CheckoutResult, 
  WebhookEvent,
  ProviderInfo 
} from '../types'

// Lazy initialization
let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance
  
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY')
  }
  
  stripeInstance = new Stripe(key, {
    apiVersion: '2026-02-25.clover' as any
  })
  
  return stripeInstance
}

export class StripeProvider implements PaymentProvider {
  readonly name = 'stripe' as const

  async createCheckoutSession(config: PaymentConfig): Promise<CheckoutResult> {
    const stripe = getStripe()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    // Create or get customer
    const customers = await stripe.customers.list({ email: config.customerEmail, limit: 1 })
    let customerId: string
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: config.customerEmail,
        name: config.customerName,
        metadata: config.metadata
      })
      customerId = customer.id
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: config.currency.toLowerCase(),
          product_data: {
            name: config.description || 'Kritvia Subscription'
          },
          unit_amount: Math.round(config.amount * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/billing/cancel`,
      metadata: config.metadata,
      customer_email: config.customerEmail
    })

    return {
      url: session.url || '',
      sessionId: session.id,
      provider: 'stripe'
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<WebhookEvent | null> {
    const stripe = getStripe()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    
    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET')
      return null
    }

    try {
      const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
      
      return {
        id: event.id,
        type: event.type,
        data: event.data.object,
        timestamp: new Date(event.created * 1000)
      }
    } catch (err) {
      console.error('Stripe webhook verification failed:', err)
      return null
    }
  }

  async createCustomer(email: string, name?: string): Promise<string> {
    const stripe = getStripe()
    
    const customer = await stripe.customers.create({
      email,
      name
    })
    
    return customer.id
  }

  async createSubscription(customerId: string, priceId: string): Promise<{ url: string }> {
    const stripe = getStripe()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent']
    })

    const invoice = subscription.latest_invoice as any
    const paymentIntent = invoice?.payment_intent as any

    if (paymentIntent?.status === 'requires_action') {
      return { url: paymentIntent.hosted_invoice_url || '' }
    }

    return { url: `${appUrl}/dashboard?subscription=success` }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    const stripe = getStripe()
    
    try {
      await stripe.subscriptions.cancel(subscriptionId)
      return true
    } catch (error) {
      console.error('Failed to cancel Stripe subscription:', error)
      return false
    }
  }

  getProviderInfo(): ProviderInfo {
    return {
      name: 'stripe',
      displayName: 'Stripe',
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY'],
      supportedCountries: ['US', 'UK', 'EU', 'AU', 'CA', 'JP', 'IN'],
      requiresWebhookSecret: true,
      fees: {
        fixed: 0,
        percentage: 2.9
      }
    }
  }
}
