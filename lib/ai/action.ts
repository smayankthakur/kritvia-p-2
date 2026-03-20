/**
 * Action Engine
 * Executes actions based on decisions
 */

import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'
import type { Decision } from './decision'

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Action types
export type ActionType = 
  | 'SEND_EMAIL'
  | 'UPDATE_CRM'
  | 'TRIGGER_NOTIFICATION'
  | 'ADD_TO_CAMPAIGN'
  | 'CREATE_TASK'
  | 'LOG_ACTION'

export interface ActionResult {
  success: boolean
  actionType: ActionType
  decisionId: string
  message: string
  metadata?: Record<string, unknown>
}

// Email transporter
const getEmailTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

/**
 * Execute a single action
 */
export async function executeAction(decision: Decision): Promise<ActionResult> {
  try {
    switch (decision.type) {
      case 'SALES_OUTREACH':
        return await sendSalesEmail(decision)
      case 'HIGH_INTENT_MARK':
        return await markHighIntent(decision)
      case 'FORM_ABANDONMENT_FOLLOWUP':
        return await sendFollowUpEmail(decision)
      case 'PRICING_REMARKETING':
        return await addToCampaign(decision)
      case 'UPSELL_OPPORTUNITY':
        return await sendUpsellEmail(decision)
      default:
        return await logAction(decision)
    }
  } catch (error) {
    console.error('Error executing action:', error)
    return {
      success: false,
      actionType: 'LOG_ACTION',
      decisionId: decision.id,
      message: `Failed to execute action: ${error}`,
    }
  }
}

/**
 * Execute multiple actions
 */
export async function executeActions(decisions: Decision[]): Promise<ActionResult[]> {
  const results: ActionResult[] = []
  
  for (const decision of decisions) {
    const result = await executeAction(decision)
    results.push(result)
    
    // Log action to database
    await logActionToDatabase(decision, result)
  }
  
  return results
}

// Action implementations

async function sendSalesEmail(decision: Decision): Promise<ActionResult> {
  const transporter = getEmailTransporter()
  const leadEmail = decision.metadata?.leadEmail as string | undefined
  
  if (!leadEmail) {
    return {
      success: false,
      actionType: 'SEND_EMAIL',
      decisionId: decision.id,
      message: 'No lead email found',
    }
  }

  try {
    await transporter.sendMail({
      from: '"Kritvia Sales" <sales@kritvia.com>',
      to: process.env.EMAIL_USER,
      subject: `🔥 Urgent: Hot Lead - ${leadEmail}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #DC2626;">🔥 Hot Lead Alert</h2>
          <div style="background: #FEF2F2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Lead ID:</strong> ${decision.leadId}</p>
            <p><strong>Reason:</strong> ${decision.reason}</p>
            <p><strong>Priority:</strong> ${decision.priority}</p>
            <p><strong>Score:</strong> ${decision.metadata?.leadScore}</p>
          </div>
          <p>This lead has a high conversion probability. Contact immediately!</p>
          <a href="#" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View in CRM
          </a>
        </div>
      `,
    })

    return {
      success: true,
      actionType: 'SEND_EMAIL',
      decisionId: decision.id,
      message: 'Sales outreach email sent',
      metadata: { recipient: leadEmail },
    }
  } catch (error) {
    return {
      success: false,
      actionType: 'SEND_EMAIL',
      decisionId: decision.id,
      message: `Failed to send email: ${error}`,
    }
  }
}

async function markHighIntent(decision: Decision): Promise<ActionResult> {
  try {
    // Update lead status in database
    const { error } = await supabase
      .from('leads')
      .update({ 
        status: 'high-intent',
        notes: (decision.metadata?.previousNotes || '') + `\n[AI] Marked high-intent: ${decision.reason}`
      })
      .eq('id', decision.leadId)

    if (error) {
      return {
        success: false,
        actionType: 'UPDATE_CRM',
        decisionId: decision.id,
        message: `Failed to update CRM: ${error.message}`,
      }
    }

    return {
      success: true,
      actionType: 'UPDATE_CRM',
      decisionId: decision.id,
      message: 'Lead marked as high-intent in CRM',
      metadata: { leadId: decision.leadId },
    }
  } catch (error) {
    return {
      success: false,
      actionType: 'UPDATE_CRM',
      decisionId: decision.id,
      message: `Failed to update CRM: ${error}`,
    }
  }
}

