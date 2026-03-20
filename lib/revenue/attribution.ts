/**
 * Revenue Attribution Engine
 * Track which channels drive revenue
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export type RevenueSource = 'seo' | 'ads' | 'outbound' | 'referral' | 'organic' | 'direct'

export interface RevenueEvent {
  leadId: string
  workspaceId: string
  source: RevenueSource
  campaignId?: string
  revenue: number
  eventType: 'lead' | 'signup' | 'trial' | 'subscription' | 'upgrade' | 'downgrade' | 'churn' | 'renewal'
}

// Track a revenue event
export async function trackRevenueEvent(event: RevenueEvent): Promise<string | null> {
  const { data, error } = await supabase
    .from('revenue_events')
    .insert({
      lead_id: event.leadId,
      workspace_id: event.workspaceId,
      source: event.source,
      campaign_id: event.campaignId,
      revenue: event.revenue,
      event_type: event.eventType,
      event_date: new Date().toISOString().split('T')[0],
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error tracking revenue event:', error)
    return null
  }

  return data?.id || null
}

// Get revenue by source
export async function getRevenueBySource(
  workspaceId: string,
  startDate?: Date,
  endDate?: Date
): Promise<Record<RevenueSource, number>> {
  let query = supabase
    .from('revenue_events')
    .select('source, revenue')
    .eq('workspace_id', workspaceId)

  if (startDate) {
    query = query.gte('event_date', startDate.toISOString().split('T')[0])
  }
  if (endDate) {
    query = query.lte('event_date', endDate.toISOString().split('T')[0])
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching revenue:', error)
    return { seo: 0, ads: 0, outbound: 0, referral: 0, organic: 0, direct: 0 }
  }

  const revenueBySource: Record<RevenueSource, number> = {
    seo: 0,
    ads: 0,
    outbound: 0,
    referral: 0,
    organic: 0,
    direct: 0,
  }

  for (const event of data || []) {
    const source = event.source as RevenueSource
    revenueBySource[source] = (revenueBySource[source] || 0) + (event.revenue || 0)
  }

  return revenueBySource
}

// Get conversion by source
export async function getConversionsBySource(
  workspaceId: string
): Promise<Record<RevenueSource, { leads: number; trials: number; subscriptions: number }>> {
  const { data, error } = await supabase
    .from('revenue_events')
    .select('source, event_type')
    .eq('workspace_id', workspaceId)

  if (error) {
    console.error('Error fetching conversions:', error)
    return {
      seo: { leads: 0, trials: 0, subscriptions: 0 },
      ads: { leads: 0, trials: 0, subscriptions: 0 },
      outbound: { leads: 0, trials: 0, subscriptions: 0 },
      referral: { leads: 0, trials: 0, subscriptions: 0 },
      organic: { leads: 0, trials: 0, subscriptions: 0 },
      direct: { leads: 0, trials: 0, subscriptions: 0 },
    }
  }

  const conversions: Record<string, { leads: number; trials: number; subscriptions: number }> = {
    seo: { leads: 0, trials: 0, subscriptions: 0 },
    ads: { leads: 0, trials: 0, subscriptions: 0 },
    outbound: { leads: 0, trials: 0, subscriptions: 0 },
    referral: { leads: 0, trials: 0, subscriptions: 0 },
    organic: { leads: 0, trials: 0, subscriptions: 0 },
    direct: { leads: 0, trials: 0, subscriptions: 0 },
  }

  for (const event of data || []) {
    const source = event.source as RevenueSource
    const type = event.event_type

    if (type === 'lead') conversions[source].leads++
    if (type === 'trial') conversions[source].trials++
    if (type === 'subscription') conversions[source].subscriptions++
  }

  return conversions as Record<RevenueSource, { leads: number; trials: number; subscriptions: number }>
}

// Calculate CAC (Customer Acquisition Cost) by channel
export async function calculateCAC(
  workspaceId: string,
  source: RevenueSource
): Promise<number> {
  // Get marketing spend for this source
  let spend = 0

  if (source === 'ads') {
    const { data: campaigns } = await supabase
      .from('ad_campaigns')
      .select('budget_daily')
      .eq('workspace_id', workspaceId)
      .eq('status', 'active')

    // 30-day spend
    spend = (campaigns?.reduce((sum, c) => sum + (c.budget_daily || 0), 0) || 0) * 30
  } else if (source === 'outbound') {
    // Estimate outreach cost (platform + time)
    spend = 100 // Mock
  }

  // Get conversions
  const { data: events } = await supabase
    .from('revenue_events')
    .select('event_type')
    .eq('workspace_id', workspaceId)
    .eq('source', source)
    .in('event_type', ['subscription', 'trial'])

  const conversions = events?.length || 0

  return conversions > 0 ? spend / conversions : 0
}

// Calculate LTV (Lifetime Value)
export async function calculateLTV(workspaceId: string): Promise<number> {
  // Get all revenue events
  const { data } = await supabase
    .from('revenue_events')
    .select('revenue')
    .eq('workspace_id', workspaceId)
    .in('event_type', ['subscription', 'upgrade', 'renewal'])

  const totalRevenue = data?.reduce((sum, e) => sum + (e.revenue || 0), 0) || 0
  const avgMonthlyRevenue = totalRevenue / 12 // Assume 12 months

  // LTV = avg monthly revenue * 24 months (typical churn)
  return avgMonthlyRevenue * 24
}

// Get attribution report
export async function getAttributionReport(
  workspaceId: string,
  period: '7d' | '30d' | '90d' = '30d'
): Promise<{
  bySource: Record<RevenueSource, { revenue: number; conversions: number; cac: number }>
  totalRevenue: number
  totalConversions: number
  bestChannel: RevenueSource
  worstChannel: RevenueSource
}> {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const revenueBySource = await getRevenueBySource(workspaceId, startDate)
  const conversions = await getConversionsBySource(workspaceId)

  const bySource: Record<RevenueSource, { revenue: number; conversions: number; cac: number }> = {
    seo: { revenue: 0, conversions: 0, cac: 0 },
    ads: { revenue: 0, conversions: 0, cac: 0 },
    outbound: { revenue: 0, conversions: 0, cac: 0 },
    referral: { revenue: 0, conversions: 0, cac: 0 },
    organic: { revenue: 0, conversions: 0, cac: 0 },
    direct: { revenue: 0, conversions: 0, cac: 0 },
  }

  let totalRevenue = 0
  let totalConversions = 0

  for (const source of Object.keys(revenueBySource) as RevenueSource[]) {
    const rev = revenueBySource[source]
    const conv = conversions[source]

    bySource[source] = {
      revenue: rev,
      conversions: (conv?.subscriptions || 0) + (conv?.trials || 0),
      cac: rev > 0 && (conv?.subscriptions || 0) > 0 ? rev / (conv?.subscriptions || 1) : 0,
    }

    totalRevenue += rev
    totalConversions += (conv?.subscriptions || 0) + (conv?.trials || 0)
  }

  // Find best and worst
  const sorted = Object.entries(bySource)
    .filter(([_, v]) => v.revenue > 0)
    .sort((a, b) => b[1].revenue - a[1].revenue)

  return {
    bySource,
    totalRevenue,
    totalConversions,
    bestChannel: (sorted[0]?.[0] as RevenueSource) || 'direct',
    worstChannel: (sorted[sorted.length - 1]?.[0] as RevenueSource) || 'direct',
  }
}

export default {
  trackRevenueEvent,
  getRevenueBySource,
  getConversionsBySource,
  calculateCAC,
  calculateLTV,
  getAttributionReport,
}
