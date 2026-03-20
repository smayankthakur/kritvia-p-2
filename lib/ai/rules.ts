/**
 * Autonomy Rules Engine
 * Defines rules for autonomous decision making
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Types
export type ActionName = 
  | 'send_email'
  | 'create_task'
  | 'update_lead_status'
  | 'move_deal_stage'
  | 'trigger_webhook'
  | 'assign_sales_rep'

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type ExecutionMode = 'auto_execute' | 'require_approval'
export type SystemMode = 'manual' | 'assistive' | 'autonomous'

export interface AutonomyRule {
  id: string
  name: string
  condition: (context: RuleContext) => boolean
  action: ActionName
  parameters: Record<string, unknown>
  riskLevel: RiskLevel
  minConfidence: number
  cooldownHours: number
  enabled: boolean
}

export interface RuleContext {
  leadScore?: number
  dealValue?: number
  daysInactive?: number
  eventType?: string
  paymentStatus?: string
  lead?: {
    id: string
    email?: string
    company?: string
    lead_score?: number
    status?: string
  }
  deal?: {
    id: string
    value?: number
    stage?: string
    last_activity?: string
  }
}

export interface DecisionWithMetadata {
  decisionId: string
  type: string
  action: ActionName
  parameters: Record<string, unknown>
  confidence: number
  priority: 'urgent' | 'high' | 'medium' | 'low'
  riskLevel: RiskLevel
  executionMode: ExecutionMode
  reason: string
  leadId?: string
  dealId?: string
}

// Autonomy Rules Definition
const AUTONOMY_RULES: AutonomyRule[] = [
  {
    id: 'rule-lead-score-80',
    name: 'High Score Lead Auto Follow-up',
    condition: (ctx) => (ctx.leadScore ?? 0) > 80,
    action: 'send_email',
    parameters: { template: 'hot-lead-followup' },
    riskLevel: 'low',
    minConfidence: 0.7,
    cooldownHours: 24,
    enabled: true,
  },
  {
    id: 'rule-lead-score-90',
    name: 'Very Hot Lead Alert',
    condition: (ctx) => (ctx.leadScore ?? 0) > 90,
    action: 'assign_sales_rep',
    parameters: { priority: 'high' },
    riskLevel: 'medium',
    minConfidence: 0.8,
    cooldownHours: 12,
    enabled: true,
  },
  {
    id: 'rule-deal-inactive-7',
    name: 'Deal Inactive Alert',
    condition: (ctx) => (ctx.daysInactive ?? 0) > 7,
    action: 'create_task',
    parameters: { taskType: 'deal-followup', urgency: 'high' },
    riskLevel: 'low',
    minConfidence: 0.5,
    cooldownHours: 24,
    enabled: true,
  },
  {
    id: 'rule-payment-success',
    name: 'Payment Success Upsell',
    condition: (ctx) => ctx.paymentStatus === 'success',
    action: 'trigger_webhook',
    parameters: { webhook: 'upsell-campaign' },
    riskLevel: 'low',
    minConfidence: 0.6,
    cooldownHours: 48,
    enabled: true,
  },
  {
    id: 'rule-deal-stage-proposal',
    name: 'Proposal Sent Follow-up',
    condition: (ctx) => ctx.deal?.stage === 'proposal',
    action: 'send_email',
    parameters: { template: 'proposal-followup' },
    riskLevel: 'low',
    minConfidence: 0.5,
    cooldownHours: 72,
    enabled: true,
  },
  {
    id: 'rule-low-engagement',
    name: 'Low Engagement Re-engagement',
    condition: (ctx) => (ctx.leadScore ?? 0) > 30 && (ctx.leadScore ?? 0) < 60,
    action: 'send_email',
    parameters: { template: 're-engagement' },
    riskLevel: 'low',
    minConfidence: 0.4,
    cooldownHours: 168, // 1 week
    enabled: true,
  },
  {
    id: 'rule-enterprise-lead',
    name: 'Enterprise Lead Routing',
    condition: (ctx) => {
      const company = ctx.lead?.company?.toLowerCase() ?? ''
      const keywords = ['inc', 'llc', 'corp', 'group', 'solutions', 'technologies', 'systems']
      return keywords.some(k => company.includes(k)) && (ctx.leadScore ?? 0) > 50
    },
    action: 'assign_sales_rep',
    parameters: { team: 'enterprise' },
    riskLevel: 'medium',
    minConfidence: 0.7,
    cooldownHours: 24,
    enabled: true,
  },
  {
    id: 'rule-deal-won',
    name: 'Deal Won Celebration',
    condition: (ctx) => ctx.deal?.stage === 'closed_won',
    action: 'trigger_webhook',
    parameters: { webhook: 'celebration', notify: ['sales', 'management'] },
    riskLevel: 'low',
    minConfidence: 0.9,
    cooldownHours: 0,
    enabled: true,
  },
  {
    id: 'rule-churn-risk',
    name: 'Churn Risk Intervention',
    condition: (ctx) => (ctx.leadScore ?? 0) < 20,
    action: 'create_task',
    parameters: { taskType: 'churn-prevention', urgency: 'urgent' },
    riskLevel: 'medium',
    minConfidence: 0.6,
    cooldownHours: 4,
    enabled: true,
  },
  {
    id: 'rule-high-value-deal',
    name: 'High Value Deal Alert',
    condition: (ctx) => (ctx.dealValue ?? 0) > 10000,
    action: 'assign_sales_rep',
    parameters: { priority: 'critical', team: 'enterprise' },
    riskLevel: 'medium',
    minConfidence: 0.7,
    cooldownHours: 0,
    enabled: true,
  },
]

/**
 * Get the current system mode
 */