async function sendFollowUpEmail(decision: Decision): Promise<ActionResult> {
  const transporter = getEmailTransporter()
  const leadEmail = decision.metadata?.leadEmail as string | undefined
  
  if (!leadEmail) {
    return {
      success: false,
      actionType: 'SEND_EMAIL',
      decisionId: decision.id,
      message: 'No lead email found',
    }
  }

  try {
    await transporter.sendMail({
      from: '"Kritvia" <hello@kritvia.com>',
      to: process.env.EMAIL_USER,
      subject: 'Quick question about your interest in Kritvia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">We noticed you were exploring Kritvia</h2>
          <p>Hi there,</p>
          <p>We noticed you were checking out our pricing but didn't get a chance to sign up. We'd love to answer any questions you might have!</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Here's what Kritvia can do for you:</h3>
            <ul>
              <li>🤖 AI-powered lead management</li>
              <li>⚡ Automated workflows</li>
              <li>📊 Real-time business insights</li>
            </ul>
          </div>
          <a href="#" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Book a Free Demo
          </a>
          <p style="margin-top: 20px; color: #6B7280; font-size: 14px;">
            P.S. Have questions? Just reply to this email - we're happy to help!
          </p>
        </div>
      `,
    })

    return {
      success: true,
      actionType: 'SEND_EMAIL',
      decisionId: decision.id,
      message: 'Follow-up email sent',
    }
  } catch (error) {
    return {
      success: false,
      actionType: 'SEND_EMAIL',
      decisionId: decision.id,
      message: `Failed to send email: ${error}`,
    }
  }
}

async function addToCampaign(decision: Decision): Promise<ActionResult> {
  // In a real implementation, this would add to an email marketing platform
  // For now, we'll just log it
  return {
    success: true,
    actionType: 'ADD_TO_CAMPAIGN',
    decisionId: decision.id,
    message: 'Lead added to pricing remarketing campaign',
    metadata: { 
      leadId: decision.leadId,
      campaign: 'pricing-remarketing',
    },
  }
}

async function sendUpsellEmail(decision: Decision): Promise<ActionResult> {
  const transporter = getEmailTransporter()
  
  try {
    await transporter.sendMail({
      from: '"Kritvia Sales" <sales@kritvia.com>',
      to: process.env.EMAIL_USER,
      subject: '💎 Enterprise Opportunity Detected',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F59E0B;">💎 Enterprise Upsell Opportunity</h2>
          <div style="background: #FFFBEB; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Lead ID:</strong> ${decision.leadId}</p>
            <p><strong>Reason:</strong> ${decision.reason}</p>
          </div>
          <p>This lead appears to be from a larger company. Consider offering Enterprise plan with custom pricing.</p>
        </div>
      `,
    })

    return {
      success: true,
      actionType: 'SEND_EMAIL',
      decisionId: decision.id,
      message: 'Upsell opportunity email sent to sales team',
    }
  } catch (error) {
    return {
      success: false,
      actionType: 'SEND_EMAIL',
      decisionId: decision.id,
      message: `Failed to send email: ${error}`,
    }
  }
}

async function logAction(decision: Decision): Promise<ActionResult> {
  return {
    success: true,
    actionType: 'LOG_ACTION',
    decisionId: decision.id,
    message: `Action logged: ${decision.action}`,
    metadata: { action: decision.action },
  }
}

async function logActionToDatabase(decision: Decision, result: ActionResult): Promise<void> {
  try {
    await supabase
      .from('ai_action_logs')
      .insert({
        decision_id: decision.id,
        decision_type: decision.type,
        action_type: result.actionType,
        success: result.success,
        message: result.message,
        metadata: {
          ...decision.metadata,
          ...result.metadata,
        },
        created_at: new Date().toISOString(),
      })
  } catch (error) {
    console.error('Failed to log action to database:', error)
  }
}

/**
 * Get action history
 */
export async function getActionHistory(limit: number = 50): Promise<unknown[]> {
  const { data, error } = await supabase
    .from('ai_action_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching action history:', error)
    return []
  }

  return data || []
}

export default {
  executeAction,
  executeActions,
  getActionHistory,
}
