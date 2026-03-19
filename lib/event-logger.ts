import { createServerSupabase } from './supabase-server'

// Event types
export type EventType = 
  | 'user.signup'
  | 'user.login'
  | 'user.logout'
  | 'user.plan_upgraded'
  | 'user.plan_downgraded'
  | 'lead.created'
  | 'lead.updated'
  | 'lead.deleted'
  | 'deal.created'
  | 'deal.updated'
  | 'deal.stage_changed'
  | 'deal.deleted'
  | 'ai.chat'
  | 'ai.insight_generated'
  | 'api.request'
  | 'billing.checkout'
  | 'billing.subscription_created'
  | 'billing.subscription_updated'
  | 'billing.subscription_cancelled'
  | 'workspace.created'
  | 'workspace.member_added'
  | 'workspace.member_removed'

// Event severity
export type EventSeverity = 'info' | 'warning' | 'error' | 'critical'

// Event payload
export interface EventData {
  [key: string]: unknown
}

// Log an event
export async function logEvent(params: {
  type: EventType
  severity?: EventSeverity
  userId?: string
  workspaceId?: string
  metadata?: EventData
}): Promise<void> {
  const supabase = await createServerSupabase()

  await supabase.from('events').insert({
    type: params.type,
    severity: params.severity || 'info',
    user_id: params.userId,
    workspace_id: params.workspaceId,
    metadata: params.metadata || {},
    timestamp: new Date().toISOString(),
  })
}

// Get events for a user
export async function getUserEvents(
  userId: string,
  options?: { limit?: number; type?: EventType }
): Promise<any[]> {
  const supabase = await createServerSupabase()

  let query = supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(options?.limit || 50)

  if (options?.type) {
    query = query.eq('type', options.type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching user events:', error)
    return []
  }

  return data || []
}

// Get events for a workspace
export async function getWorkspaceEvents(
  workspaceId: string,
  options?: { limit?: number; type?: EventType }
): Promise<any[]> {
  const supabase = await createServerSupabase()

  let query = supabase
    .from('events')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('timestamp', { ascending: false })
    .limit(options?.limit || 100)

  if (options?.type) {
    query = query.eq('type', options.type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching workspace events:', error)
    return []
  }

  return data || []
}

// Get analytics for workspace
export async function getWorkspaceAnalytics(workspaceId: string): Promise<{
  totalLeads: number
  totalDeals: number
  totalRevenue: number
  aiRequests: number
  activeUsers: number
  period: { start: Date; end: Date }
}> {
  const supabase = await createServerSupabase()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Get lead events
  const { count: leadCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .eq('type', 'lead.created')
    .gte('timestamp', thirtyDaysAgo.toISOString())

  // Get deal events
  const { count: dealCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .eq('type', 'deal.created')
    .gte('timestamp', thirtyDaysAgo.toISOString())

  // Get AI requests
  const { count: aiCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .eq('type', 'ai.chat')
    .gte('timestamp', thirtyDaysAgo.toISOString())

  // Get unique users
  const { data: users } = await supabase
    .from('events')
    .select('user_id')
    .eq('workspace_id', workspaceId)
    .gte('timestamp', thirtyDaysAgo.toISOString())

  const uniqueUsers = new Set(users?.map(u => u.user_id))

  // Get revenue (from closed deals)
  const { data: deals } = await supabase
    .from('deals')
    .select('value')
    .eq('workspace_id', workspaceId)
    .eq('stage', 'closed_won')

  const totalRevenue = deals?.reduce((sum, d) => sum + (d.value || 0), 0) || 0

  return {
    totalLeads: leadCount || 0,
    totalDeals: dealCount || 0,
    totalRevenue,
    aiRequests: aiCount || 0,
    activeUsers: uniqueUsers.size,
    period: {
      start: thirtyDaysAgo,
      end: new Date(),
    },
  }
}
