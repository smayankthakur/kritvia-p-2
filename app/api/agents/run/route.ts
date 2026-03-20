import { NextRequest } from 'next/server'
import { runAllAgents, runSpecificAgent, getAgentLogs, getLatestAgentSummary } from '@/lib/agents/runner'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agent, action } = body

    // Run specific agent
    if (agent) {
      if (action === 'execute') {
        const result = await runSpecificAgent(agent)
        
        return Response.json({
          success: result.success,
          data: result.output,
          error: result.error,
        })
      }
    }

    // Run all agents
    const result = await runAllAgents()
    
    return Response.json({
      success: result.success,
      data: {
        ceo: result.ceo,
        sales: result.sales,
        marketing: result.marketing,
        executedActions: result.executedActions,
        timestamp: result.timestamp,
      },
      errors: result.errors,
    })
  } catch (error) {
    console.error('Agent runner API error:', error)
    return Response.json(
      { success: false, error: 'Failed to run agents' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (type === 'logs') {
      const logs = await getAgentLogs(limit)
      return Response.json({
        success: true,
        data: logs,
      })
    }

    if (type === 'summary') {
      const summary = await getLatestAgentSummary()
      return Response.json({
        success: true,
        data: summary,
      })
    }

    // Default: get summary
    const summary = await getLatestAgentSummary()
    
    return Response.json({
      success: true,
      data: summary,
    })
  } catch (error) {
    console.error('Agent runner API error:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch agent data' },
      { status: 500 }
    )
  }
}
