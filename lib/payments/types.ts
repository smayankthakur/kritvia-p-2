/**
 * Payment Gateway Orchestration System
 * 
 * Unified interface for multiple payment providers
 */

export type PaymentProviderName = 'stripe' | 'paypal' | 'razorpay' | 'cashfree' | 'phonepe' | 'paytm'

export interface PaymentConfig {
  amount: number
  currency: string
  customerEmail: string
  customerName?: string
  description?: string
  metadata?: Record<string, string>
}

export interface CheckoutResult {
  url: string
  sessionId?: string
  provider: PaymentProviderName
}

export interface WebhookEvent {
  id: string
  type: string
  data: any
  timestamp: Date
}

export interface PaymentProvider {
  readonly name: PaymentProviderName
  
  createCheckoutSession(config: PaymentConfig): Promise<CheckoutResult>
  
  verifyWebhook(payload: string, signature: string): Promise<WebhookEvent | null>
  
  createCustomer(email: string, name?: string): Promise<string>
  
  createSubscription(customerId: string, priceId: string): Promise<{ url: string }>
  
  cancelSubscription(subscriptionId: string): Promise<boolean>
  
  getProviderInfo(): ProviderInfo
}

export interface ProviderInfo {
  name: PaymentProviderName
  displayName: string
  supportedCurrencies: string[]
  supportedCountries: string[]
  requiresWebhookSecret: boolean
  fees: {
    fixed: number
    percentage: number
  }
}

export interface PaymentSettings {
  id: string
  companyId: string
  provider: PaymentProviderName
  isActive: boolean
  isPrimary: boolean
  config: EncryptedConfig
  createdAt: Date
  updatedAt: Date
}

export interface EncryptedConfig {
  encrypted: string
  iv: string
}

export interface PaymentAnalytics {
  provider: PaymentProviderName
  totalTransactions: number
  successRate: number
  averageTransactionValue: number
  failedTransactions: number
}

export interface GatewayRecommendation {
  provider: PaymentProviderName
  reason: string
  confidence: number
}
