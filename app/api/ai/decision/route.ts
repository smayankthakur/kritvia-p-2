import { NextRequest } from 'next/server'
import { evaluateAllDecisions, getUrgentDecisions, batchProcessDecisions } from '@/lib/ai/decision'
import { evaluateRules, getSystemMode, getSystemConfig, type RuleContext } from '@/lib/ai/rules'
import { getAutonomousStatus } from '@/lib/ai/autonomousEngine'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, leadId, dealId, context } = body

    if (action === 'batch-process') {
      // Run batch processing of decisions
      const result = await batchProcessDecisions()
      
      return Response.json({
        success: true,
        data: result,
      })
    }

    if (action === 'evaluate-context') {
      // Evaluate specific context for autonomous decisions
      const ruleContext: RuleContext = context || {}
      
      if (leadId) {
        ruleContext.lead = { id: leadId }
      }
      if (dealId) {
        ruleContext.deal = { id: dealId }
      }
      
      const decisions = await evaluateRules(ruleContext)
      const mode = await getSystemMode()
      const config = await getSystemConfig()
      
      return Response.json({
        success: true,
        data: {
          decisions,
          total: decisions.length,
          autoExecutable: decisions.filter(d => d.executionMode === 'auto_execute').length,
          requireApproval: decisions.filter(d => d.executionMode === 'require_approval').length,
          systemMode: mode,
          config,
        },
      })
    }

    // Default: evaluate all decisions
    const decisions = await evaluateAllDecisions()
    const autonomousStatus = await getAutonomousStatus()
    
    return Response.json({
      success: true,
      data: {
        decisions,
        total: decisions.length,
        urgent: decisions.filter(d => d.priority === 'urgent').length,
        high: decisions.filter(d => d.priority === 'high').length,
        autonomous: {
          mode: autonomousStatus.mode,
          isRunning: autonomousStatus.isRunning,
          successRate: autonomousStatus.successRate,
        },
      },
    })
  } catch (error) {
    console.error('AI Decision API Error:', error)
    return Response.json(
      { success: false, error: 'Failed to process decisions', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const decisions = await evaluateAllDecisions()
    const urgentDecisions = await getUrgentDecisions()
    const autonomousStatus = await getAutonomousStatus()
    const mode = await getSystemMode()
    const config = await getSystemConfig()
    
    return Response.json({
      success: true,
      data: {
        decisions,
        urgent: urgentDecisions,
        summary: {
          total: decisions.length,
          urgent: decisions.filter(d => d.priority === 'urgent').length,
          high: decisions.filter(d => d.priority === 'high').length,
          medium: decisions.filter(d => d.priority === 'medium').length,
          low: decisions.filter(d => d.priority === 'low').length,
        },
        autonomous: {
          mode,
          config,
          status: {
            isRunning: autonomousStatus.isRunning,
            actionsExecuted: autonomousStatus.actionsExecuted,
            successRate: autonomousStatus.successRate,
          },
        },
      },
    })
  } catch (error) {
    console.error('AI Decision API Error:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch decisions', details: String(error) },
      { status: 500 }
    )
  }
}
