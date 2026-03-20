/**
 * Product Improvement Engine
 * Analyze usage and suggest improvements
 */

import { createClient } from '@supabase/supabase-js'
import { getFeatureMetrics, getAllFeatureMetrics } from './usage-intelligence'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface Improvement {
  type: 'feature_improvement' | 'flow_fix' | 'new_feature' | 'deprecation' | 'ux_improvement'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  impactScore: number
  effortEstimate: string
}

// Analyze product usage and generate improvements
export async function analyzeProductUsage(): Promise<Improvement[]> {
  const improvements: Improvement[] = []
  const metrics = await getAllFeatureMetrics()

  // Check for low-usage features
  for (const metric of metrics) {
    if (metric.totalUsage < 100 && metric.uniqueUsers < 10) {
      improvements.push({
        type: 'feature_improvement',
        title: `Improve or Deprecate: ${metric.feature}`,
        description: `Feature has low usage (${metric.uniqueUsers} users). Consider improving UX, better onboarding, or deprecating.`,
        priority: 'medium',
        impactScore: 3,
        effortEstimate: 'Low',
      })
    }

    // Check for high drop-off
    if (metric.dropOffRate > 50) {
      improvements.push({
        type: 'flow_fix',
        title: `Fix Drop-off in ${metric.feature}`,
        description: `High drop-off rate (${metric.dropOffRate}%). Review user flow and identify friction points.`,
        priority: 'high',
        impactScore: 8,
        effortEstimate: 'Medium',
      })
    }

    // Check for declining trends
    if (metric.trend === 'down') {
      improvements.push({
        type: 'feature_improvement',
        title: `Revive Declining Feature: ${metric.feature}`,
        description: `Usage is declining. Investigate root cause and refresh feature.`,
        priority: 'high',
        impactScore: 7,
        effortEstimate: 'Medium',
      })
    }

    // Check for high-performing features (expand)
    if (metric.activationRate > 70) {
      improvements.push({
        type: 'new_feature',
        title: `Expand: ${metric.feature}`,
        description: `High activation (${metric.activationRate}%). Consider expanding capabilities.`,
        priority: 'low',
        impactScore: 5,
        effortEstimate: 'High',
      })
    }
  }

  return improvements
}

// Create improvement records
export async function createImprovements(improvements: Improvement[]): Promise<void> {
  for (const imp of improvements) {
    await supabase.from('product_improvements').insert({
      type: imp.type,
      title: imp.title,
      description: imp.description,
      priority: imp.priority,
      impact_score: imp.impactScore,
      effort_estimate: imp.effortEstimate,
      status: 'identified',
      created_by: 'ai',
    })
  }
}

// Get prioritized feature backlog
export async function getPrioritizedBacklog(): Promise<Improvement[]> {
  const { data } = await supabase
    .from('product_improvements')
    .select('*')
    .eq('status', 'identified')
    .order('impact_score', { ascending: false })

  if (!data) return []

  return data.map(imp => ({
    type: imp.type,
    title: imp.title,
    description: imp.description,
    priority: imp.priority,
    impactScore: imp.impact_score,
    effortEstimate: imp.effort_estimate,
  }))
}

// Mark improvement as completed
export async function completeImprovement(id: string): Promise<void> {
  await supabase
    .from('product_improvements')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', id)
}

// Get improvement statistics
export async function getImprovementStats(): Promise<{
  identified: number
  inProgress: number
  completed: number
  totalImpact: number
}> {
  const { data } = await supabase
    .from('product_improvements')
    .select('status, impact_score')

  const stats = {
    identified: 0,
    inProgress: 0,
    completed: 0,
    totalImpact: 0,
  }

  for (const imp of data || []) {
    if (imp.status === 'identified') stats.identified++
    if (imp.status === 'in_progress') stats.inProgress++
    if (imp.status === 'completed') stats.completed++
    stats.totalImpact += imp.impact_score || 0
  }

  return stats
}

export default {
  analyzeProductUsage,
  createImprovements,
  getPrioritizedBacklog,
  completeImprovement,
  getImprovementStats,
}
