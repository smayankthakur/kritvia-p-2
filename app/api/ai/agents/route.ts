import { NextRequest } from 'next/server'
import { runSalesAgent, runMarketingAgent, runOperationsAgent, runAllAgents, runAgent, type AgentType } from '@/lib/ai/agents'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agent: agentType, action } = body

    // Run specific agent
    if (agentType) {
      if (action === 'execute') {
        // Run agent and execute actions
        const report = await runAgent(agentType as AgentType)
        
        return Response.json({
          success: true,
          data: report,
        })
      }
      
      // Just get agent report
      const report = await runAgent(agentType as AgentType)
      
      return Response.json({
        success: true,
        data: report,
      })
    }

    // Run all agents
    const reports = await runAllAgents()
    
    return Response.json({
      success: true,
      data: reports,
    })
  } catch (error) {
    console.error('AI Agents API Error:', error)
    return Response.json(
      { success: false, error: 'Failed to run agents' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get summary of all agents
    const reports = await runAllAgents()
    
    const summary = {
      sales: {
        insights: reports.sales.insights.length,
        decisions: reports.sales.decisions.length,
        actions: reports.sales.actions.length,
        recommendations: reports.sales.recommendations.length,
      },
      marketing: {
        insights: reports.marketing.insights.length,
        decisions: reports.marketing.decisions.length,
        actions: reports.marketing.actions.length,
        recommendations: reports.marketing.recommendations.length,
      },
      operations: {
        insights: reports.operations.insights.length,
        decisions: reports.operations.decisions.length,
        actions: reports.operations.actions.length,
        recommendations: reports.operations.recommendations.length,
      },
    }
    
    return Response.json({
      success: true,
      data: {
        summary,
        reports,
      },
    })
  } catch (error) {
    console.error('AI Agents API Error:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch agent reports' },
      { status: 500 }
    )
  }
}
