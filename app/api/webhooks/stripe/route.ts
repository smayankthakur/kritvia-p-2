import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { supabaseServer } from '@/lib/supabase/supabase-server'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed.`, err)
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}` },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const plan = session.metadata?.plan as 'starter' | 'pro' | 'enterprise' | undefined

      if (userId && plan) {
        // Update the user's plan and subscription status in the database
        const { error } = await supabaseServer
          .from('users')
          .update({
            plan,
            subscription_status: 'active',
            stripe_customer_id: session.customer as string,
          })
          .eq('id', userId)

        if (error) {
          console.error('Error updating user after checkout.session.completed:', error)
          // We still return a 200 to Stripe to acknowledge receipt of the event
        }
      }
      break
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string
      // The subscription property might not be present on the invoice object in all cases.
      // We'll check if it exists.
      const subscriptionId = 'subscription' in invoice ? (invoice.subscription as string) : null

      // Find the user by stripe_customer_id
      const { data: users, error } = await supabaseServer
        .from('users')
        .select('id')
        .eq('stripe_customer_id', customerId)

      if (error) {
        console.error('Error fetching user by stripe_customer_id:', error)
        break
      }

      if (users.length > 0) {
        const userId = users[0].id
        // Update the user's subscription status to active (in case it was past_due)
        const { error } = await supabaseServer
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

      // Find the user by stripe_customer_id
      const { data: users, error } = await supabaseServer
        .from('users')
        .select('id, plan')
        .eq('stripe_customer_id', customerId)

      if (error) {
        console.error('Error fetching user by stripe_customer_id:', error)
        break
      }

      if (users.length > 0) {
        const userId = users[0].id
        // Update the user's subscription status
        const { error } = await supabaseServer
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

      // Find the user by stripe_customer_id
      const { data: users, error } = await supabaseServer
        .from('users')
        .select('id')
        .eq('stripe_customer_id', customerId)

      if (error) {
        console.error('Error fetching user by stripe_customer_id:', error)
        break
      }

      if (users.length > 0) {
        const userId = users[0].id
        // Update the user's subscription status to canceled and plan to free? Or keep the plan but set status to canceled?
        // According to our schema, we have a plan and a subscription_status. We'll set subscription_status to 'canceled'
        // and leave the plan as is (or we could downgrade to free? Let's leave the plan and set status to canceled).
        const { error } = await supabaseServer
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