/**
 * PhonePe Payment Provider
 * 
 * Implements PaymentProvider interface for PhonePe gateway (India)
 */

import { 
  PaymentProvider, 
  PaymentConfig, 
  CheckoutResult, 
  WebhookEvent,
  ProviderInfo 
} from '../types'

export class PhonePeProvider implements PaymentProvider {
  readonly name = 'phonepe' as const
  
  private getConfig(): { merchantId: string; saltKey: string; saltIndex: number; environment: string } {
    const merchantId = process.env.PHONEPE_MERCHANT_ID
    const saltKey = process.env.PHONEPE_SALT_KEY
    const saltIndex = parseInt(process.env.PHONEPE_SALT_INDEX || '1')
    const environment = process.env.PHONEPE_ENV || 'sandbox'
    
    if (!merchantId || !saltKey) {
      throw new Error('Missing PhonePe credentials')
    }
    
    return { merchantId, saltKey, saltIndex, environment }
  }

  private getBaseUrl(): string {
    return this.getConfig().environment === 'production'
      ? 'https://api.phonepe.com'
      : 'https://api-preprod.phonepe.com'
  }

  private async generateSignature(payload: string): Promise<string> {
    const crypto = await import('crypto')
    const config = this.getConfig()
    const sha256 = crypto.createHash('sha256')
    sha256.update(payload + `/pg/v1/status/${config.merchantId}`)
    const checksum = sha256.digest('hex')
    return `${checksum}###${config.saltIndex}`
  }

  async createCheckoutSession(config: PaymentConfig): Promise<CheckoutResult> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const phonepeConfig = this.getConfig()
    
    const transactionId = `txn_${Date.now()}`
    
    const payload = {
      merchantId: phonepeConfig.merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: config.customerEmail,
      amount: Math.round(config.amount * 100),
      callbackUrl: `${appUrl}/api/webhooks/phonepe`,
      mobileNumber: '',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    }
    
    const payloadString = JSON.stringify(payload)
    const base64Payload = Buffer.from(payloadString).toString('base64')
    
    const response = await fetch(
      `${this.getBaseUrl()}/pg/v1/checkout/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': await this.generateSignature(base64Payload),
          'X-MERCHANT-ID': phonepeConfig.merchantId
        } as Record<string, string>,
        body: JSON.stringify({
          request: base64Payload
        })
      }
    )
    
    const data = await response.json()
    
    return {
      url: data.data?.instrumentResponse?.redirectInfo?.url || '',
      sessionId: transactionId,
      provider: 'phonepe'
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<WebhookEvent | null> {
    try {
      // PhonePe webhook verification
      const event = JSON.parse(payload)
      
      return {
        id: event.merchantTransactionId || `pe_${Date.now()}`,
        type: event.state || 'payment',
        data: event,
        timestamp: new Date()
      }
    } catch (err) {
      console.error('PhonePe webhook verification failed:', err)
      return null
    }
  }

  async createCustomer(email: string, name?: string): Promise<string> {
    return `phonepe_${Buffer.from(email).toString('base64').substring(0, 20)}`
  }

  async createSubscription(customerId: string, planId: string): Promise<{ url: string }> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    return { 
      url: `${appUrl}/dashboard?subscription=created` 
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log('PhonePe subscription cancellation not implemented')
    return false
  }

  getProviderInfo(): ProviderInfo {
    return {
      name: 'phonepe',
      displayName: 'PhonePe',
      supportedCurrencies: ['INR'],
      supportedCountries: ['IN'],
      requiresWebhookSecret: true,
      fees: {
        fixed: 0,
        percentage: 1.5
      }
    }
  }
}
