/**
 * Background Worker
 * Runs autonomous cycles at regular intervals
 */

import { createClient } from '@supabase/supabase-js'
import { runAutonomousCycle, processLeads, processDeals, getAutonomousStatus } from './ai/autonomousEngine'
import { getSystemConfig, getSystemMode } from './ai/rules'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Worker configuration
interface WorkerConfig {
  intervalSeconds: number
  maxActionsPerHour: number
  enabled: boolean
}

const DEFAULT_CONFIG: WorkerConfig = {
  intervalSeconds: 60, // Run every minute
  maxActionsPerHour: 100,
  enabled: true,
}

let workerInterval: NodeJS.Timeout | null = null
let isRunning = false

/**
 * Start the background worker
 */
export function startWorker(config: Partial<WorkerConfig> = {}): void {
  if (workerInterval) {
    console.log('[Worker] Already running')
    return
  }
  
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  if (!finalConfig.enabled) {
    console.log('[Worker] Disabled in configuration')
    return
  }
  
  console.log(`[Worker] Starting with interval: ${finalConfig.intervalSeconds}s`)
  
  // Run immediately on start
  runWorkerCycle().catch(err => console.error('[Worker] Cycle error:', err))
  
  // Schedule regular runs
  workerInterval = setInterval(async () => {
    await runWorkerCycle()
  }, finalConfig.intervalSeconds * 1000)
}

/**
 * Stop the background worker
 */
export function stopWorker(): void {
  if (workerInterval) {
    clearInterval(workerInterval)
    workerInterval = null
    console.log('[Worker] Stopped')
  }
}

/**
 * Run a single worker cycle
 */
