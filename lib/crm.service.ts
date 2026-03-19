import { createServerSupabase } from './supabase-server'
import { Lead, Deal, DashboardMetrics } from './types'

// Plan limits
export const PLAN_LIMITS = {
  free: {
    maxLeads: 100,
    maxDeals: 50,
    maxAIRequests: 10,
    aiRequestsUsed: 0,
  },
  starter: {
    maxLeads: 1000,
    maxDeals: 200,
    maxAIRequests: 100,
    aiRequestsUsed: 0,
  },
  pro: {
    maxLeads: 10000,
    maxDeals: 1000,
    maxAIRequests: 500,
    aiRequestsUsed: 0,
  },
  enterprise: {
    maxLeads: Infinity,
    maxDeals: Infinity,
    maxAIRequests: Infinity,
    aiRequestsUsed: 0,
  },
} as const

export type Plan = keyof typeof PLAN_LIMITS

// Usage tracking
export interface UsageStats {
  leads: { current: number; limit: number }
  deals: { current: number; limit: number }
  aiRequests: { current: number; limit: number }
}

// Get user's current usage
export async function getUserUsage(userId: string): Promise<UsageStats> {
  const supabase = await createServerSupabase()

  // Get lead count
  const { count: leadCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get deal count
  const { count: dealCount } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get AI request count (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const { count: aiCount } = await supabase
    .from('ai_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', thirtyDaysAgo.toISOString())

  // Get user's plan (default to free)
  const { data: userData } = await supabase
    .from('users')
    .select('plan')
    .eq('id', userId)
    .single()

  const plan = (userData?.plan || 'free') as Plan
  const limits = PLAN_LIMITS[plan]

  return {
    leads: { current: leadCount || 0, limit: limits.maxLeads },
    deals: { current: dealCount || 0, limit: limits.maxDeals },
    aiRequests: { current: aiCount || 0, limit: limits.maxAIRequests },
  }
}

// Check if user can perform action
export async function canPerformAction(
  userId: string,
  action: 'createLead' | 'createDeal' | 'aiRequest'
): Promise<{ allowed: boolean; reason?: string }> {
  const usage = await getUserUsage(userId)

  switch (action) {
    case 'createLead':
      if (usage.leads.current >= usage.leads.limit) {
        return { allowed: false, reason: 'Lead limit reached' }
      }
      break
    case 'createDeal':
      if (usage.deals.current >= usage.deals.limit) {
        return { allowed: false, reason: 'Deal limit reached' }
      }
      break
    case 'aiRequest':
      if (usage.aiRequests.current >= usage.aiRequests.limit) {
        return { allowed: false, reason: 'AI request limit reached' }
      }
      break
  }

  return { allowed: true }
}

// Log AI request
export async function logAIRequest(userId: string, prompt: string, response: string) {
  const supabase = await createServerSupabase()
  
  await supabase.from('ai_logs').insert({
    user_id: userId,
    prompt,
    response,
  })
}

// Get dashboard metrics
export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  const supabase = await createServerSupabase()

  // Get total leads
  const { count: totalLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get total deals
  const { count: totalDeals } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get revenue (closed won deals)
  const { data: deals } = await supabase
    .from('deals')
    .select('value')
    .eq('user_id', userId)
    .eq('stage', 'closed_won')

  const totalRevenue = deals?.reduce((sum, d) => sum + (d.value || 0), 0) || 0

  // Calculate conversion rate
  const conversionRate = totalLeads ? ((totalDeals || 0) / totalLeads) * 100 : 0

  return {
    totalLeads: totalLeads || 0,
    totalDeals: totalDeals || 0,
    totalRevenue,
    conversionRate: Math.round(conversionRate * 10) / 10,
  }
}

// Get user data for AI context
export async function getAIContext(userId: string) {
  const supabase = await createServerSupabase()

  // Get recent leads
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  // Get recent deals
  const { data: deals } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  // Get metrics
  const metrics = await getDashboardMetrics(userId)

  return {
    leads: leads || [],
    deals: deals || [],
    metrics,
  }
}
