/**
 * Autonomous Engine
 * Core loop: Observe → Decide → Act → Learn
 */

import { createClient } from '@supabase/supabase-js'
import { evaluateRules, getSystemMode, type DecisionWithMetadata, type RuleContext } from './rules'
import { executeAutonomousAction, getActionHistory, getPendingApprovals } from './actionEngine'
import { recordOutcome, getLearningMetrics, getRecommendations } from './learning'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface AutonomousCycleResult {
  eventsProcessed: number
  decisions: DecisionWithMetadata[]
  actionsExecuted: number
  actionsFailed: number
  approvalsRequired: number
  errors: string[]
}

export interface AutonomousStatus {
  mode: string
  isRunning: boolean
  lastCycle: string | null
  eventsProcessed: number
  actionsExecuted: number
  pendingApprovals: number
  successRate: number
  metrics: {
    totalActions: number
    successRate: number
    averageConfidence: number
    userOverrides: number
  }
}

/**
 * Main autonomous cycle
 * Observe → Decide → Act → Learn
 */
export async function runAutonomousCycle(): Promise<AutonomousCycleResult> {
  const result: AutonomousCycleResult = {
    eventsProcessed: 0,
    decisions: [],
    actionsExecuted: 0,
    actionsFailed: 0,
    approvalsRequired: 0,
    errors: [],
  }
  
  try {
    // Get current system mode
    const mode = await getSystemMode()
    
    // Skip if not in autonomous or assistive mode
    if (mode === 'manual') {
      console.log('[Autonomous] System in manual mode, skipping cycle')
      return result
    }
    
    // Step 1: OBSERVE - Fetch new events
    const events = await fetchNewEvents()
    result.eventsProcessed = events.length
    
    // Step 2: DECIDE - Analyze context and make decisions
    for (const event of events) {
      try {
        const context = await buildContextFromEvent(event)
        const decisions = await evaluateRules(context)
        result.decisions.push(...decisions)
        
        // Mark event as processed
        await markEventProcessed(event.id)
      } catch (error) {
        result.errors.push(`Error processing event ${event.id}: ${error}`)
      }
    }
    
    // Step 3: ACT - Execute actions based on decisions
    for (const decision of result.decisions) {
      try {
        if (decision.executionMode === 'require_approval') {
          // Create approval request
          await createApprovalRequest(decision)
          result.approvalsRequired++
        } else {
          // Execute action directly
          const actionResult = await executeAutonomousAction(decision)
          
          if (actionResult.success) {
            result.actionsExecuted++
          } else {
            result.actionsFailed++
            result.errors.push(`Action failed: ${actionResult.error}`)
          }
          
          // Step 4: LEARN - Record outcome
          await recordOutcome(decision, actionResult)
        }
      } catch (error) {
        result.errors.push(`Error executing decision ${decision.decisionId}: ${error}`)
        result.actionsFailed++
      }
    }
    
    // Update last cycle timestamp
    await updateLastCycleTimestamp()
    
  } catch (error) {
    result.errors.push(`Cycle error: ${error}`)
    console.error('[Autonomous] Cycle error:', error)
  }
  
  return result
}

/**
 * Fetch unprocessed events
 */
async function fetchNewEvents() {
  const { data, error } = await supabase
    .from('ai_autonomous_events')
    .select('*')
    .eq('processed', false)
    .order('created_at', { ascending: true })
    .limit(100)
  
  if (error) {
    console.error('[Autonomous] Error fetching events:', error)
    return []
  }
  
  return data || []
}

/**
 * Build context from event
 */
async function buildContextFromEvent(event: { event_type: string; payload: Record<string, unknown> }): Promise<RuleContext> {
  const context: RuleContext = {}
  
  switch (event.event_type) {
    case 'lead_created':
    case 'lead_updated':
      context.lead = {
        id: event.payload.lead_id as string,
        email: event.payload.email as string,
        company: event.payload.company as string,
        lead_score: event.payload.lead_score as number,
        status: event.payload.status as string,
      }
      context.leadScore = event.payload.lead_score as number
      break
      
    case 'deal_updated':
      context.deal = {
        id: event.payload.deal_id as string,
        value: event.payload.value as number,
        stage: event.payload.stage as string,
        last_activity: event.payload.last_activity as string,
      }
      context.dealValue = event.payload.value as number
      
      // Calculate days inactive
      if (event.payload.last_activity) {
        const lastActivity = new Date(event.payload.last_activity as string)
        const now = new Date()
        context.daysInactive = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
      }
      break
      
    case 'payment_success':
      context.paymentStatus = 'success'
      break
      
    default:
      context.eventType = event.event_type
  }
  
  return context
}

/**
 * Mark event as processed
 */
async function markEventProcessed(eventId: string) {
  await supabase
    .from('ai_autonomous_events')
    .update({
      processed: true,
      processed_at: new Date().toISOString(),
    })
    .eq('id', eventId)
}

/**
 * Create approval request
 */
async function createApprovalRequest(decision: DecisionWithMetadata) {
  await supabase
    .from('ai_action_approvals')
    .insert({
      action_id: decision.decisionId,
      decision_type: decision.type,
      action_type: decision.action,
      entity_type: decision.leadId ? 'lead' : decision.dealId ? 'deal' : 'system',
      entity_id: decision.leadId || decision.dealId,
      risk_level: decision.riskLevel,
      execution_mode: decision.executionMode,
      reason: decision.reason,
      metadata: decision.parameters,
    })
}

/**
 * Update last cycle timestamp
 */
async function updateLastCycleTimestamp() {
  // Store in a simple key-value or settings table
  // For now, we'll just log it
  console.log(`[Autonomous] Cycle completed at ${new Date().toISOString()}`)
}

