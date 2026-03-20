import { NextRequest } from 'next/server'
import { getPerformanceMetrics } from '@/lib/ai/evaluator'
import { getLearningInsights, getBestPatterns, getPatternsByType, pruneMemory, PATTERN_TYPES } from '@/lib/ai/memory'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agent = searchParams.get('agent')
    const type = searchParams.get('type')
    const days = parseInt(searchParams.get('days') || '30')

    if (!agent) {
      return Response.json(
        { success: false, error: 'Agent name required' },
        { status: 400 }
      )
    }

    switch (type) {
      case 'metrics': {
        const metrics = await getPerformanceMetrics(agent, days)
        return Response.json({
          success: true,
          data: metrics,
        })
      }

      case 'insights': {
        const insights = await getLearningInsights(agent)
        return Response.json({
          success: true,
          data: insights,
        })
      }

      case 'patterns': {
        const patterns = await getBestPatterns(agent, 10)
        return Response.json({
          success: true,
          data: patterns,
        })
      }

      case 'pattern-types': {
        const patterns = await getPatternsByType(PATTERN_TYPES.EMAIL_TEMPLATE)
        return Response.json({
          success: true,
          data: patterns,
        })
      }

      default: {
        // Get all performance data
        const [metrics, insights, patterns] = await Promise.all([
          getPerformanceMetrics(agent, days),
          getLearningInsights(agent),
          getBestPatterns(agent, 5),
        ])

        return Response.json({
          success: true,
          data: {
            metrics,
            insights,
            topPatterns: patterns,
          },
        })
      }
    }
  } catch (error) {
    console.error('Performance API error:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch performance data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'prune') {
      const deleted = await pruneMemory(30)
      return Response.json({
        success: true,
        message: `Pruned ${deleted} old patterns`,
      })
    }

    return Response.json(
      { success: false, error: 'Unknown action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Performance API error:', error)
    return Response.json(
      { success: false, error: 'Failed to perform action' },
      { status: 500 }
    )
  }
}
