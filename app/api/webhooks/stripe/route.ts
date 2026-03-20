import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createServerSupabase } from '@/lib/supabase-server'

// Force runtime execution - prevents Next.js from evaluating at build time
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed.`, err)
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}` },
      { status: 400 }
    )
  }

  const supabase = await createServerSupabase()

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const plan = session.metadata?.plan as 'starter' | 'pro' | 'enterprise' | undefined

      if (userId && plan) {
        const { error } = await supabase
          .from('users')
          .update({
            plan,
            subscription_status: 'active',
            stripe_customer_id: session.customer as string,
          })
          .eq('id', userId)

        if (error) {
          console.error('Error updating user after checkout.session.completed:', error)
        }
      }
      break
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      const { data: users, error } = await supabase
        .from('users')
        .select('id')
        .eq('stripe_customer_id', customerId)

      if (error) {
        console.error('Error fetching user by stripe_customer_id:', error)
        break
      }

      if (users && users.length > 0) {
        const userId = users[0].id
        const { error } = await supabase
          .from('users')
          .update({
            subscription_status: 'active',
          })
          .eq('id', userId)

        if (error) {
          console.error('Error updating user after invoice.payment_succeeded:', error)
        }
      }
      break
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      const status = subscription.status

      const { data: users, error } = await supabase
        .from('users')
        .select('id, plan')
        .eq('stripe_customer_id', customerId)

      if (error) {
        console.error('Error fetching user by stripe_customer_id:', error)
        break
      }

      if (users && users.length > 0) {
        const userId = users[0].id
        const { error } = await supabase
          .from('users')
          .update({
            subscription_status: status as 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid',
          })
          .eq('id', userId)

        if (error) {
          console.error('Error updating user after customer.subscription.updated:', error)
        }
      }
      break
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const { data: users, error } = await supabase
        .from('users')
        .select('id')
        .eq('stripe_customer_id', customerId)

      if (error) {
        console.error('Error fetching user by stripe_customer_id:', error)
        break
      }

      if (users && users.length > 0) {
        const userId = users[0].id
        const { error } = await supabase
          .from('users')
          .update({
            subscription_status: 'canceled',
          })
          .eq('id', userId)

        if (error) {
          console.error('Error updating user after customer.subscription.deleted:', error)
        }
      }
      break
    }
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true })
}