/**
 * Get autonomous system status
 */
export async function getAutonomousStatus(): Promise<AutonomousStatus> {
  const mode = await getSystemMode()
  const metrics = await getLearningMetrics(7)
  const pendingApprovals = await getPendingApprovals()
  
  // Get recent actions
  const recentActions = await getActionHistory(10)
  const completedActions = recentActions.filter(a => a.status === 'completed')
  const successCount = completedActions.filter(a => !a.error_message).length
  const successRate = completedActions.length > 0 ? successCount / completedActions.length : 0
  
  return {
    mode,
    isRunning: mode !== 'manual',
    lastCycle: new Date().toISOString(),
    eventsProcessed: metrics.totalActions,
    actionsExecuted: metrics.totalActions,
    pendingApprovals: pendingApprovals.length,
    successRate,
    metrics,
  }
}

/**
 * Process a specific event immediately
 */
export async function processEvent(eventId: string): Promise<{
  decisions: DecisionWithMetadata[]
  actionResults: { success: boolean; error?: string }[]
}> {
  const { data: event } = await supabase
    .from('ai_autonomous_events')
    .select('*')
    .eq('id', eventId)
    .single()
  
  if (!event) {
    throw new Error('Event not found')
  }
  
  const context = await buildContextFromEvent(event)
  const decisions = await evaluateRules(context)
  const results: { success: boolean; error?: string }[] = []
  
  for (const decision of decisions) {
    if (decision.executionMode === 'require_approval') {
      await createApprovalRequest(decision)
      results.push({ success: true, error: 'Requires approval' })
    } else {
      const result = await executeAutonomousAction(decision)
      results.push({ success: result.success, error: result.error })
    }
  }
  
  await markEventProcessed(eventId)
  
  return { decisions, actionResults: results }
}

/**
 * Trigger an autonomous cycle for leads
 */
export async function processLeads(): Promise<AutonomousCycleResult> {
  // Fetch active leads
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .in('status', ['new', 'contacted', 'qualified'])
    .order('created_at', { ascending: false })
    .limit(50)
  
  if (!leads || leads.length === 0) {
    return { eventsProcessed: 0, decisions: [], actionsExecuted: 0, actionsFailed: 0, approvalsRequired: 0, errors: [] }
  }
  
  let decisions: DecisionWithMetadata[] = []
  let actionsExecuted = 0
  let actionsFailed = 0
  let approvalsRequired = 0
  const errors: string[] = []
  
  for (const lead of leads) {
    const context: RuleContext = {
      lead: {
        id: lead.id,
        email: lead.email,
        company: lead.company,
        lead_score: lead.lead_score,
        status: lead.status,
      },
      leadScore: lead.lead_score,
    }
    
    const leadDecisions = await evaluateRules(context)
    decisions.push(...leadDecisions)
  }
  
  // Execute decisions
  for (const decision of decisions) {
    try {
      if (decision.executionMode === 'require_approval') {
        await createApprovalRequest(decision)
        approvalsRequired++
      } else {
        const result = await executeAutonomousAction(decision)
        if (result.success) {
          actionsExecuted++
        } else {
          actionsFailed++
          errors.push(result.error || 'Unknown error')
        }
      }
    } catch (error) {
      actionsFailed++
      errors.push(String(error))
    }
  }
  
  return {
    eventsProcessed: leads.length,
    decisions,
    actionsExecuted,
    actionsFailed,
    approvalsRequired,
    errors,
  }
}

/**
 * Trigger an autonomous cycle for deals
 */
export async function processDeals(): Promise<AutonomousCycleResult> {
  // Fetch active deals
  const { data: deals } = await supabase
    .from('deals')
    .select('*')
    .not('stage', 'eq', 'closed_won')
    .not('stage', 'eq', 'closed_lost')
    .order('updated_at', { ascending: false })
    .limit(50)
  
  if (!deals || deals.length === 0) {
    return { eventsProcessed: 0, decisions: [], actionsExecuted: 0, actionsFailed: 0, approvalsRequired: 0, errors: [] }
  }
  
  let decisions: DecisionWithMetadata[] = []
  let actionsExecuted = 0
  let actionsFailed = 0
  let approvalsRequired = 0
  const errors: string[] = []
  
  for (const deal of deals) {
    // Calculate days inactive
    const lastActivity = deal.updated_at ? new Date(deal.updated_at) : new Date(deal.created_at)
    const daysInactive = Math.floor((new Date().getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
    
    const context: RuleContext = {
      deal: {
        id: deal.id,
        value: deal.value,
        stage: deal.stage,
        last_activity: deal.updated_at,
      },
      dealValue: deal.value,
      daysInactive,
    }
    
    const dealDecisions = await evaluateRules(context)
    decisions.push(...dealDecisions)
  }
  
  // Execute decisions
  for (const decision of decisions) {
    try {
      if (decision.executionMode === 'require_approval') {
        await createApprovalRequest(decision)
        approvalsRequired++
      } else {
        const result = await executeAutonomousAction(decision)
        if (result.success) {
          actionsExecuted++
        } else {
          actionsFailed++
          errors.push(result.error || 'Unknown error')
        }
      }
    } catch (error) {
      actionsFailed++
      errors.push(String(error))
    }
  }
  
  return {
    eventsProcessed: deals.length,
    decisions,
    actionsExecuted,
    actionsFailed,
    approvalsRequired,
    errors,
  }
}

export default {
  runAutonomousCycle,
  getAutonomousStatus,
  processEvent,
  processLeads,
  processDeals,
}
