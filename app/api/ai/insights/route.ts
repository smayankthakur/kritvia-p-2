import { NextRequest } from 'next/server'
import { generateInsights, generateGrowthStrategy } from '@/lib/ai/insights'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, leadId } = body

    if (type === 'growth-strategy') {
      const strategy = await generateGrowthStrategy()
      return Response.json({
        success: true,
        data: { strategy },
      })
    }

    // Default: generate general insights
    const insights = await generateInsights()
    
    return Response.json({
      success: true,
      data: { insights },
    })
  } catch (error) {
    console.error('AI Insights API Error:', error)
    return Response.json(
      { success: false, error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const insights = await generateInsights()
    
    return Response.json({
      success: true,
      data: { insights },
    })
  } catch (error) {
    console.error('AI Insights API Error:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch insights' },
      { status: 500 }
    )
  }
}
