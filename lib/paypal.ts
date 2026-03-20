import { NextResponse } from 'next/server'

// PayPal API base URL
const PAYPAL_API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com'

// Get PayPal access token using client credentials
export async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64')

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  if (!data.access_token) {
    throw new Error('Failed to get PayPal access token')
  }
  return data.access_token
}

// Create a PayPal subscription
export async function createPayPalSubscription(accessToken: string, planId: string, user: any): Promise<string> {
  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      plan_id: planId,
      subscriber: {
        name: {
          given_name: user.name?.split(' ')[0] || '',
          surname: user.name?.split(' ')[1] || '',
        },
        email_address: user.email,
      },
      application_context: {
        brand_name: 'Kritvia',
        landing_page: 'LOGIN',
        user_action: 'SUBSCRIBE_NOW',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription_token={token}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to create PayPal subscription: ${errorData.message || response.statusText}`)
  }

  const data = await response.json()
  const approvalLink = data.links.find((link: { rel: string; href: string }) => link.rel === 'approve')?.href
  if (!approvalLink) {
    throw new Error('Approval link not found in PayPal response')
  }
  return approvalLink
}

// Cancel a PayPal subscription
export async function cancelPayPalSubscription(accessToken: string, subscriptionId: string): Promise<void> {
  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to cancel PayPal subscription: ${errorData.message || response.statusText}`)
  }
}

// Get details of a PayPal subscription
export async function getPayPalSubscriptionDetails(accessToken: string, subscriptionId: string): Promise<any> {
  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to get PayPal subscription details: ${errorData.message || response.statusText}`)
  }
  return response.json()
}