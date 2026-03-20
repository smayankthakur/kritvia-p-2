/**
 * Action Engine
 * Executes autonomous actions with safety controls
 */

import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Types
import type { ActionName, DecisionWithMetadata, RiskLevel } from './rules'

export interface ActionResult {
  success: boolean
  actionId: string
  actionName: ActionName
  result?: Record<string, unknown>
  error?: string
  executionTimeMs: number
}

export interface ActionParameters {
  leadId?: string
  dealId?: string
  taskId?: string
  email?: string
  [key: string]: unknown
}

// Email transporter
const getEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

/**
 * Execute an autonomous action
 */
export async function executeAutonomousAction(
  decision: DecisionWithMetadata
): Promise<ActionResult> {
  const startTime = Date.now()
  
  // Log the action attempt
  const { id: actionLogId } = await logActionStart(decision)
  
  try {
    let result: Record<string, unknown>
    
    switch (decision.action) {
      case 'send_email':
        result = await executeSendEmail(decision)
        break
      case 'create_task':
        result = await executeCreateTask(decision)
        break
      case 'update_lead_status':
        result = await executeUpdateLeadStatus(decision)
        break
      case 'move_deal_stage':
        result = await executeMoveDealStage(decision)
        break
      case 'trigger_webhook':
        result = await executeTriggerWebhook(decision)
        break
      case 'assign_sales_rep':
        result = await executeAssignSalesRep(decision)
        break
      default:
        throw new Error(`Unknown action: ${decision.action}`)
    }
    
    // Log successful completion
    await logActionComplete(actionLogId, result, Date.now() - startTime)
    
    return {
      success: true,
      actionId: decision.decisionId,
      actionName: decision.action,
      result,
      executionTimeMs: Date.now() - startTime,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // Log failure
    await logActionFailure(actionLogId, errorMessage)
    
    return {
      success: false,
      actionId: decision.decisionId,
      actionName: decision.action,
      error: errorMessage,
      executionTimeMs: Date.now() - startTime,
    }
  }
}

/**
 * Send email action
 */
async function executeSendEmail(decision: DecisionWithMetadata): Promise<Record<string, unknown>> {
  const params = decision.parameters as { template?: string; subject?: string; to?: string }
  const leadEmail = decision.leadId ? await getLeadEmail(decision.leadId) : params.to
  
  if (!leadEmail) {
    throw new Error('No email address available')
  }
  
  const transporter = getEmailTransporter()
  const template = params.template || 'default'
  
  const { subject, html } = generateEmailTemplate(template, decision)
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Kritvia" <hello@kritvia.com>',
    to: leadEmail,
    subject: params.subject || subject,
    html,
  })
  
  return { recipient: leadEmail, template }
}

/**
 * Create task action
 */
async function executeCreateTask(decision: DecisionWithMetadata): Promise<Record<string, unknown>> {
  const params = decision.parameters as { taskType?: string; urgency?: string; title?: string; description?: string }
  
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: params.title || `AI Task: ${params.taskType}`,
      description: params.description || `Auto-generated task from decision: ${decision.reason}`,
      status: 'pending',
      priority: params.urgency || 'medium',
      lead_id: decision.leadId,
      deal_id: decision.dealId,
    })
    .select()
    .single()
  
  if (error) throw new Error(`Failed to create task: ${error.message}`)
  
  return { taskId: data.id, taskType: params.taskType }
}

/**
 * Update lead status action
 */
async function executeUpdateLeadStatus(decision: DecisionWithMetadata): Promise<Record<string, unknown>> {
  const params = decision.parameters as { status?: string; notes?: string }
  
  if (!decision.leadId) {
    throw new Error('No lead ID provided')
  }
  
  const { data: existingLead } = await supabase
    .from('leads')
    .select('notes')
    .eq('id', decision.leadId)
    .single()
  
  const { error } = await supabase
    .from('leads')
    .update({
      status: params.status || 'contacted',
      notes: `${existingLead?.notes || ''}\n[AI] Status updated: ${decision.reason}`,
      updated_at: new Date().toISOString(),
    })
    .eq('id', decision.leadId)
  
  if (error) throw new Error(`Failed to update lead: ${error.message}`)
  
  return { leadId: decision.leadId, newStatus: params.status }
}

/**
 * Move deal stage action
 */
async function executeMoveDealStage(decision: DecisionWithMetadata): Promise<Record<string, unknown>> {
  const params = decision.parameters as { stage?: string; notes?: string }
  
  if (!decision.dealId) {
    throw new Error('No deal ID provided')
  }
  
  const { data: existingDeal } = await supabase
    .from('deals')
    .select('notes')
    .eq('id', decision.dealId)
    .single()
  
  const { error } = await supabase
    .from('deals')
    .update({
      stage: params.stage || 'proposal',
      notes: `${existingDeal?.notes || ''}\n[AI] Stage moved: ${decision.reason}`,
      updated_at: new Date().toISOString(),
    })
    .eq('id', decision.dealId)
  
  if (error) throw new Error(`Failed to update deal: ${error.message}`)
  
  return { dealId: decision.dealId, newStage: params.stage }
}

/**
 * Trigger webhook action
 */
