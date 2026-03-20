/**
 * Cashfree Payment Provider
 * 
 * Implements PaymentProvider interface for Cashfree gateway (India)
 */

import { 
  PaymentProvider, 
  PaymentConfig, 
  CheckoutResult, 
  WebhookEvent,
  ProviderInfo 
} from '../types'

export class CashfreeProvider implements PaymentProvider {
  readonly name = 'cashfree' as const
  
  private getConfig(): { appId: string; secretKey: string; environment: string } {
    const appId = process.env.CASHFREE_APP_ID
    const secretKey = process.env.CASHFREE_SECRET_KEY
    const environment = process.env.CASHFREE_ENV || 'sandbox'
    
    if (!appId || !secretKey) {
      throw new Error('Missing Cashfree credentials')
    }
    
    return { appId, secretKey, environment }
  }

  private getBaseUrl(): string {
    return this.getConfig().environment === 'production'
      ? 'https://api.cashfree.com'
      : 'https://sandbox.cashfree.com'
  }

  private async generateSignature(body: string): Promise<string> {
    const crypto = await import('crypto')
    const config = this.getConfig()
    return crypto
      .createHmac('sha256', config.secretKey)
      .update(body)
      .digest('base64')
  }

  async createCheckoutSession(config: PaymentConfig): Promise<CheckoutResult> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const cfConfig = this.getConfig()
    
    const orderId = `order_${Date.now()}`
    const orderData = {
      order_id: orderId,
      order_amount: config.amount,
      order_currency: config.currency,
      customer_details: {
        customer_id: config.customerEmail,
        customer_name: config.customerName || config.customerEmail,
        customer_email: config.customerEmail
      },
      order_meta: {
        return_url: `${appUrl}/billing/success?order_id=${orderId}`,
        notify_url: `${appUrl}/api/webhooks/cashfree`
      }
    }
    
    const response = await fetch(`${this.getBaseUrl()}/pg/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': cfConfig.appId,
        'x-client-secret': cfConfig.secretKey
      } as Record<string, string>,
      body: JSON.stringify(orderData)
    })
    
    await response.json()
    
    return {
      url: `${this.getBaseUrl()}/checkout/v2/pay?order_id=${orderId}`,
      sessionId: orderId,
      provider: 'cashfree'
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<WebhookEvent | null> {
    try {
      const expectedSignature = await this.generateSignature(payload)
      
      if (expectedSignature !== signature) {
        console.error('Cashfree signature mismatch')
        return null
      }
      
      const event = JSON.parse(payload)
      
      return {
        id: event.order_id || `cf_${Date.now()}`,
        type: event.type || 'payment',
        data: event,
        timestamp: new Date(event.order_date || Date.now())
      }
    } catch (err) {
      console.error('Cashfree webhook verification failed:', err)
      return null
    }
  }

  async createCustomer(email: string, name?: string): Promise<string> {
    const cfConfig = this.getConfig()
    
    const customerId = `cust_${Date.now()}`
    const baseUrl = this.getBaseUrl()
    
    await fetch(`${baseUrl}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': cfConfig.appId,
        'x-client-secret': cfConfig.secretKey
      } as Record<string, string>,
      body: JSON.stringify({
        customer_id: customerId,
        customer_email: email,
        customer_name: name || email.split('@')[0]
      })
    })
    
    return customerId
  }

  async createSubscription(customerId: string, planId: string): Promise<{ url: string }> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    return { 
      url: `${appUrl}/dashboard?subscription=created` 
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log('Cashfree subscription cancellation not implemented')
    return false
  }

  getProviderInfo(): ProviderInfo {
    return {
      name: 'cashfree',
      displayName: 'Cashfree',
      supportedCurrencies: ['INR', 'USD'],
      supportedCountries: ['IN'],
      requiresWebhookSecret: true,
      fees: {
        fixed: 0,
        percentage: 1.75
      }
    }
  }
}
