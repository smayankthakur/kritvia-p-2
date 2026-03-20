/**
 * Usage Tracking System
 * Monitor and track AI usage across workspaces
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export type UsageType = 'ai_message' | 'lead' | 'deal' | 'user' | 'storage'

export interface UsageRecord {
  id?: string
  workspace_id: string
  type: UsageType
  count: number
  period_start: string
  period_end: string
  created_at?: string
}

export interface UsageSummary {
  ai_messages: { used: number; limit: number }
  leads: { used: number; limit: number }
  deals: { used: number; limit: number }
  teamMembers: { used: number; limit: number }
}

// Track usage
export async function trackUsage(
  workspaceId: string,
  type: UsageType,
  count: number = 1
): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date()
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

    // Check if record exists for this period
    const { data: existing } = await supabase
      .from('usage_metrics')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('type', type)
      .gte('period_start', periodStart)
      .lte('period_end', periodEnd)
      .single()

    if (existing) {
      // Update existing record
      await supabase
        .from('usage_metrics')
        .update({ count: existing.count + count })
        .eq('id', existing.id)
    } else {
      // Create new record
      await supabase.from('usage_metrics').insert({
        workspace_id: workspaceId,
        type,
        count,
        period_start: periodStart,
        period_end: periodEnd,
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error tracking usage:', error)
    return { success: false, error: String(error) }
  }
}

// Get usage for current period
export async function getCurrentUsage(workspaceId: string): Promise<UsageSummary> {
  const now = new Date()
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

  const { data: usage } = await supabase
    .from('usage_metrics')
    .select('type, count')
    .eq('workspace_id', workspaceId)
    .gte('period_start', periodStart)
    .lte('period_end', periodEnd)

  const usageMap: Record<string, number> = {}
  if (usage) {
    for (const record of usage) {
      usageMap[record.type] = record.count
    }
  }

  // Get workspace limits
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('plan')
    .eq('id', workspaceId)
    .single()

  const { getFeatureLimit } = await import('./permissions')
  const plan = (workspace?.plan || 'free') as 'free' | 'starter' | 'pro' | 'enterprise'

  return {
    ai_messages: {
      used: usageMap['ai_message'] || 0,
      limit: getFeatureLimit(plan, 'aiMessagesLimit'),
    },
    leads: {
      used: usageMap['lead'] || 0,
      limit: getFeatureLimit(plan, 'leadsLimit'),
    },
    deals: {
      used: usageMap['deal'] || 0,
      limit: getFeatureLimit(plan, 'leadsLimit'), // Using leads limit for deals
    },
    teamMembers: {
      used: 1, // Will be calculated from workspace_users
      limit: getFeatureLimit(plan, 'teamMembers'),
    },
  }
}

// Check if usage is within limits
export async function checkUsageLimit(
  workspaceId: string,
  type: UsageType
): Promise<{ allowed: boolean; used: number; limit: number; remaining: number }> {
  const usage = await getCurrentUsage(workspaceId)

  let used = 0
  let limit = 0

  switch (type) {
    case 'ai_message':
      used = usage.ai_messages.used
      limit = usage.ai_messages.limit
      break
    case 'lead':
      used = usage.leads.used
      limit = usage.leads.limit
      break
    case 'deal':
      used = usage.deals.used
      limit = usage.deals.limit
      break
    case 'user':
      used = usage.teamMembers.used
      limit = usage.teamMembers.limit
      break
  }

  const remaining = limit === -1 ? Infinity : Math.max(0, limit - used)
  return {
    allowed: limit === -1 || used < limit,
    used,
    limit,
    remaining,
  }
}

// Get usage history for analytics
export async function getUsageHistory(
  workspaceId: string,
  months: number = 3
): Promise<UsageRecord[]> {
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)
  startDate.setDate(1)

  const { data } = await supabase
    .from('usage_metrics')
    .select('*')
    .eq('workspace_id', workspaceId)
    .gte('period_start', startDate.toISOString())
    .order('period_start', { ascending: true })

  return data || []
}

// Calculate usage percentage
export function getUsagePercent(used: number, limit: number): number {
  if (limit === -1) return 0
  return Math.min(100, Math.round((used / limit) * 100))
}

// Format usage display
export function formatUsage(used: number, limit: number): string {
  if (limit === -1) return `${used} / Unlimited`
  return `${used.toLocaleString()} / ${limit.toLocaleString()}`
}

export default {
  trackUsage,
  getCurrentUsage,
  checkUsageLimit,
  getUsageHistory,
  getUsagePercent,
  formatUsage,
}
