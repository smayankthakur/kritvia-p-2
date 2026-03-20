/**
 * Learning Memory System
 * Stores successful patterns and strategies for agent improvement
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Memory types
export interface MemoryEntry {
  id?: string
  agent_name: string
  pattern_type: string
  pattern_data: Record<string, unknown>
  success_rate: number
  sample_size: number
  last_verified?: string
  created_at?: string
}

export const PATTERN_TYPES = {
  EMAIL_TEMPLATE: 'email_template',
  OUTREACH_TIMING: 'outreach_timing',
  LEAD_SCORING: 'lead_scoring',
  CONTENT_STRATEGY: 'content_strategy',
  PRICING_MESSAGE: 'pricing_message',
  FOLLOW_UP_SEQUENCE: 'follow_up_sequence',
} as const

/**
 * Store a successful pattern in memory
 */
export async function storePattern(
  agentName: string,
  patternType: string,
  patternData: Record<string, unknown>,
  successRate: number
): Promise<void> {
  try {
    // Check if pattern already exists
    const { data: existing } = await supabase
      .from('ai_learning_memory')
      .select('*')
      .eq('agent_name', agentName)
      .eq('pattern_type', patternType)
      .eq('pattern_data', JSON.stringify(patternData))
      .single()

    if (existing) {
      // Update existing pattern
      const newSampleSize = existing.sample_size + 1
      const newSuccessRate = (existing.success_rate * existing.sample_size + successRate) / newSampleSize

      await supabase
        .from('ai_learning_memory')
        .update({
          success_rate: newSuccessRate,
          sample_size: newSampleSize,
          last_verified: new Date().toISOString(),
        })
        .eq('id', existing.id)
    } else {
      // Insert new pattern
      await supabase
        .from('ai_learning_memory')
        .insert({
          agent_name: agentName,
          pattern_type: patternType,
          pattern_data: patternData,
          success_rate: successRate,
          sample_size: 1,
          last_verified: new Date().toISOString(),
        })
    }
  } catch (error) {
    console.error('Error storing pattern:', error)
  }
}

/**
 * Get best performing patterns for an agent
 */
export async function getBestPatterns(
  agentName: string,
  limit: number = 5
): Promise<MemoryEntry[]> {
  try {
    const { data, error } = await supabase
      .from('ai_learning_memory')
      .select('*')
      .eq('agent_name', agentName)
      .order('success_rate', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching patterns:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error getting patterns:', error)
    return []
  }
}

/**
 * Get patterns by type
 */
export async function getPatternsByType(
  patternType: string,
  minSuccessRate: number = 0.5
): Promise<MemoryEntry[]> {
  try {
    const { data, error } = await supabase
      .from('ai_learning_memory')
      .select('*')
      .eq('pattern_type', patternType)
      .gte('success_rate', minSuccessRate)
      .order('success_rate', { ascending: false })

    if (error) {
      console.error('Error fetching patterns by type:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error getting patterns by type:', error)
    return []
  }
}

/**
 * Learn from successful action
 */
export async function learnFromSuccess(
  agentName: string,
  actionType: string,
  context: Record<string, unknown>,
  result: Record<string, unknown>
): Promise<void> {
  // Determine pattern type based on action
  let patternType: string = PATTERN_TYPES.EMAIL_TEMPLATE
  
  if (actionType.includes('email')) {
    patternType = PATTERN_TYPES.EMAIL_TEMPLATE
  } else if (actionType.includes('timing')) {
    patternType = PATTERN_TYPES.OUTREACH_TIMING
  } else if (actionType.includes('scoring')) {
    patternType = PATTERN_TYPES.LEAD_SCORING
  }

  // Store the pattern with 100% success rate (validated by actual outcome)
  await storePattern(agentName, patternType, {
    action_type: actionType,
    context,
    result,
  }, 1.0)
}

/**
 * Learn from failed action
 */
export async function learnFromFailure(
  agentName: string,
  actionType: string,
  context: Record<string, unknown>,
  failureReason: string
): Promise<void> {
  // Store the pattern with 0% success rate
  await storePattern(agentName, actionType, {
    context,
    failure_reason: failureReason,
  }, 0.0)
}

/**
 * Get learning insights
 */
export async function getLearningInsights(agentName: string): Promise<{
  totalPatterns: number
  avgSuccessRate: number
  topPatterns: MemoryEntry[]
  improvementAreas: string[]
}> {
  try {
    const patterns = await getBestPatterns(agentName, 10)
    
    const totalPatterns = patterns.length
    const avgSuccessRate = patterns.reduce((sum, p) => sum + p.success_rate, 0) / (totalPatterns || 1)
    
    const topPatterns = patterns.filter(p => p.success_rate >= 0.7).slice(0, 5)
    
    const improvementAreas: string[] = []
    patterns.forEach(p => {
      if (p.success_rate < 0.5) {
        improvementAreas.push(`Improve ${p.pattern_type} (${p.success_rate * 100}% success)`)
      }
    })

    return {
      totalPatterns,
      avgSuccessRate,
      topPatterns,
      improvementAreas,
    }
  } catch (error) {
    console.error('Error getting learning insights:', error)
    return {
      totalPatterns: 0,
      avgSuccessRate: 0,
      topPatterns: [],
      improvementAreas: [],
    }
  }
}

/**
 * Clear old/irrelevant patterns
 */
export async function pruneMemory(thresholdDays: number = 30): Promise<number> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - thresholdDays)

  try {
    const { data, error } = await supabase
      .from('ai_learning_memory')
      .delete()
      .lt('last_verified', cutoffDate.toISOString())
      .lt('success_rate', 0.3)
      .select('id')

    if (error) {
      console.error('Error pruning memory:', error)
      return 0
    }

    return data?.length || 0
  } catch (error) {
    console.error('Error pruning memory:', error)
    return 0
  }
}

export default {
  storePattern,
  getBestPatterns,
  getPatternsByType,
  learnFromSuccess,
  learnFromFailure,
  getLearningInsights,
  pruneMemory,
  PATTERN_TYPES,
}
