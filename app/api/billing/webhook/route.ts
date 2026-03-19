import { NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { constructWebhookEvent, getPlanFromPriceId } from '@/lib/stripe'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      logger.warn('Missing Stripe signature')
      return new Response('Missing signature', { status: 400 })
    }

    let event
    try {
      event = constructWebhookEvent(body, signature)
    } catch (err) {
      logger.error('Webhook signature verification failed', err as Error)
      return new Response('Invalid signature', { status: 400 })
    }

    const supabase = await createServerSupabase()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        
        const userId = session.metadata?.userId
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        if (!userId) {
          logger.warn('Checkout completed without userId', { sessionId: session.id })
          break
        }

        // Get subscription to find the plan
        const priceId = (session as any).line_items?.data?.[0]?.price?.id ||
          (session as any).subscription_details?.items?.data?.[0]?.price?.id

        const planId = getPlanFromPriceId(priceId) || 'starter'

        // Update user with subscription info
        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: {
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan: planId,
          }
        })

        logger.info('Subscription created', { userId, customerId, subscriptionId, planId })
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        
        const customerId = subscription.customer as string
        const status = subscription.status
        const priceId = subscription.items?.data?.[0]?.price?.id

        // Find user by customer ID
        const { data: users } = await supabase.auth.admin.listUsers()
        const user = users?.users.find(u => 
          u.user_metadata?.stripe_customer_id === customerId
        )

        if (!user) {
          logger.warn('Subscription update: user not found', { customerId })
          break
        }

        const planId = getPlanFromPriceId(priceId) || 
          (status === 'active' ? 'starter' : 'free')

        // Update user plan
        await supabase.auth.admin.updateUserById(user.id, {
          user_metadata: {
            plan: planId,
            subscription_status: status,
          }
        })

        logger.info('Subscription updated', { 
          userId: user.id, 
          planId, 
          status 
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        
        const customerId = subscription.customer as string

        // Find user by customer ID
        const { data: users } = await supabase.auth.admin.listUsers()
        const user = users?.users.find(u => 
          u.user_metadata?.stripe_customer_id === customerId
        )

        if (!user) {
          logger.warn('Subscription deleted: user not found', { customerId })
          break
        }

        // Downgrade to free
        await supabase.auth.admin.updateUserById(user.id, {
          user_metadata: {
            plan: 'free',
            subscription_status: 'canceled',
            stripe_subscription_id: null,
          }
        })

        logger.info('Subscription canceled', { userId: user.id })
        break
      }

      default:
        logger.info('Unhandled webhook event', { type: event.type })
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    logger.error('Webhook processing error', error as Error)
    return new Response('Webhook error', { status: 500 })
  }
}