export async function getSystemMode(): Promise<SystemMode> {
  const { data } = await supabase
    .from('ai_system_modes')
    .select('mode')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  return (data?.mode as SystemMode) || 'assistive'
}

/**
 * Get system mode configuration
 */
export async function getSystemConfig(): Promise<{
  mode: SystemMode
  maxActionsPerHour: number
  requireApprovalForRisk: RiskLevel
  enabledActions: ActionName[]
  blockedActions: ActionName[]
} | null> {
  const { data } = await supabase
    .from('ai_system_modes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (!data) return null
  
  return {
    mode: data.mode as SystemMode,
    maxActionsPerHour: data.max_actions_per_hour,
    requireApprovalForRisk: data.require_approval_for_risk as RiskLevel,
    enabledActions: data.enabled_actions as ActionName[],
    blockedActions: data.blocked_actions as ActionName[],
  }
}

/**
 * Update system mode
 */
export async function setSystemMode(
  mode: SystemMode, 
  config?: {
    maxActionsPerHour?: number
    requireApprovalForRisk?: RiskLevel
    enabledActions?: ActionName[]
    blockedActions?: ActionName[]
  }
): Promise<void> {
  await supabase
    .from('ai_system_modes')
    .insert({
      mode,
      max_actions_per_hour: config?.maxActionsPerHour ?? 100,
      require_approval_for_risk: config?.requireApprovalForRisk ?? 'medium',
      enabled_actions: config?.enabledActions ?? ['send_email', 'create_task', 'update_lead_status'],
      blocked_actions: config?.blockedActions ?? [],
    })
}

/**
 * Determine execution mode based on risk level and system config
 */
export function determineExecutionMode(
  riskLevel: RiskLevel,
  systemMode: SystemMode,
  requireApprovalForRisk: RiskLevel
): ExecutionMode {
  // Manual mode - always require approval
  if (systemMode === 'manual') return 'require_approval'
  
  // Autonomous mode - auto-execute low risk
  if (systemMode === 'autonomous') {
    const riskOrder = ['low', 'medium', 'high', 'critical']
    const riskIndex = riskOrder.indexOf(riskLevel)
    const approvalIndex = riskOrder.indexOf(requireApprovalForRisk)
    return riskIndex <= approvalIndex ? 'auto_execute' : 'require_approval'
  }
  
  // Assistive mode - suggest only by default
  return 'require_approval'
}

/**
 * Check if action is allowed
 */
export function isActionAllowed(
  action: ActionName,
  enabledActions: ActionName[],
  blockedActions: ActionName[]
): boolean {
  return enabledActions.includes(action) && !blockedActions.includes(action)
}

/**
 * Evaluate all rules against context and return decisions
 */
export async function evaluateRules(context: RuleContext): Promise<DecisionWithMetadata[]> {
  const decisions: DecisionWithMetadata[] = []
  const config = await getSystemMode()
  const systemConfig = await getSystemConfig()
  
  if (!systemConfig || config === 'manual') return decisions
  
  for (const rule of AUTONOMY_RULES) {
    if (!rule.enabled) continue
    
    // Check if action is allowed
    if (!isActionAllowed(rule.action, systemConfig.enabledActions, systemConfig.blockedActions)) {
      continue
    }
    
    // Check cooldown (would need additional DB check in production)
    
    // Evaluate condition
    if (rule.condition(context)) {
      const confidence = calculateConfidence(rule, context)
      
      // Skip if below minimum confidence
      if (confidence < rule.minConfidence) continue
      
      const riskLevel = rule.riskLevel
      const executionMode = determineExecutionMode(
        riskLevel,
        config,
        systemConfig.requireApprovalForRisk
      )
      
      decisions.push({
        decisionId: `decision-${rule.id}-${Date.now()}`,
        type: rule.name,
        action: rule.action,
        parameters: rule.parameters,
        confidence,
        priority: determinePriority(riskLevel, confidence),
        riskLevel,
        executionMode,
        reason: `Rule ${rule.name} triggered based on context analysis`,
        leadId: context.lead?.id,
        dealId: context.deal?.id,
      })
    }
  }
  
  // Sort by priority and confidence
  decisions.sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return b.confidence - a.confidence
  })
  
  return decisions
}

