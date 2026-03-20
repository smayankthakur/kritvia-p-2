/**
 * Performance Evaluation Engine
 * Compares expected vs actual outcomes and assigns success scores
 */

import { createClient } from '@supabase/supabase-js'
import { recordFeedback, type FeedbackEvent } from './feedback'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Evaluation result
export interface EvaluationResult {
  success: boolean
  score: number
  insights: string[]
  improvement_suggestions: string[]
}

/**
 * Evaluate an action outcome
 */
export async function evaluateAction(
  actionId: string,
  expectedOutcome: string,
  actualOutcome: string
): Promise<EvaluationResult> {
  // Calculate success score based on outcome matching
  const score = calculateSuccessScore(expectedOutcome, actualOutcome)
  
  // Generate insights
  const insights = generateInsights(expectedOutcome, actualOutcome, score)
  
  // Generate improvement suggestions
  const suggestions = generateSuggestions(expectedOutcome, actualOutcome, score)

  // Record feedback
  await recordFeedback({
    agent_name: 'sales', // Would be dynamic based on action
    action_id: actionId,
    action_type: 'evaluation',
    expected_outcome: expectedOutcome,
    actual_outcome: actualOutcome,
    success_score: score,
  })

  return {
    success: score >= 50,
    score,
    insights,
    improvement_suggestions: suggestions,
  }
}

/**
 * Calculate success score based on outcomes
 */
function calculateSuccessScore(expected: string, actual: string): number {
  const expectedLower = expected.toLowerCase()
  const actualLower = actual.toLowerCase()

  // Exact match
  if (expectedLower === actualLower) {
    return 100
  }

  // Partial matches with scoring
  let score = 0

  // Positive outcomes
  if (actualLower.includes('converted') || actualLower.includes('success')) {
    score = 100
  } else if (actualLower.includes('replied') || actualLower.includes('interested')) {
    score = 70
  } else if (actualLower.includes('opened')) {
    score = 30
  } else if (actualLower.includes('bounced') || actualLower.includes('failed')) {
    score = -50
  } else if (actualLower.includes('lost') || actualLower.includes('declined')) {
    score = -20
  }

  // Adjust based on expectation
  if (expectedLower.includes('convert') && score > 0) {
    score = score * 0.8 // Harder to achieve
  }

  return Math.max(-100, Math.min(100, score))
}

/**
 * Generate insights from evaluation
 */
function generateInsights(expected: string, actual: string, score: number): string[] {
  const insights: string[] = []

  if (score >= 80) {
    insights.push('Action exceeded expectations')
  } else if (score >= 50) {
    insights.push('Action met minimum expectations')
  } else if (score >= 0) {
    insights.push('Action partially successful but below target')
  } else {
    insights.push('Action failed to achieve desired outcome')
  }

  // Add specific insights
  if (actual.includes('opened') && !expected.includes('opened')) {
    insights.push('Email was opened even though not expected - strong subject line')
  }

  if (actual.includes('converted') && expected.includes('convert')) {
    insights.push('Full conversion achieved - perfect execution')
  }

  return insights
}

/**
 * Generate improvement suggestions
 */
function generateSuggestions(expected: string, actual: string, score: number): string[] {
  const suggestions: string[] = []

  if (score < 50) {
    if (expected.includes('email')) {
      suggestions.push('Improve email subject line and copy')
      suggestions.push('Consider personalization')
    }
    if (expected.includes('lead')) {
      suggestions.push('Review lead qualification criteria')
      suggestions.push('Adjust follow-up timing')
    }
  }

  if (score >= 50 && score < 80) {
    suggestions.push('Analyze what worked and replicate')
    suggestions.push('A/B test variations')
  }

  return suggestions
}

/**
 * Get performance metrics for an agent
 */
export async function getPerformanceMetrics(agentName: string, days: number = 30): Promise<{
  totalActions: number
  avgScore: number
  successRate: number
  trends: { date: string; score: number }[]
}> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  try {
    const { data, error } = await supabase
      .from('feedback_events')
      .select('*')
      .eq('agent_name', agentName)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (error || !data) {
      return {
        totalActions: 0,
        avgScore: 0,
        successRate: 0,
        trends: [],
      }
    }

    const totalActions = data.length
    const avgScore = data.reduce((sum, e) => sum + e.success_score, 0) / totalActions
    const successCount = data.filter((e) => e.success_score >= 50).length
    const successRate = (successCount / totalActions) * 100

    // Group by date for trends
    const trendsMap = new Map<string, { total: number; count: number }>()
    data.forEach((event) => {
      const date = event.created_at.split('T')[0]
      const existing = trendsMap.get(date) || { total: 0, count: 0 }
      trendsMap.set(date, {
        total: existing.total + event.success_score,
        count: existing.count + 1,
      })
    })

    const trends = Array.from(trendsMap.entries()).map(([date, data]) => ({
      date,
      score: data.total / data.count,
    }))

    return {
      totalActions,
      avgScore,
      successRate,
      trends,
    }
  } catch (error) {
    console.error('Error getting performance metrics:', error)
    return {
      totalActions: 0,
      avgScore: 0,
      successRate: 0,
      trends: [],
    }
  }
}

/**
 * Store performance metric
 */
export async function storePerformanceMetric(
  agentName: string,
  metricName: string,
  value: number
): Promise<void> {
  const today = new Date()
  const periodStart = new Date(today)
  periodStart.setDate(periodStart.getDate() - 1)

  try {
    await supabase
      .from('ai_performance_metrics')
      .insert({
        agent_name: agentName,
        metric_name: metricName,
        metric_value: value,
        period_start: periodStart.toISOString().split('T')[0],
        period_end: today.toISOString().split('T')[0],
      })
  } catch (error) {
    console.error('Error storing performance metric:', error)
  }
}

export default {
  evaluateAction,
  getPerformanceMetrics,
  storePerformanceMetric,
}
