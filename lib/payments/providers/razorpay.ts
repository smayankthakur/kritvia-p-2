/**
 * Razorpay Payment Provider
 * 
 * Implements PaymentProvider interface for Razorpay gateway (India)
 */

import { 
  PaymentProvider, 
  PaymentConfig, 
  CheckoutResult, 
  WebhookEvent,
  ProviderInfo 
} from '../types'

export class RazorpayProvider implements PaymentProvider {
  readonly name = 'razorpay' as const
  
  private getConfig() {
    const config = {
      keyId: process.env.RAZORPAY_KEY_ID,
      keySecret: process.env.RAZORPAY_KEY_SECRET,
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
    }
    
    if (!config.keyId || !config.keySecret) {
      throw new Error('Missing Razorpay credentials')
    }
    
    return config
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: object) {
    const config = this.getConfig()
    const auth = Buffer.from(`${config.keyId}:${config.keySecret}`).toString('base64')
    
    const response = await fetch(`https://api.razorpay.com/v1${endpoint}`, {
      method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })
    
    return response.json()
  }

  async createCheckoutSession(config: PaymentConfig): Promise<CheckoutResult> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    // Create order
    const order = await this.makeRequest('/orders', 'POST', {
      amount: Math.round(config.amount * 100), // Convert to paise
      currency: config.currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        email: config.customerEmail,
        description: config.description || 'Kritvia Subscription'
      }
    })
    
    // Generate checkout URL (RazorpayCheckout.js)
    const checkoutUrl = `https://api.razorpay.com/v1/checkout/embedded?key_id=${this.getConfig().keyId}&order_id=${order.id}`
    
    return {
      url: checkoutUrl,
      sessionId: order.id,
      provider: 'razorpay'
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<WebhookEvent | null> {
    const crypto = await import('crypto')
    const config = this.getConfig()
    
    if (!config.webhookSecret) {
      console.error('Missing Razorpay webhook secret')
      return null
    }
    
    try {
      const expectedSignature = crypto
        .createHmac('sha256', config.webhookSecret)
        .update(payload)
        .digest('hex')
      
      if (expectedSignature !== signature) {
        console.error('Razorpay signature mismatch')
        return null
      }
      
      const event = JSON.parse(payload)
      
      return {
        id: event.id || `rz_${Date.now()}`,
        type: event.event,
        data: event.payload,
        timestamp: new Date(event.timestamp || Date.now())
      }
    } catch (err) {
      console.error('Razorpay webhook verification failed:', err)
      return null
    }
  }

  async createCustomer(email: string, name?: string): Promise<string> {
    const customer = await this.makeRequest('/customers', 'POST', {
      email,
      name: name || email.split('@')[0]
    })
    
    return customer.id
  }

  async createSubscription(customerId: string, planId: string): Promise<{ url: string }> {
    const subscription = await this.makeRequest('/subscriptions', 'POST', {
      plan_id: planId,
      customer_id: customerId,
      total_count: 12
    })
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    return { 
      url: `${appUrl}/dashboard?subscription_id=${subscription.id}` 
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/subscriptions/${subscriptionId}/cancel`, 'POST')
      return true
    } catch (error) {
      console.error('Failed to cancel Razorpay subscription:', error)
      return false
    }
  }

  getProviderInfo(): ProviderInfo {
    return {
      name: 'razorpay',
      displayName: 'Razorpay',
      supportedCurrencies: ['INR', 'USD'],
      supportedCountries: ['IN'],
      requiresWebhookSecret: true,
      fees: {
        fixed: 0,
        percentage: 2.0
      }
    }
  }
}