/**
 * Calculate confidence score based on rule and context
 */
function calculateConfidence(rule: AutonomyRule, context: RuleContext): number {
  let confidence = 0.7 // Base confidence
  
  // Boost confidence based on lead score
  if (context.leadScore !== undefined) {
    confidence += (context.leadScore / 100) * 0.2
  }
  
  // Boost confidence for high value deals
  if (context.dealValue !== undefined && context.dealValue > 10000) {
    confidence += 0.1
  }
  
  return Math.min(confidence, 0.99)
}

/**
 * Determine priority based on risk and confidence
 */
function determinePriority(
  riskLevel: RiskLevel, 
  confidence: number
): 'urgent' | 'high' | 'medium' | 'low' {
  if (riskLevel === 'critical' || (riskLevel === 'high' && confidence > 0.9)) {
    return 'urgent'
  }
  if (riskLevel === 'high' || confidence > 0.8) {
    return 'high'
  }
  if (riskLevel === 'medium' || confidence > 0.6) {
    return 'medium'
  }
  return 'low'
}

/**
 * Get all available rules
 */
export function getAvailableRules(): Omit<AutonomyRule, 'condition'>[] {
  return AUTONOMY_RULES.map(({ condition, ...rest }) => rest)
}

/**
 * Enable or disable a rule
 */
export function toggleRule(ruleId: string, enabled: boolean): void {
  const rule = AUTONOMY_RULES.find(r => r.id === ruleId)
  if (rule) {
    rule.enabled = enabled
  }
}

export default {
  getSystemMode,
  getSystemConfig,
  setSystemMode,
  evaluateRules,
  getAvailableRules,
  toggleRule,
  determineExecutionMode,
  isActionAllowed,
}
