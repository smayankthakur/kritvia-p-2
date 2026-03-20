/**
 * PayPal Payment Provider
 * 
 * Implements PaymentProvider interface for PayPal gateway
 */

import { 
  PaymentProvider, 
  PaymentConfig, 
  CheckoutResult, 
  WebhookEvent,
  ProviderInfo 
} from '../types'

export class PayPalProvider implements PaymentProvider {
  readonly name = 'paypal' as const
  
  private getConfig() {
    const config = {
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
      mode: process.env.PAYPAL_MODE || 'sandbox'
    }
    
    if (!config.clientId || !config.clientSecret) {
      throw new Error('Missing PayPal credentials')
    }
    
    return config
  }

  private async getAccessToken(): Promise<string> {
    const config = this.getConfig()
    const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')
    
    const response = await fetch(
      config.mode === 'production' 
        ? 'https://api-m.paypal.com/v1/oauth2/token'
        : 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      }
    )
    
    const data = await response.json()
    return data.access_token
  }

  async createCheckoutSession(config: PaymentConfig): Promise<CheckoutResult> {
    const accessToken = await this.getAccessToken()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const config2 = this.getConfig()
    
    const response = await fetch(
      config2.mode === 'production'
        ? 'https://api-m.paypal.com/v2/checkout/orders'
        : 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: config.currency,
              value: config.amount.toFixed(2)
            },
            description: config.description || 'Kritvia Subscription'
          }],
          payer: {
            email_address: config.customerEmail,
            name: config.customerName ? { given_name: config.customerName } : undefined
          },
          application_context: {
            return_url: `${appUrl}/billing/success`,
            cancel_url: `${appUrl}/billing/cancel`
          }
        })
      }
    )
    
    const order = await response.json()
    
    const approvalUrl = order.links?.find((link: any) => link.rel === 'approve')?.href
    
    return {
      url: approvalUrl || '',
      sessionId: order.id,
      provider: 'paypal'
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<WebhookEvent | null> {
    // PayPal webhook verification
    const config = this.getConfig()
    
    try {
      const transmissionId = signature
      const transmissionSig = signature
      const timestamp = Date.now().toString()
      
      // In production, verify using PayPal's SDK
      // For now, return parsed event
      const event = JSON.parse(payload)
      
      return {
        id: event.id || `pp_${Date.now()}`,
        type: event.event_type || 'unknown',
        data: event.resource,
        timestamp: new Date(event.create_time || Date.now())
      }
    } catch (err) {
      console.error('PayPal webhook verification failed:', err)
      return null
    }
  }

  async createCustomer(email: string, name?: string): Promise<string> {
    // PayPal doesn't have a direct customer creation API
    // We use the email as identifier
    return `paypal_${Buffer.from(email).toString('base64').substring(0, 20)}`
  }

  async createSubscription(customerId: string, priceId: string): Promise<{ url: string }> {
    const accessToken = await this.getAccessToken()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const config = this.getConfig()
    
    const response = await fetch(
      config.mode === 'production'
        ? 'https://api-m.paypal.com/v1/billing/subscriptions'
        : 'https://api-m.sandbox.paypal.com/v1/billing/subscriptions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan_id: priceId,
          subscriber: {
            email_address: customerId
          },
          application_context: {
            return_url: `${appUrl}/dashboard?subscription=success`,
            cancel_url: `${appUrl}/billing/cancel`
          }
        })
      }
    )
    
    const subscription = await response.json()
    
    const approvalUrl = subscription.links?.find((link: any) => link.rel === 'approve')?.href
    
    return { url: approvalUrl || `${appUrl}/dashboard?subscription=success` }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken()
      const config = this.getConfig()
      
      await fetch(
        config.mode === 'production'
          ? `https://api-m.paypal.com/v1/billing/subscriptions/${subscriptionId}/cancel`
          : `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      return true
    } catch (error) {
      console.error('Failed to cancel PayPal subscription:', error)
      return false
    }
  }

  getProviderInfo(): ProviderInfo {
    return {
      name: 'paypal',
      displayName: 'PayPal',
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'INR'],
      supportedCountries: ['US', 'UK', 'AU', 'CA', 'DE', 'FR', 'JP', 'IN'],
      requiresWebhookSecret: true,
      fees: {
        fixed: 0.30,
        percentage: 2.99
      }
    }
  }
}