async function runWorkerCycle(): Promise<void> {
  if (isRunning) {
    console.log('[Worker] Previous cycle still running, skipping')
    return
  }
  
  isRunning = true
  
  try {
    // Check system mode
    const mode = await getSystemMode()
    
    if (mode === 'manual') {
      console.log('[Worker] System in manual mode, skipping cycle')
      return
    }
    
    // Check rate limits
    const config = await getSystemConfig()
    const maxActions = config?.maxActionsPerHour || DEFAULT_CONFIG.maxActionsPerHour
    
    // Get recent action count
    const { count } = await supabase
      .from('ai_autonomous_actions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .eq('status', 'completed')
    
    if ((count || 0) >= maxActions) {
      console.log('[Worker] Rate limit reached, skipping cycle')
      return
    }
    
    const remainingActions = maxActions - (count || 0)
    console.log(`[Worker] Starting cycle. Remaining actions: ${remainingActions}`)
    
    // Run autonomous cycle on events
    const eventResult = await runAutonomousCycle()
    
    // Run lead processing (less frequently in production)
    const leadResult = await processLeads()
    
    // Run deal processing (less frequently in production)
    const dealResult = await processDeals()
    
    // Log summary
    console.log(`[Worker] Cycle complete:
      Events: ${eventResult.eventsProcessed}
      Decisions: ${eventResult.decisions.length}
      Actions: ${eventResult.actionsExecuted} executed, ${eventResult.actionsFailed} failed
      Approvals: ${eventResult.approvalsRequired}
      Lead Actions: ${leadResult.actionsExecuted} executed
      Deal Actions: ${dealResult.actionsExecuted} executed
      Errors: ${eventResult.errors.length}`)
      
  } catch (error) {
    console.error('[Worker] Cycle error:', error)
  } finally {
    isRunning = false
  }
}

/**
 * Get worker status
 */
export function getWorkerStatus(): {
  isRunning: boolean
  isActive: boolean
  lastCycle: string | null
} {
  return {
    isRunning,
    isActive: workerInterval !== null,
    lastCycle: new Date().toISOString(),
  }
}

/**
 * Trigger a manual worker cycle
 */
export async function triggerManualCycle(): Promise<{
  success: boolean
  message: string
  details?: {
    eventsProcessed: number
    decisions: number
    actionsExecuted: number
    actionsFailed: number
    approvalsRequired: number
  }
}> {
  try {
    const result = await runAutonomousCycle()
    return {
      success: true,
      message: 'Manual cycle completed successfully',
      details: {
        eventsProcessed: result.eventsProcessed,
        decisions: result.decisions.length,
        actionsExecuted: result.actionsExecuted,
        actionsFailed: result.actionsFailed,
        approvalsRequired: result.approvalsRequired,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: `Cycle failed: ${error}`,
    }
  }
}

/**
 * Process pending approvals
 * This can be called separately or as part of the worker cycle
 */
export async function processPendingApprovals(): Promise<{
  processed: number
  executed: number
  failed: number
}> {
  const { data: approvals } = await supabase
    .from('ai_action_approvals')
    .select('*')
    .eq('approved', false)
    .order('created_at', { ascending: true })
    .limit(20)
  
  if (!approvals || approvals.length === 0) {
    return { processed: 0, executed: 0, failed: 0 }
  }
  
  let executed = 0
  let failed = 0
  
  // Import dynamically to avoid circular dependencies
  const { executeAutonomousAction } = await import('./ai/actionEngine')
  
  for (const approval of approvals) {
    try {
      // Execute the action (decision was already evaluated)
      // We need to reconstruct the decision from approval
      const decision = {
        decisionId: approval.action_id,
        type: approval.decision_type,
        action: approval.action_type as any,
        parameters: approval.metadata || {},
        confidence: 0.8, // Use stored confidence in real implementation
        priority: 'high' as const,
        riskLevel: approval.risk_level as any,
        executionMode: 'auto_execute' as const,
        reason: approval.reason,
        leadId: approval.entity_type === 'lead' ? approval.entity_id : undefined,
        dealId: approval.entity_type === 'deal' ? approval.entity_id : undefined,
      }
      
      const result = await executeAutonomousAction(decision)
      
      if (result.success) {
        executed++
        // Mark approval as processed
        await supabase
          .from('ai_action_approvals')
          .update({ approved: true, approved_at: new Date().toISOString() })
          .eq('id', approval.id)
      } else {
        failed++
      }
    } catch (error) {
      failed++
      console.error(`[Worker] Approval execution error: ${error}`)
    }
  }
  
  return { processed: approvals.length, executed, failed }
}

/**
 * Safety check - log and potentially block high-risk actions
 */
export async function safetyCheck(
  actionType: string,
  parameters: Record<string, unknown>
): Promise<{ allowed: boolean; reason?: string }> {
  // Log the safety check
  await supabase
    .from('ai_safety_logs')
    .insert({
      event_type: 'safety_check',
      severity: 'info',
      message: `Safety check for action: ${actionType}`,
      metadata: { actionType, parameters },
    })
  
  // Check for blocked actions
  const { data: config } = await supabase
    .from('ai_system_modes')
    .select('blocked_actions')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  const blockedActions = config?.blocked_actions || []
  
  if (blockedActions.includes(actionType)) {
    await supabase
      .from('ai_safety_logs')
      .insert({
        event_type: 'action_blocked',
        severity: 'warning',
        message: `Action blocked: ${actionType}`,
        metadata: { actionType, parameters },
      })
    
    return { allowed: false, reason: 'Action is blocked by system configuration' }
  }
  
  // Check for critical risk actions
  if (parameters.risk === 'critical') {
    await supabase
      .from('ai_safety_logs')
      .insert({
        event_type: 'critical_action_detected',
        severity: 'warning',
        message: `Critical action requires approval: ${actionType}`,
        metadata: { actionType, parameters },
      })
    
    return { allowed: false, reason: 'Critical actions require manual approval' }
  }
  
  return { allowed: true }
}

/**
 * Cleanup old logs (call periodically)
 */
export async function cleanupOldLogs(daysToKeep: number = 30): Promise<number> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
  
  // Cleanup safety logs
  const { count: safetyCount } = await supabase
    .from('ai_safety_logs')
    .delete()
    .lt('created_at', cutoffDate.toISOString())
    
  // Cleanup old events
  const { count: eventCount } = await supabase
    .from('ai_autonomous_events')
    .delete()
    .lt('created_at', cutoffDate.toISOString())
    .eq('processed', true)
  
  return (safetyCount || 0) + (eventCount || 0)
}

export default {
  startWorker,
  stopWorker,
  getWorkerStatus,
  triggerManualCycle,
  processPendingApprovals,
  safetyCheck,
  cleanupOldLogs,
}
