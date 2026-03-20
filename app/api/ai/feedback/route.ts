import { NextRequest } from 'next/server'
import { 
  recordFeedback, 
  trackEmailOpened, 
  trackEmailReplied, 
  trackLeadConversion,
  getAgentFeedback,
  getRecentFeedback,
  getAgentSuccessRate 
} from '@/lib/ai/feedback'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'track_opened':
        await trackEmailOpened(data.actionId)
        return Response.json({ success: true, message: 'Email open tracked' })

      case 'track_replied':
        await trackEmailReplied(data.actionId)
        return Response.json({ success: true, message: 'Email reply tracked' })

      case 'track_conversion':
        await trackLeadConversion(data.leadId, data.agentName)
        return Response.json({ success: true, message: 'Lead conversion tracked' })

      case 'record':
        await recordFeedback({
          agent_name: data.agentName,
          action_id: data.actionId,
          action_type: data.actionType,
          lead_id: data.leadId,
          expected_outcome: data.expectedOutcome,
          actual_outcome: data.actualOutcome,
          success_score: data.successScore,
          metadata: data.metadata,
        })
        return Response.json({ success: true, message: 'Feedback recorded' })

      default:
        return Response.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Feedback API error:', error)
    return Response.json(
      { success: false, error: 'Failed to record feedback' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agent = searchParams.get('agent')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (type === 'success-rate' && agent) {
      const rate = await getAgentSuccessRate(agent)
      return Response.json({
        success: true,
        data: { agent, successRate: rate },
      })
    }

    if (type === 'recent') {
      const feedback = await getRecentFeedback(limit)
      return Response.json({
        success: true,
        data: feedback,
      })
    }

    // Default: get agent feedback
    const feedback = agent 
      ? await getAgentFeedback(agent, limit)
      : await getRecentFeedback(limit)
    
    return Response.json({
      success: true,
      data: feedback,
    })
  } catch (error) {
    console.error('Feedback API error:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}
