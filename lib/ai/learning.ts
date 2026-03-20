/**
 * Learning Loop
 * Tracks action outcomes and improves decision confidence
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Types
import type { ActionName, DecisionWithMetadata, RiskLevel } from './rules'
import type { ActionResult } from './actionEngine'

export interface LearningMetrics {
  totalActions: number
  successRate: number
  averageConfidence: number
  userOverrides: number
  topPerformingActions: ActionName[]
  improvementAreas: ActionName[]
}

export interface ActionOutcome {
  actionId: string
  decisionType: string
  outcome: 'success' | 'failure' | 'user_override'
  confidenceBefore: number
  confidenceAfter?: number
  overrideReason?: string
  metrics: {
    executionTimeMs?: number
    leadId?: string
    dealId?: string
    revenue?: number
  }
}

/**
 * Record an action outcome for learning
 */
export async function recordOutcome(
  decision: DecisionWithMetadata,
  result: ActionResult,
  userOverride?: { reason: string }
): Promise<void> {
  const outcome: 'success' | 'failure' | 'user_override' = 
    result.success 
      ? 'success' 
      : userOverride 
        ? 'user_override' 
        : 'failure'
  
  // Calculate new confidence based on outcome
  const confidenceAfter = calculateNewConfidence(decision.confidence, outcome)
  
  // Record learning log
  await supabase
    .from('ai_learning_logs')
    .insert({
      action_id: decision.decisionId,
      decision_type: decision.type,
      outcome,
      confidence_before: decision.confidence,
      confidence_after: confidenceAfter,
      user_override: !!userOverride,
      override_reason: userOverride?.reason,
      metrics: {
        executionTimeMs: result.executionTimeMs,
        leadId: decision.leadId,
        dealId: decision.dealId,
        actionName: decision.action,
      },
    })
  
  // Update decision record
  await supabase
    .from('ai_decisions')
    .update({
      confidence: confidenceAfter,
      executed_at: result.success ? new Date().toISOString() : null,
    })
    .eq('id', decision.decisionId)
}

/**
 * Calculate new confidence based on outcome
 */
function calculateNewConfidence(
  currentConfidence: number,
  outcome: 'success' | 'failure' | 'user_override'
): number {
  let adjustment = 0
  
  switch (outcome) {
    case 'success':
      adjustment = 0.05 // Boost confidence
      break
    case 'failure':
      adjustment = -0.1 // Reduce confidence
      break
    case 'user_override':
      adjustment = -0.15 // Significant reduction for overrides
      break
  }
  
  // Apply exponential moving average
  const newConfidence = currentConfidence + adjustment
  
  // Clamp between 0.1 and 0.99
  return Math.max(0.1, Math.min(0.99, newConfidence))
}

/**
 * Get learning metrics for the system
 */
export async function getLearningMetrics(days: number = 30): Promise<LearningMetrics> {
  const since = new Date()
  since.setDate(since.getDate() - days)
  
  // Get all learning logs
  const { data: logs } = await supabase
    .from('ai_learning_logs')
    .select('*')
    .gte('created_at', since.toISOString())
  
  if (!logs || logs.length === 0) {
    return {
      totalActions: 0,
      successRate: 0,
      averageConfidence: 0.5,
      userOverrides: 0,
      topPerformingActions: [],
      improvementAreas: [],
    }
  }
  
  // Calculate metrics
  const totalActions = logs.length
  const successes = logs.filter(l => l.outcome === 'success').length
  const failures = logs.filter(l => l.outcome === 'failure').length
  const overrides = logs.filter(l => l.outcome === 'user_override').length
  
  const successRate = successes / totalActions
  const averageConfidence = logs.reduce((sum, l) => sum + (l.confidence_after || l.confidence_before), 0) / totalActions
  
  // Group by action type
  const actionStats: Record<string, { success: number; failure: number; override: number }> = {}
  logs.forEach(log => {
    const actionType = log.metrics?.actionName || 'unknown'
    if (!actionStats[actionType]) {
      actionStats[actionType] = { success: 0, failure: 0, override: 0 }
    }
    actionStats[actionType][log.outcome === 'success' ? 'success' : log.outcome === 'failure' ? 'failure' : 'override']++
  })
  
  // Determine top performing and improvement areas
  const topPerformingActions = Object.entries(actionStats)
    .filter(([_, stats]) => stats.success / (stats.success + stats.failure + stats.override) > 0.8)
    .map(([action]) => action as ActionName)
  
  const improvementAreas = Object.entries(actionStats)
    .filter(([_, stats]) => stats.failure / (stats.success + stats.failure + stats.override) > 0.3)
    .map(([action]) => action as ActionName)
  
  return {
    totalActions,
    successRate,
    averageConfidence,
    userOverrides: overrides,
    topPerformingActions,
    improvementAreas,
  }
}

