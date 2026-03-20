/**
 * Approve Action API
 * Approve or reject pending autonomous actions
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Get all pending approvals
 */
export async function GET() {
  try {
    const { data: approvals, error } = await supabase
      .from('ai_action_approvals')
      .select('*')
      .eq('approved', false)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (error) throw error
    
    return NextResponse.json({
      approvals: approvals || [],
      count: approvals?.length || 0,
    })
  } catch (error) {
    console.error('[API] Get approvals error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approvals', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * Approve or reject an action
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { actionId, approved, approvedBy, reason } = body
    
    if (!actionId || approved === undefined) {
      return NextResponse.json(
        { error: 'actionId and approved are required' },
        { status: 400 }
      )
    }
    
    // Get the approval record
    const { data: approval, error: fetchError } = await supabase
      .from('ai_action_approvals')
      .select('*')
      .eq('action_id', actionId)
      .single()
    
    if (fetchError || !approval) {
      return NextResponse.json(
        { error: 'Approval not found' },
        { status: 404 }
      )
    }
    
    // Update approval status
    const { error: updateError } = await supabase
      .from('ai_action_approvals')
      .update({
        approved,
        approved_by: approvedBy || 'system',
        approved_at: new Date().toISOString(),
        reason: reason || (approved ? 'Approved' : 'Rejected'),
      })
      .eq('id', approval.id)
    
    if (updateError) throw updateError
    
    // If approved, execute the action
    let actionResult = null
    if (approved) {
      try {
        const { executeAutonomousAction } = await import('@/lib/ai/actionEngine')
        
        // Reconstruct the decision
        const decision = {
          decisionId: approval.action_id,
          type: approval.decision_type,
          action: approval.action_type,
          parameters: approval.metadata || {},
          confidence: 0.8,
          priority: 'high' as const,
          riskLevel: approval.risk_level,
          executionMode: 'auto_execute' as const,
          reason: approval.reason,
          leadId: approval.entity_type === 'lead' ? approval.entity_id : undefined,
          dealId: approval.entity_type === 'deal' ? approval.entity_id : undefined,
        }
        
        actionResult = await executeAutonomousAction(decision)
        
        // Record learning outcome
        if (actionResult) {
          const { recordOutcome } = await import('@/lib/ai/learning')
          await recordOutcome(decision, actionResult)
        }
      } catch (execError) {
        console.error('[API] Action execution error:', execError)
        actionResult = { success: false, error: String(execError) }
      }
    }
    
    return NextResponse.json({
      success: true,
      approval: {
        id: approval.id,
        actionId: approval.action_id,
        approved,
        approvedBy: approvedBy || 'system',
        approvedAt: new Date().toISOString(),
      },
      actionResult,
    })
  } catch (error) {
    console.error('[API] Approve action error:', error)
    return NextResponse.json(
      { error: 'Failed to process approval', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * Batch approve multiple actions
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { actionIds, approved, approvedBy } = body
    
    if (!actionIds || !Array.isArray(actionIds) || approved === undefined) {
      return NextResponse.json(
        { error: 'actionIds array and approved are required' },
        { status: 400 }
      )
    }
    
    const results = []
    
    for (const actionId of actionIds) {
      try {
        // Get the approval record
        const { data: approval } = await supabase
          .from('ai_action_approvals')
          .select('*')
          .eq('action_id', actionId)
          .single()
        
        if (!approval) {
          results.push({ actionId, success: false, error: 'Not found' })
          continue
        }
        
        // Update approval status
        await supabase
          .from('ai_action_approvals')
          .update({
            approved,
            approved_by: approvedBy || 'system',
            approved_at: new Date().toISOString(),
          })
          .eq('id', approval.id)
        
        results.push({ actionId, success: true, approved })
        
        // If approved, execute the action
        if (approved) {
          try {
            const { executeAutonomousAction } = await import('@/lib/ai/actionEngine')
            
            const decision = {
              decisionId: approval.action_id,
              type: approval.decision_type,
              action: approval.action_type,
              parameters: approval.metadata || {},
              confidence: 0.8,
              priority: 'high' as const,
              riskLevel: approval.risk_level,
              executionMode: 'auto_execute' as const,
              reason: approval.reason,
            }
            
            await executeAutonomousAction(decision)
          } catch (execError) {
            console.error(`[API] Batch action execution error for ${actionId}:`, execError)
          }
        }
      } catch (error) {
        results.push({ actionId, success: false, error: String(error) })
      }
    }
    
    const successCount = results.filter(r => r.success).length
    
    return NextResponse.json({
      success: true,
      processed: actionIds.length,
      succeeded: successCount,
      failed: actionIds.length - successCount,
      results,
    })
  } catch (error) {
    console.error('[API] Batch approval error:', error)
    return NextResponse.json(
      { error: 'Failed to process batch approval', details: String(error) },
      { status: 500 }
    )
  }
}
