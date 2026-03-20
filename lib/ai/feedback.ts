/**
 * Feedback Collection System
 * Tracks outcomes of AI actions for continuous learning
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Feedback types
export interface FeedbackEvent {
  id?: string
  agent_name: string
  action_id?: string
  action_type: string
  lead_id?: string
  expected_outcome?: string
  actual_outcome?: string
  success_score: number
  metadata?: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

// Predefined outcome events for tracking
export const OUTCOME_EVENTS = {
  EMAIL_SENT: 'email_sent',
  EMAIL_OPENED: 'email_opened',
  EMAIL_REPLIED: 'email_replied',
  LEAD_CONTACTED: 'lead_contacted',
  LEAD_CONVERTED: 'lead_converted',
  LEAD_LOST: 'lead_lost',
  FORM_SUBMITTED: 'form_submitted',
  PRICING_VIEWED: 'pricing_viewed',
  PLAN_SELECTED: 'plan_selected',
} as const

// Outcome scores
export const OUTCOME_SCORES = {
  email_sent: 10,
  email_opened: 20,
  email_replied: 50,
  lead_contacted: 30,
  lead_converted: 100,
  lead_lost: -20,
  form_submitted: 40,
  pricing_viewed: 15,
  plan_selected: 80,
} as const

/**
 * Record a feedback event
 */
export async function recordFeedback(feedback: Omit<FeedbackEvent, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('feedback_events')
      .insert({
        agent_name: feedback.agent_name,
        action_id: feedback.action_id,
        action_type: feedback.action_type,
        lead_id: feedback.lead_id,
        expected_outcome: feedback.expected_outcome,
        actual_outcome: feedback.actual_outcome,
        success_score: feedback.success_score,
        metadata: feedback.metadata || {},
      })
      .select('id')
      .single()

    if (error) {
      console.error('Failed to record feedback:', error)
      return null
    }

    return data.id
  } catch (error) {
    console.error('Error recording feedback:', error)
    return null
  }
}

/**
 * Track email open event
 */
export async function trackEmailOpened(actionId: string): Promise<void> {
  await recordFeedback({
    agent_name: 'sales',
    action_id: actionId,
    action_type: OUTCOME_EVENTS.EMAIL_OPENED,
    success_score: OUTCOME_SCORES.email_opened,
    actual_outcome: 'Email was opened by recipient',
  })
}

/**
 * Track email reply event
 */
export async function trackEmailReplied(actionId: string): Promise<void> {
  await recordFeedback({
    agent_name: 'sales',
    action_id: actionId,
    action_type: OUTCOME_EVENTS.EMAIL_REPLIED,
    success_score: OUTCOME_SCORES.email_replied,
    actual_outcome: 'Recipient replied to email',
  })
}

/**
 * Track lead conversion
 */
export async function trackLeadConversion(leadId: string, agentName: string = 'sales'): Promise<void> {
  await recordFeedback({
    agent_name: agentName,
    action_id: leadId,
    action_type: OUTCOME_EVENTS.LEAD_CONVERTED,
    lead_id: leadId,
    success_score: OUTCOME_SCORES.lead_converted,
    actual_outcome: 'Lead converted to customer',
  })
}

/**
 * Track lead lost
 */
export async function trackLeadLost(leadId: string, agentName: string = 'sales'): Promise<void> {
  await recordFeedback({
    agent_name: agentName,
    action_id: leadId,
    action_type: OUTCOME_EVENTS.LEAD_LOST,
    lead_id: leadId,
    success_score: OUTCOME_SCORES.lead_lost,
    actual_outcome: 'Lead was lost',
  })
}

/**
 * Get feedback for an agent
 */
export async function getAgentFeedback(agentName: string, limit: number = 50): Promise<FeedbackEvent[]> {
  try {
    const { data, error } = await supabase
      .from('feedback_events')
      .select('*')
      .eq('agent_name', agentName)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Failed to fetch feedback:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return []
  }
}

/**
 * Get recent feedback events
 */
export async function getRecentFeedback(limit: number = 100): Promise<FeedbackEvent[]> {
  try {
    const { data, error } = await supabase
      .from('feedback_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Failed to fetch feedback:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return []
  }
}

/**
 * Calculate average success score for an agent
 */
export async function getAgentSuccessRate(agentName: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('feedback_events')
      .select('success_score')
      .eq('agent_name', agentName)

    if (error || !data || data.length === 0) {
      return 0
    }

    const total = data.reduce((sum, event) => sum + event.success_score, 0)
    return total / data.length
  } catch (error) {
    console.error('Error calculating success rate:', error)
    return 0
  }
}

export default {
  recordFeedback,
  trackEmailOpened,
  trackEmailReplied,
  trackLeadConversion,
  trackLeadLost,
  getAgentFeedback,
  getRecentFeedback,
  getAgentSuccessRate,
  OUTCOME_EVENTS,
  OUTCOME_SCORES,
}