/**
 * Get action confidence scores
 */
export async function getActionConfidences(): Promise<Record<ActionName, number>> {
  const { data: logs } = await supabase
    .from('ai_learning_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000)
  
  if (!logs || logs.length === 0) {
    // Return default confidences
    return {
      send_email: 0.7,
      create_task: 0.8,
      update_lead_status: 0.75,
      move_deal_stage: 0.7,
      trigger_webhook: 0.85,
      assign_sales_rep: 0.65,
    }
  }
  
  // Calculate average confidence per action type
  const actionConfidences: Record<string, number[]> = {}
  logs.forEach(log => {
    const actionType = log.metrics?.actionName || 'unknown'
    if (!actionConfidences[actionType]) {
      actionConfidences[actionType] = []
    }
    actionConfidences[actionType].push(log.confidence_after || log.confidence_before)
  })
  
  const result: Record<string, number> = {}
  Object.entries(actionConfidences).forEach(([action, confidences]) => {
    result[action] = confidences.reduce((a, b) => a + b, 0) / confidences.length
  })
  
  return result as Record<ActionName, number>
}

/**
 * Get recent learning logs
 */
export async function getRecentLearningLogs(limit: number = 50) {
  const { data, error } = await supabase
    .from('ai_learning_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw new Error(`Failed to fetch learning logs: ${error.message}`)
  
  return data || []
}

/**
 * Adjust rule confidence based on historical performance
 */
export async function adjustRuleConfidence(
  ruleId: string,
  newConfidence: number
): Promise<void> {
  // In a full implementation, this would update rule configurations
  // For now, we'll just log the adjustment
  console.log(`[Learning] Adjusting rule ${ruleId} confidence to ${newConfidence}`)
}

/**
 * Get recommendations for improving autonomous system
 */
export async function getRecommendations(): Promise<string[]> {
  const metrics = await getLearningMetrics(7)
  const recommendations: string[] = []
  
  if (metrics.successRate < 0.7) {
    recommendations.push('Consider reducing autonomy for complex actions to improve success rate')
  }
  
  if (metrics.userOverrides > metrics.totalActions * 0.1) {
    recommendations.push('High user override rate detected - review decision criteria')
  }
  
  if (metrics.improvementAreas.length > 0) {
    recommendations.push(`Focus on improving: ${metrics.improvementAreas.join(', ')}`)
  }
  
  if (metrics.averageConfidence < 0.5) {
    recommendations.push('Low average confidence - gather more training data')
  }
  
  if (metrics.topPerformingActions.length > 0) {
    recommendations.push(`Safe to auto-execute: ${metrics.topPerformingActions.join(', ')}`)
  }
  
  return recommendations
}

/**
 * Calculate outcome metrics for a specific lead or deal
 */
export async function getOutcomeMetrics(
  entityType: 'lead' | 'deal',
  entityId: string
): Promise<{
  actionsTaken: number
  conversions: number
  revenue?: number
  averageOutcome: number
}> {
  const { data: logs } = await supabase
    .from('ai_learning_logs')
    .select('*')
    .eq('metrics->>leadId', entityId)
    .order('created_at', { ascending: false })
  
  const actionsTaken = logs?.length || 0
  const successes = logs?.filter(l => l.outcome === 'success').length || 0
  
  // In a real implementation, we'd track actual conversions and revenue
  return {
    actionsTaken,
    conversions: successes,
    averageOutcome: successes / (actionsTaken || 1),
  }
}

export default {
  recordOutcome,
  getLearningMetrics,
  getActionConfidences,
  getRecentLearningLogs,
  adjustRuleConfidence,
  getRecommendations,
  getOutcomeMetrics,
}
