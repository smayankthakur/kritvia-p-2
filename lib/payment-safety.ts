/**
 * Payment Safety System
 * Transaction logging, idempotency, and failsafe mechanisms
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'

export interface PaymentTransaction {
  id?: string
  workspace_id: string
  provider: string
  transaction_id: string
  idempotency_key?: string
  amount: number
  currency: string
  status: PaymentStatus
  customer_email?: string
  metadata?: Record<string, string>
  error_message?: string
  created_at?: string
  completed_at?: string
}

/**
 * Create a payment transaction record
 */
export async function createPaymentTransaction(
  transaction: Omit<PaymentTransaction, 'id' | 'created_at' | 'completed_at'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert(transaction)
      .select('id')
      .single()

    if (error) {
      console.error('Error creating payment transaction:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (error) {
    console.error('Error in createPaymentTransaction:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Update payment transaction status
 */
export async function updatePaymentStatus(
  transactionId: string,
  status: PaymentStatus,
  errorMessage?: string
): Promise<{ success: boolean }> {
  try {
    const updateData: Record<string, any> = { status }

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    if (errorMessage) {
      updateData.error_message = errorMessage
    }

    const { error } = await supabase
      .from('payment_transactions')
      .update(updateData)
      .eq('transaction_id', transactionId)

    if (error) {
      console.error('Error updating payment status:', error)
      return { success: false }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in updatePaymentStatus:', error)
    return { success: false }
  }
}

/**
 * Check idempotency - prevent duplicate payments
 */
export async function checkIdempotency(
  idempotencyKey: string,
  workspaceId: string
): Promise<{ canProceed: boolean; existingStatus?: PaymentStatus; existingId?: string }> {
  try {
    const { data: existing } = await supabase
      .from('payment_transactions')
      .select('id, status')
      .eq('idempotency_key', idempotencyKey)
      .eq('workspace_id', workspaceId)
      .in('status', ['pending', 'processing', 'completed'])
      .limit(1)
      .single()

    if (existing) {
      return {
        canProceed: false,
        existingStatus: existing.status as PaymentStatus,
        existingId: existing.id,
      }
    }

    return { canProceed: true }
  } catch (error) {
    // If no existing record, allow proceeding
    return { canProceed: true }
  }
}

/**
 * Record successful payment and activate subscription
 */
export async function activateSubscription(
  workspaceId: string,
  transactionId: string,
  subscriptionData: {
    plan: string
    customerId: string
    subscriptionId: string
    periodStart: string
    periodEnd: string
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Start a transaction (using RPC if available, or sequential operations)
    
    // 1. Update transaction status
    await updatePaymentStatus(transactionId, 'completed')

    // 2. Update or create subscription
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('workspace_id', workspaceId)
      .single()

    if (existingSub) {
      await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          plan: subscriptionData.plan,
          stripe_subscription_id: subscriptionData.subscriptionId,
          current_period_start: subscriptionData.periodStart,
          current_period_end: subscriptionData.periodEnd,
          updated_at: new Date().toISOString(),
        })
        .eq('workspace_id', workspaceId)
    } else {
      await supabase.from('subscriptions').insert({
        workspace_id: workspaceId,
        plan: subscriptionData.plan,
        status: 'active',
        stripe_customer_id: subscriptionData.customerId,
        stripe_subscription_id: subscriptionData.subscriptionId,
        current_period_start: subscriptionData.periodStart,
        current_period_end: subscriptionData.periodEnd,
      })
    }

    // 3. Update workspace plan
    await supabase
      .from('workspaces')
      .update({
        plan: subscriptionData.plan,
        subscription_status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', workspaceId)

    return { success: true }
  } catch (error) {
    console.error('Error activating subscription:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Handle failed payment - do NOT activate subscription
 */
export async function handleFailedPayment(
  transactionId: string,
  errorMessage: string
): Promise<{ success: boolean }> {
  console.error(`Payment failed for transaction ${transactionId}:`, errorMessage)

  // Update transaction status to failed
  await updatePaymentStatus(transactionId, 'failed', errorMessage)

  // DO NOT activate subscription - this is the failsafe
  
  return { success: true }
}

/**
 * Verify webhook event matches known transaction
 */
export async function verifyWebhookTransaction(
  provider: string,
  transactionId: string
): Promise<{ valid: boolean; workspaceId?: string }> {
  try {
    const { data: transaction } = await supabase
      .from('payment_transactions')
      .select('workspace_id')
      .eq('transaction_id', transactionId)
      .eq('provider', provider)
      .single()

    if (transaction) {
      return { valid: true, workspaceId: transaction.workspace_id }
    }

    return { valid: false }
  } catch (error) {
    console.error('Error verifying webhook transaction:', error)
    return { valid: false }
  }
}

/**
 * Get payment history for workspace
 */
export async function getPaymentHistory(
  workspaceId: string,
  limit: number = 10
): Promise<PaymentTransaction[]> {
  const { data } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}

/**
 * Calculate subscription renewal date
 */
export function calculateRenewalDate(interval: 'monthly' | 'yearly'): {
  start: string
  end: string
} {
  const now = new Date()
  const start = now.toISOString()
  
  const end = new Date(now)
  if (interval === 'monthly') {
    end.setMonth(end.getMonth() + 1)
  } else {
    end.setFullYear(end.getFullYear() + 1)
  }

  return {
    start,
    end: end.toISOString(),
  }
}

export default {
  createPaymentTransaction,
  updatePaymentStatus,
  checkIdempotency,
  activateSubscription,
  handleFailedPayment,
  verifyWebhookTransaction,
  getPaymentHistory,
  calculateRenewalDate,
}
