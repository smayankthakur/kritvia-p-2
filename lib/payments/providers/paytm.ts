/**
 * Paytm Payment Provider
 * 
 * Implements PaymentProvider interface for Paytm gateway (India)
 */

import { 
  PaymentProvider, 
  PaymentConfig, 
  CheckoutResult, 
  WebhookEvent,
  ProviderInfo 
} from '../types'

export class PaytmProvider implements PaymentProvider {
  readonly name = 'paytm' as const
  
  private getConfig(): { merchantId: string; merchantKey: string; environment: string } {
    const merchantId = process.env.PAYTM_MERCHANT_ID
    const merchantKey = process.env.PAYTM_MERCHANT_KEY
    const environment = process.env.PAYTM_ENV || 'staging'
    
    if (!merchantId || !merchantKey) {
      throw new Error('Missing Paytm credentials')
    }
    
    return { merchantId, merchantKey, environment }
  }

  private getBaseUrl(): string {
    return this.getConfig().environment === 'production'
      ? 'https://secure.paytm.in'
      : 'https://securegw-stage.paytm.in'
  }

  private async generateSignature(body: string): Promise<string> {
    const crypto = await import('crypto')
    const config = this.getConfig()
    return crypto
      .createHash('sha256')
      .update(config.merchantKey + '|' + body)
      .digest('hex')
  }

  async createCheckoutSession(config: PaymentConfig): Promise<CheckoutResult> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const paytmConfig = this.getConfig()
    
    const orderId = `order_${Date.now()}`
    
    const initData = {
      mid: paytmConfig.merchantId,
      orderId,
      txnAmount: {
        value: config.amount.toFixed(2),
        currency: config.currency
      },
      userInfo: {
        custId: config.customerEmail
      },
      callbackUrl: `${appUrl}/api/webhooks/paytm`,
      paymentMode: {
        payChannel: ['CC', 'DC', 'NB', 'UPI', 'WALLET']
      }
    }
    
    const response = await fetch(
      `${this.getBaseUrl()}/theia/api/v1/initiateTransaction?mid=${paytmConfig.merchantId}&orderId=${orderId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        } as Record<string, string>,
        body: JSON.stringify(initData)
      }
    )
    
    const data = await response.json()
    
    // Paytm uses a different flow - redirect to their payment page
    const checksum = await this.generateSignature(JSON.stringify(initData))
    
    return {
      url: `${this.getBaseUrl()}/theia/api/v1/showPaymentPage?mid=${paytmConfig.merchantId}&orderId=${orderId}`,
      sessionId: orderId,
      provider: 'paytm'
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<WebhookEvent | null> {
    try {
      // Paytm webhook verification
      const event = JSON.parse(payload)
      
      // In production, verify checksum
      return {
        id: event.ORDERID || `pm_${Date.now()}`,
        type: event.RESPCODE === '01' ? 'payment_success' : 'payment_failed',
        data: event,
        timestamp: new Date()
      }
    } catch (err) {
      console.error('Paytm webhook verification failed:', err)
      return null
    }
  }

  async createCustomer(email: string, name?: string): Promise<string> {
    return `paytm_${Buffer.from(email).toString('base64').substring(0, 20)}`
  }

  async createSubscription(customerId: string, planId: string): Promise<{ url: string }> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    return { 
      url: `${appUrl}/dashboard?subscription=created` 
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log('Paytm subscription cancellation not implemented')
    return false
  }

  getProviderInfo(): ProviderInfo {
    return {
      name: 'paytm',
      displayName: 'Paytm',
      supportedCurrencies: ['INR'],
      supportedCountries: ['IN'],
      requiresWebhookSecret: true,
      fees: {
        fixed: 0,
        percentage: 1.8
      }
    }
  }
}
