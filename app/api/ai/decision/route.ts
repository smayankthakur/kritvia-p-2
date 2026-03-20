import { NextRequest } from 'next/server'
import { evaluateAllDecisions, getUrgentDecisions, batchProcessDecisions } from '@/lib/ai/decision'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, leadId } = body

    if (action === 'batch-process') {
      // Run batch processing of decisions
      const result = await batchProcessDecisions()
      
      return Response.json({
        success: true,
        data: result,
      })
    }

    // Default: evaluate all decisions
    const decisions = await evaluateAllDecisions()
    
    return Response.json({
      success: true,
      data: {
        decisions,
        total: decisions.length,
        urgent: decisions.filter(d => d.priority === 'urgent').length,
        high: decisions.filter(d => d.priority === 'high').length,
      },
    })
  } catch (error) {
    console.error('AI Decision API Error:', error)
    return Response.json(
      { success: false, error: 'Failed to process decisions' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const decisions = await evaluateAllDecisions()
    const urgentDecisions = await getUrgentDecisions()
    
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
      },
    })
  } catch (error) {
    console.error('AI Decision API Error:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch decisions' },
      { status: 500 }
    )
  }
}