async function executeTriggerWebhook(decision: DecisionWithMetadata): Promise<Record<string, unknown>> {
  const params = decision.parameters as { webhook?: string; notify?: string[] }
  
  // In production, this would call the actual webhook
  // For now, we'll log it
  console.log(`[Webhook] Triggering ${params.webhook} for decision ${decision.decisionId}`)
  
  // Store webhook event
  await supabase
    .from('ai_autonomous_events')
    .insert({
      event_type: 'webhook_triggered',
      source: 'action_engine',
      payload: {
        webhook: params.webhook,
        decisionId: decision.decisionId,
        notify: params.notify,
      },
    })
  
  return { webhook: params.webhook, triggered: true }
}

/**
 * Assign sales rep action
 */
async function executeAssignSalesRep(decision: DecisionWithMetadata): Promise<Record<string, unknown>> {
  const params = decision.parameters as { repId?: string; team?: string; priority?: string }
  
  let repId = params.repId
  
  // If no specific rep, find an available one
  if (!repId) {
    const { data: reps } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'sales')
      .eq('status', 'active')
      .limit(1)
    
    if (reps && reps.length > 0) {
      repId = reps[0].id
    }
  }
  
  if (decision.leadId && repId) {
    await supabase
      .from('leads')
      .update({
        assigned_to: repId,
        priority: params.priority || 'normal',
        updated_at: new Date().toISOString(),
      })
      .eq('id', decision.leadId)
  }
  
  if (decision.dealId && repId) {
    await supabase
      .from('deals')
      .update({
        assigned_to: repId,
        priority: params.priority || 'normal',
        updated_at: new Date().toISOString(),
      })
      .eq('id', decision.dealId)
  }
  
  return { assignedRep: repId, team: params.team }
}

/**
 * Get lead email address
 */
async function getLeadEmail(leadId: string): Promise<string | null> {
  const { data } = await supabase
    .from('leads')
    .select('email')
    .eq('id', leadId)
    .single()
  
  return data?.email || null
}

/**
 * Generate email template
 */
function generateEmailTemplate(template: string, decision: DecisionWithMetadata): { subject: string; html: string } {
  const templates: Record<string, { subject: string; html: string }> = {
    'hot-lead-followup': {
      subject: 'Thanks for your interest in Kritvia!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Thanks for your interest!</h2>
          <p>Hi there,</p>
          <p>We noticed you're exploring Kritvia and would love to help you get started.</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Why Kritvia?</strong></p>
            <ul>
              <li>🤖 AI-powered automation</li>
              <li>⚡ 10x faster workflows</li>
              <li>📊 Real-time insights</li>
            </ul>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/demo" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Schedule a Demo
          </a>
        </div>
      `,
    },
    'proposal-followup': {
      subject: 'Following up on your Kritvia proposal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Following up on your proposal</h2>
          <p>Hi there,</p>
          <p>I wanted to follow up on the proposal we sent. Do you have any questions?</p>
          <p>I'm happy to schedule a call to discuss any concerns.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Book a Call
          </a>
        </div>
      `,
    },
    're-engagement': {
      subject: 'We miss you! Come back to Kritvia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">We miss you!</h2>
          <p>Hi there,</p>
          <p>It's been a while since you last visited Kritvia. We've made some exciting improvements!</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>New features:</strong></p>
            <ul>
              <li>🚀 Enhanced AI capabilities</li>
              <li>📈 Better analytics</li>
              <li>⚡ Faster performance</li>
            </ul>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            See What's New
          </a>
        </div>
      `,
    },
    'default': {
      subject: 'Update from Kritvia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello!</h2>
          <p>Here's an update from Kritvia.</p>
          <p>${decision.reason}</p>
        </div>
      `,
    },
  }
  
  return templates[template] || templates['default']
}

/**
 * Log action start
 */
async function logActionStart(decision: DecisionWithMetadata) {
  const { data } = await supabase
    .from('ai_autonomous_actions')
    .insert({
      decision_id: decision.decisionId,
      action_type: decision.action,
      action_name: decision.action,
      parameters: decision.parameters,
      status: 'pending',
      executed_by: 'autonomous_engine',
    })
    .select()
    .single()
  
  return { id: data?.id }
}

/**
 * Log action completion
 */
async function logActionComplete(
  actionLogId: string, 
  result: Record<string, unknown>,
  executionTimeMs: number
) {
  await supabase
    .from('ai_autonomous_actions')
    .update({
      status: 'completed',
      result,
      executed_at: new Date().toISOString(),
      execution_time_ms: executionTimeMs,
    })
    .eq('id', actionLogId)
}

/**
 * Log action failure
 */
async function logActionFailure(actionLogId: string, errorMessage: string) {
  await supabase
    .from('ai_autonomous_actions')
    .update({
      status: 'failed',
      error_message: errorMessage,
      executed_at: new Date().toISOString(),
    })
    .eq('id', actionLogId)
}

/**
 * Get action history
 */
export async function getActionHistory(limit: number = 50) {
  const { data, error } = await supabase
    .from('ai_autonomous_actions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw new Error(`Failed to fetch action history: ${error.message}`)
  
  return data || []
}

/**
 * Get pending approvals
 */
export async function getPendingApprovals() {
  const { data, error } = await supabase
    .from('ai_action_approvals')
    .select('*')
    .eq('approved', false)
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(`Failed to fetch approvals: ${error.message}`)
  
  return data || []
}

export default {
  executeAutonomousAction,
  getActionHistory,
  getPendingApprovals,
}
