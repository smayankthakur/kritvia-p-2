/**
 * Decision Memory System
 * Learn from past decisions and outcomes
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface Decision {
  id: string
  type: string
  context: Record<string, any>
  decision: string
  reasoning: string
  outcome?: string
  successScore?: number
  createdAt: Date
}

export interface DecisionPattern {
  pattern: string
  frequency: number
  avgSuccess: number
  recommendations: string[]
}

// Store a decision
export async function storeDecision(
  type: string,
  context: Record<string, unknown>,
  decision: string,
  reasoning: string
): Promise<Decision> {
  const { data, error } = await supabase
    .from('decision_memory')
    .insert({
      decision_type: type,
      context,
      decision,
      reasoning,
      success_score: null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Record outcome
export async function recordOutcome(
  decisionId: string,
  outcome: string,
  successScore: number
): Promise<void> {
  await supabase
    .from('decision_memory')
    .update({
      outcome,
      success_score: successScore,
    })
    .eq('id', decisionId)
}

// Get past decisions by type
export async function getDecisionsByType(
  type: string,
  limit: number = 10
): Promise<Decision[]> {
  const { data, error } = await supabase
    .from('decision_memory')
    .select('*')
    .eq('decision_type', type)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

// Analyze patterns
export async function analyzePatterns(): Promise<DecisionPattern[]> {
  const { data: decisions } = await supabase
    .from('decision_memory')
    .select('*')
    .not('success_score', 'is', null)

  const patterns: Record<string, { count: number; totalScore: number; decisions: Decision[] }> = {}

  for (const d of decisions || []) {
    const key = d.decision_type
    if (!patterns[key]) {
      patterns[key] = { count: 0, totalScore: 0, decisions: [] }
    }
    patterns[key].count++
    patterns[key].totalScore += d.success_score
    patterns[key].decisions.push(d)
  }

  const result: DecisionPattern[] = []

  for (const [pattern, data] of Object.entries(patterns)) {
    const avgSuccess = data.totalScore / data.count

    const recommendations: string[] = []
    if (avgSuccess > 0.8) {
      recommendations.push('Continue this pattern - high success rate')
    } else if (avgSuccess < 0.5) {
      recommendations.push('Consider changing approach - low success rate')
      recommendations.push('Analyze failed decisions for insights')
    } else {
      recommendations.push('Monitor this pattern - moderate success')
    }

    result.push({
      pattern,
      frequency: data.count,
      avgSuccess,
      recommendations,
    })
  }

  return result.sort((a, b) => b.frequency - a.frequency)
}

// Get learnings for a specific context
export async function getRelevantLearnings(
  _context: Record<string, unknown>
): Promise<Decision[]> {
  const { data: decisions } = await supabase
    .from('decision_memory')
    .select('*')
    .not('success_score', 'is', null)
    .order('success_score', { ascending: false })
    .limit(5)

  // Filter by relevance (simplified)
  const relevant = (decisions || []).filter(d => {
    // In production, use embeddings for semantic search
    return true
  })

  return relevant
}

// Get best practices
export async function getBestPractices(): Promise<{
  topDecisions: Decision[]
  patterns: DecisionPattern[]
  recommendations: string[]
}> {
  const patterns = await analyzePatterns()

  const { data: topDecisions } = await supabase
    .from('decision_memory')
    .select('*')
    .not('success_score', 'is', null)
    .order('success_score', { ascending: false })
    .limit(5)

  const recommendations = [
    'Use data-driven decisions over intuition',
    'Document reasoning for future reference',
    'Review decisions regularly',
    'Learn from failures as much as successes',
  ]

  return {
    topDecisions: topDecisions || [],
    patterns,
    recommendations,
  }
}

// Clear old decisions (data management)
export async function pruneOldDecisions(daysOld: number = 365): Promise<number> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysOld)

  const { count, error } = await supabase
    .from('decision_memory')
    .delete()
    .lt('created_at', cutoffDate.toISOString())

  if (error) throw error
  return count || 0
}

export default {
  storeDecision,
  recordOutcome,
  getDecisionsByType,
  analyzePatterns,
  getRelevantLearnings,
  getBestPractices,
  pruneOldDecisions,
}
