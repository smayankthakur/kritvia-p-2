/**
 * Workspace Middleware
 * Validates workspace access and plan permissions for API routes
 */

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { hasFeature, getFeatureLimit, FeatureName } from './permissions'
import { checkUsageLimit } from './usage'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export interface WorkspaceContext {
  workspaceId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
}

// Get workspace context from request
export async function getWorkspaceContext(req: NextRequest): Promise<WorkspaceContext | null> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return null

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { authorization: authHeader } },
  })

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return null

  // Get workspace from header or query
  const workspaceId = req.headers.get('x-workspace-id') || req.nextUrl.searchParams.get('workspace_id')
  if (!workspaceId) return null

  // Verify user has access to workspace
  const { data: workspaceUser } = await supabase
    .from('workspace_users')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single()

  if (!workspaceUser) return null

  // Get workspace plan
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('plan')
    .eq('id', workspaceId)
    .single()

  return {
    workspaceId,
    userId: user.id,
    role: workspaceUser.role,
    plan: workspace?.plan || 'free',
  }
}

// Middleware factory for workspace-scoped routes
export function withWorkspace(
  handler: (req: NextRequest, context: WorkspaceContext) => Promise<NextResponse>,
  options: { requiredRole?: 'owner' | 'admin' | 'member' } = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const context = await getWorkspaceContext(req)

    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check role hierarchy
    if (options.requiredRole) {
      const roleHierarchy = { owner: 3, admin: 2, member: 1 }
      if (roleHierarchy[context.role] < roleHierarchy[options.requiredRole]) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
      }
    }

    return handler(req, context)
  }
}

// Feature check helper
export async function checkFeatureAccess(
  workspaceId: string,
  feature: FeatureName
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('plan')
    .eq('id', workspaceId)
    .single()

  const plan = (workspace?.plan || 'free') as 'free' | 'starter' | 'pro' | 'enterprise'
  const allowed = hasFeature(plan, feature)
  const limit = getFeatureLimit(plan, feature)

  // Get current usage
  const typeMap: Record<FeatureName, 'ai_message' | 'lead' | 'deal' | 'user'> = {
    leads: 'lead',
    deals: 'deal',
    aiChat: 'ai_message',
    dashboard: 'ai_message',
    automation: 'ai_message',
    advancedAnalytics: 'ai_message',
    customIntegrations: 'ai_message',
    prioritySupport: 'ai_message',
    teamMembers: 'user',
    leadsLimit: 'lead',
    aiMessagesLimit: 'ai_message',
    ceoAgent: 'ai_message',
    salesAgent: 'ai_message',
    marketingAgent: 'ai_message',
    dataExport: 'ai_message',
    apiAccess: 'ai_message',
    whiteLabel: 'ai_message',
    customDomain: 'ai_message',
  }

  const usageType = typeMap[feature]
  let current = 0

  if (usageType) {
    const now = new Date()
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

    const { data: usage } = await supabase
      .from('usage_metrics')
      .select('count')
      .eq('workspace_id', workspaceId)
      .eq('type', usageType)
      .gte('period_start', periodStart)
      .lte('period_end', periodEnd)
      .single()

    current = usage?.count || 0
  }

  return { allowed, current, limit }
}

// Usage check helper
export async function checkAndTrackUsage(
  workspaceId: string,
  type: 'ai_message' | 'lead' | 'deal' | 'user'
): Promise<{ allowed: boolean; remaining: number }> {
  const usageCheck = await checkUsageLimit(workspaceId, type)

  if (!usageCheck.allowed) {
    return { allowed: false, remaining: 0 }
  }

  // Track the usage
  await trackUsageInline(workspaceId, type, 1)

  return { allowed: true, remaining: usageCheck.remaining }
}

// Inline track usage (for use in API routes)
async function trackUsageInline(
  workspaceId: string,
  type: 'ai_message' | 'lead' | 'deal' | 'user',
  count: number
): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseKey)

  const now = new Date()
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

  const { data: existing } = await supabase
    .from('usage_metrics')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('type', type)
    .gte('period_start', periodStart)
    .lte('period_end', periodEnd)
    .single()

  if (existing) {
    await supabase
      .from('usage_metrics')
      .update({ count: existing.count + count })
      .eq('id', existing.id)
  } else {
    await supabase.from('usage_metrics').insert({
      workspace_id: workspaceId,
      type,
      count,
      period_start: periodStart,
      period_end: periodEnd,
    })
  }
}

export default {
  getWorkspaceContext,
  withWorkspace,
  checkFeatureAccess,
  checkAndTrackUsage,
}
