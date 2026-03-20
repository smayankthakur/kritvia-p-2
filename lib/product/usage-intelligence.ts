/**
 * Feature Usage Intelligence
 * Track and analyze feature usage patterns
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface FeatureMetrics {
  feature: string
  totalUsage: number
  uniqueUsers: number
  avgTimeSpent: number
  activationRate: number
  dropOffRate: number
  trend: 'up' | 'down' | 'stable'
}

// Track feature usage
export async function trackFeatureUsage(
  userId: string,
  workspaceId: string,
  feature: string,
  timeSpent: number = 0
): Promise<void> {
  const now = new Date().toISOString()

  // Check if exists
  const { data: existing } = await supabase
    .from('feature_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('feature', feature)
    .single()

  if (existing) {
    // Update
    await supabase
      .from('feature_usage')
      .update({
        usage_count: existing.usage_count + 1,
        time_spent_seconds: existing.time_spent_seconds + timeSpent,
        last_used: now,
      })
      .eq('id', existing.id)
  } else {
    // Insert
    await supabase
      .from('feature_usage')
      .insert({
        user_id: userId,
        workspace_id: workspaceId,
        feature,
        usage_count: 1,
        time_spent_seconds: timeSpent,
        first_used: now,
        last_used: now,
      })
  }
}

// Get feature metrics
export async function getFeatureMetrics(feature: string): Promise<FeatureMetrics> {
  const { data, error } = await supabase
    .from('feature_usage')
    .select('*')
    .eq('feature', feature)

  if (error || !data || data.length === 0) {
    return {
      feature,
      totalUsage: 0,
      uniqueUsers: 0,
      avgTimeSpent: 0,
      activationRate: 0,
      dropOffRate: 0,
      trend: 'stable',
    }
  }

  const totalUsage = data.reduce((sum, r) => sum + (r.usage_count || 0), 0)
  const uniqueUsers = data.length
  const avgTimeSpent = data.reduce((sum, r) => sum + (r.time_spent_seconds || 0), 0) / uniqueUsers

  // Calculate activation (users who used feature 3+ times)
  const activatedUsers = data.filter(r => (r.usage_count || 0) >= 3).length
  const activationRate = (activatedUsers / uniqueUsers) * 100

  // Calculate drop-off (users who stopped using)
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const recentUsers = data.filter(r => new Date(r.last_used) > oneWeekAgo).length
  const dropOffRate = ((uniqueUsers - recentUsers) / uniqueUsers) * 100

  // Calculate trend (compare to last week)
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
  const lastWeekUsage = data
    .filter(r => {
      const lastUsed = new Date(r.last_used)
      return lastUsed > twoWeeksAgo && lastUsed <= oneWeekAgo
    })
    .reduce((sum, r) => sum + (r.usage_count || 0), 0)

  const thisWeekUsage = data
    .filter(r => new Date(r.last_used) > oneWeekAgo)
    .reduce((sum, r) => sum + (r.usage_count || 0), 0)

  let trend: 'up' | 'down' | 'stable' = 'stable'
  if (thisWeekUsage > lastWeekUsage * 1.1) trend = 'up'
  if (thisWeekUsage < lastWeekUsage * 0.9) trend = 'down'

  return {
    feature,
    totalUsage,
    uniqueUsers,
    avgTimeSpent: Math.round(avgTimeSpent),
    activationRate: Math.round(activationRate),
    dropOffRate: Math.round(dropOffRate),
    trend,
  }
}

// Get all feature metrics
export async function getAllFeatureMetrics(): Promise<FeatureMetrics[]> {
  const features = [
    'dashboard',
    'leads',
    'deals',
    'ai_chat',
    'automation',
    'analytics',
    'settings',
    'billing',
    'team',
    'integrations',
  ]

  const metrics: FeatureMetrics[] = []
  for (const feature of features) {
    const m = await getFeatureMetrics(feature)
    metrics.push(m)
  }

  return metrics.sort((a, b) => b.totalUsage - a.totalUsage)
}

// Get time-to-value (how fast users get value)
export async function getTimeToValue(): Promise<{
  avgDaysToFirstAction: number
  avgDaysToActivation: number
}> {
  const { data } = await supabase
    .from('feature_usage')
    .select('*')
    .order('created_at', { ascending: true })

  if (!data || data.length === 0) {
    return { avgDaysToFirstAction: 0, avgDaysToActivation: 0 }
  }

  // Group by user
  const userFirstAction: Record<string, Date> = {}
  const userActivation: Record<string, Date> = {}

  for (const record of data) {
    const userId = record.user_id
    const date = new Date(record.created_at)

    if (!userFirstAction[userId]) {
      userFirstAction[userId] = date
    }

    if ((record.usage_count || 0) >= 3 && !userActivation[userId]) {
      userActivation[userId] = date
    }
  }

  const now = new Date()
  const avgDaysToFirstAction = Object.values(userFirstAction).length > 0
    ? Object.values(userFirstAction).reduce((sum, d) => sum + (now.getTime() - d.getTime()) / 86400000, 0) / Object.keys(userFirstAction).length
    : 0

  const activatedUsers = Object.keys(userActivation).length
  const avgDaysToActivation = activatedUsers > 0
    ? Object.values(userActivation).reduce((sum, d) => sum + (now.getTime() - d.getTime()) / 86400000, 0) / activatedUsers
    : 0

  return {
    avgDaysToFirstAction: Math.round(avgDaysToFirstAction),
    avgDaysToActivation: Math.round(avgDaysToActivation),
  }
}

export default {
  trackFeatureUsage,
  getFeatureMetrics,
  getAllFeatureMetrics,
  getTimeToValue,
}
