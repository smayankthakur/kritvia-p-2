/**
 * Payment Gateway Factory
 * 
 * Factory pattern for creating payment provider instances
 */

import { PaymentProvider, PaymentProviderName, ProviderInfo } from './types'
import { StripeProvider } from './providers/stripe'
import { PayPalProvider } from './providers/paypal'
import { RazorpayProvider } from './providers/razorpay'
import { CashfreeProvider } from './providers/cashfree'
import { PhonePeProvider } from './providers/phonepe'
import { PaytmProvider } from './providers/paytm'

// Provider registry
const providers: Record<PaymentProviderName, () => PaymentProvider> = {
  stripe: () => new StripeProvider(),
  paypal: () => new PayPalProvider(),
  razorpay: () => new RazorpayProvider(),
  cashfree: () => new CashfreeProvider(),
  phonepe: () => new PhonePeProvider(),
  paytm: () => new PaytmProvider()
}

// Provider info cache
let providerInfoCache: Map<PaymentProviderName, ProviderInfo> | null = null

/**
 * Get a payment provider instance by name
 */
export function getPaymentProvider(name: PaymentProviderName): PaymentProvider {
  const factory = providers[name]
  
  if (!factory) {
    throw new Error(`Unsupported payment provider: ${name}`)
  }
  
  return factory()
}

/**
 * Get all available provider info
 */
export function getAllProviderInfo(): ProviderInfo[] {
  if (providerInfoCache) {
    return Array.from(providerInfoCache.values())
  }
  
  providerInfoCache = new Map()
  const infoList: ProviderInfo[] = []
  
  for (const name of Object.keys(providers) as PaymentProviderName[]) {
    try {
      const provider = getPaymentProvider(name)
      const info = provider.getProviderInfo()
      providerInfoCache.set(name, info)
      infoList.push(info)
    } catch (error) {
      // Provider not configured, skip
      console.warn(`Provider ${name} not available:`, error)
    }
  }
  
  return infoList
}

/**
 * Get provider info by name
 */
export function getProviderInfo(name: PaymentProviderName): ProviderInfo | null {
  const allInfo = getAllProviderInfo()
  return allInfo.find(p => p.name === name) || null
}

/**
 * Check if a provider is available/configured
 */
export function isProviderAvailable(name: PaymentProviderName): boolean {
  try {
    getPaymentProvider(name)
    return true
  } catch {
    return false
  }
}

/**
 * Get available provider names
 */
export function getAvailableProviders(): PaymentProviderName[] {
  const available: PaymentProviderName[] = []
  
  for (const name of Object.keys(providers) as PaymentProviderName[]) {
    if (isProviderAvailable(name)) {
      available.push(name)
    }
  }
  
  return available
}

/**
 * Get recommended provider based on currency/country
 */
export function getRecommendedProvider(currency: string, country?: string): PaymentProviderName {
  // India-focused recommendations
  if (currency === 'INR' || country === 'IN') {
    // Check for Indian providers first
    if (isProviderAvailable('razorpay')) return 'razorpay'
    if (isProviderAvailable('cashfree')) return 'cashfree'
    if (isProviderAvailable('phonepe')) return 'phonepe'
    if (isProviderAvailable('paytm')) return 'paytm'
  }
  
  // Default to Stripe for international
  if (isProviderAvailable('stripe')) return 'stripe'
  
  // Fallback to PayPal
  if (isProviderAvailable('paypal')) return 'paypal'
  
  // Return first available
  const first = Object.keys(providers)[0] as PaymentProviderName
  return first
}
