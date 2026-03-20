/**
 * Decision Engine
 * Rule-based decision making system
 */

import { getLeads, getUserJourney, calculateBehaviorScore, type Lead, type AnalyticsEvent } from './data-intelligence'

// Decision types
export type DecisionType = 
  | 'SALES_OUTREACH'
  | 'HIGH_INTENT_MARK'
  | 'FORM_ABANDONMENT_FOLLOWUP'
  | 'PRICING_REMARKETING'
  | 'UPSELL_OPPORTUNITY'
  | 'CHURN_RISK'
  | 'REFERRAL_REQUEST'

export interface Decision {
  id: string
  type: DecisionType
  trigger: string
  leadId?: string
  userId?: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  action: string
  reason: string
  metadata?: Record<string, unknown>
  created_at: string
}

// Decision rules configuration
interface DecisionRule {
  type: DecisionType
  condition: (data: { lead?: Lead; events?: AnalyticsEvent[]; score?: number }) => boolean
  priority: 'urgent' | 'high' | 'medium' | 'low'
  action: string
  reason: string
}

// Decision rules
const DECISION_RULES: DecisionRule[] = [
  // Hot lead - trigger sales outreach
  {
    type: 'SALES_OUTREACH',
    condition: ({ lead, score }) => (lead?.lead_score ?? 0) >= 80 || (score ?? 0) >= 80,
    priority: 'urgent',
    action: 'Send urgent sales outreach email',
    reason: 'Lead score exceeds 80 - highest conversion probability',
  },
  // High intent user - visited pricing 3+ times
  {
    type: 'HIGH_INTENT_MARK',
    condition: ({ events }) => {
      const pricingVisits = events?.filter((e) => e.event_type === 'USER_VISITED_PRICING').length ?? 0
      return pricingVisits >= 3
    },
    priority: 'high',
    action: 'Mark as high intent in CRM',
    reason: 'User visited pricing page 3+ times',
  },
  // Form abandonment - trigger follow-up
  {
    type: 'FORM_ABANDONMENT_FOLLOWUP',
    condition: ({ events }) => {
      const visitedForm = events?.some((e) => e.event_type === 'USER_VISITED_PRICING') ?? false
      const submittedForm = events?.some((e) => e.event_type === 'SUBMITTED_LEAD_FORM') ?? false
      return visitedForm && !submittedForm
    },
    priority: 'medium',
    action: 'Send form abandonment follow-up email',
    reason: 'User visited pricing but did not submit form',
  },
  // Pricing remarketing
  {
    type: 'PRICING_REMARKETING',
    condition: ({ events }) => {
      const pricingVisits = events?.filter((e) => e.event_type === 'USER_VISITED_PRICING').length ?? 0
      const selectedPlan = events?.some((e) => e.event_type === 'SELECTED_PLAN') ?? false
      return pricingVisits >= 1 && !selectedPlan
    },
    priority: 'low',
    action: 'Add to pricing remarketing campaign',
    reason: 'User viewed pricing but did not convert',
  },
  // Upsell opportunity
  {
    type: 'UPSELL_OPPORTUNITY',
    condition: ({ lead }) => {
      const company = lead?.company?.toLowerCase() ?? ''
      const keywords = ['inc', 'llc', 'corp', 'group', 'solutions']
      return keywords.some((k) => company.includes(k)) && (lead?.lead_score ?? 0) >= 50
    },
    priority: 'medium',
    action: 'Personal upsell outreach',
    reason: 'Likely enterprise lead based on company name',
  },
]

/**
 * Evaluate all decision rules for a lead
 */
export async function evaluateDecisions(lead: Lead): Promise<Decision[]> {
  const decisions: Decision[] = []
  const events = await getUserJourney(lead.email || lead.id)
  const behaviorScore = calculateBehaviorScore(events)

  // Evaluate each rule
  for (const rule of DECISION_RULES) {
    if (rule.condition({ lead, events, score: behaviorScore })) {
      decisions.push({
        id: `decision-${lead.id}-${rule.type}-${Date.now()}`,
        type: rule.type,
        trigger: rule.reason,
        leadId: lead.id,
        priority: rule.priority,
        action: rule.action,
        reason: rule.reason,
        metadata: {
          leadScore: lead.lead_score,
          behaviorScore,
          eventCount: events.length,
        },
        created_at: new Date().toISOString(),
      })
    }
  }

  return decisions
}

/**
 * Evaluate decisions for all leads
 */
export async function evaluateAllDecisions(): Promise<Decision[]> {
  const allDecisions: Decision[] = []
  const leads = await getLeads()

  for (const lead of leads) {
    const leadDecisions = await evaluateDecisions(lead)
    allDecisions.push(...leadDecisions)
  }

  // Sort by priority
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
  allDecisions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  return allDecisions
}

/**
 * Get pending decisions by type
 */
export async function getDecisionsByType(type: DecisionType): Promise<Decision[]> {
  const allDecisions = await evaluateAllDecisions()
  return allDecisions.filter((d) => d.type === type)
}

/**
 * Get urgent decisions (priority: urgent or high)
 */
export async function getUrgentDecisions(): Promise<Decision[]> {
  const allDecisions = await evaluateAllDecisions()
  return allDecisions.filter((d) => d.priority === 'urgent' || d.priority === 'high')
}

/**
 * Create a custom decision
 */
export function createDecision(
  type: DecisionType,
  leadId: string,
  action: string,
  reason: string,
  priority: 'urgent' | 'high' | 'medium' | 'low' = 'medium',
  metadata?: Record<string, unknown>
): Decision {
  return {
    id: `decision-custom-${Date.now()}`,
    type,
    trigger: reason,
    leadId,
    priority,
    action,
    reason,
    metadata,
    created_at: new Date().toISOString(),
  }
}

/**
 * Batch process decisions (for cron job)
 */
export async function batchProcessDecisions(): Promise<{
  processed: number
  decisions: Decision[]
  actions: string[]
}> {
  const decisions = await evaluateAllDecisions()
  const actions: string[] = []

  // Group by type and take top actions
  const urgentDecisions = decisions.filter((d) => d.priority === 'urgent').slice(0, 10)
  const highPriorityDecisions = decisions.filter((d) => d.priority === 'high').slice(0, 20)

  const prioritizedDecisions = [...urgentDecisions, ...highPriorityDecisions]

  // Generate action list
  prioritizedDecisions.forEach((decision) => {
    actions.push(`${decision.action} for lead ${decision.leadId}: ${decision.reason}`)
  })

  return {
    processed: prioritizedDecisions.length,
    decisions: prioritizedDecisions,
    actions,
  }
}

export default {
  evaluateDecisions,
  evaluateAllDecisions,
  getDecisionsByType,
  getUrgentDecisions,
  createDecision,
  batchProcessDecisions,
}
