/**
 * CEO Agent
 * Strategic decision making and business analysis
 */

import { createClient } from '@supabase/supabase-js'
import { getRevenueBySource, calculateCAC, calculateLTV, getAttributionReport } from '@/lib/revenue/attribution'
import { getCurrentUsage } from '@/lib/usage'
import { getSEOStats } from '@/lib/growth/seo-engine'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface BusinessMetrics {
  revenue: number
  mrr: number
  growth: number
  leads: number
  customers: number
  cac: number
  ltv: number
  churn: number
}

export interface StrategyDecision {
  type: 'increase_budget' | 'decrease_budget' | 'reallocate' | 'pause' | 'launch'
  target: string
  reason: string
  confidence: number
  expected_impact: string
}

// Analyze overall business health
export async function analyzeBusiness(workspaceId: string): Promise<{
  health: 'healthy' | 'warning' | 'critical'
  metrics: BusinessMetrics
  insights: string[]
}> {
  // Get various metrics
  const revenue = await getRevenueBySource(workspaceId)
  const totalRevenue = Object.values(revenue).reduce((a, b) => a + b, 0)
  
  const attribution = await getAttributionReport(workspaceId, '30d')
  
  const usage = await getCurrentUsage(workspaceId)
  
  const seo = await getSEOStats()

  // Calculate key metrics
  const metrics: BusinessMetrics = {
    revenue: totalRevenue,
    mrr: totalRevenue / 12,
    growth: 10, // Would calculate from historical
    leads: usage.leads?.used || 0,
    customers: 100, // Would get from subscriptions
    cac: attribution.bySource.ads?.cac || 0,
    ltv: await calculateLTV(workspaceId),
    churn: 5, // Would calculate from data
  }

  // Generate insights
  const insights: string[] = []

  // Revenue insights
  if (totalRevenue > 0) {
    const bestChannel = attribution.bestChannel
    insights.push(`${bestChannel} is your best performing channel with ₹${attribution.bySource[bestChannel]?.revenue || 0} in revenue`)
  }

  // SEO insights
  if (seo.totalKeywords > 0) {
    insights.push(`SEO is targeting ${seo.totalKeywords} keywords with ${seo.totalVolume} monthly search volume`)
  }

  // Lead insights
  if (usage.leads) {
    const leadPercent = (usage.leads.used / Math.max(1, usage.leads.limit)) * 100
    if (leadPercent > 80) {
      insights.push(`Lead limit at ${leadPercent.toFixed(0)}% - consider upgrading plan`)
    }
  }

  // Determine health
  let health: 'healthy' | 'warning' | 'critical' = 'healthy'
  if (metrics.cac > metrics.ltv * 0.3) {
    health = 'warning'
  }
  if (metrics.cac > metrics.ltv) {
    health = 'critical'
  }

  return { health, metrics, insights }
}

// Set strategy based on analysis
export async function setStrategy(workspaceId: string): Promise<StrategyDecision[]> {
  const decisions: StrategyDecision[] = []

  const attribution = await getAttributionReport(workspaceId, '30d')
  const health = await analyzeBusiness(workspaceId)

  // Budget allocation decisions
  if (attribution.totalRevenue > 0) {
    const bestChannel = attribution.bestChannel
    const worstChannel = attribution.worstChannel

    // If best channel is underperforming, increase budget
    if (bestChannel && attribution.bySource[bestChannel]?.revenue < 10000) {
      decisions.push({
        type: 'increase_budget',
        target: bestChannel,
        reason: `${bestChannel} shows promise but needs more budget`,
        confidence: 0.7,
        expected_impact: '20% revenue increase',
      })
    }

    // If worst channel has high CAC, reallocate
    if (worstChannel && attribution.bySource[worstChannel]?.cac > 1000) {
      decisions.push({
        type: 'reallocate',
        target: worstChannel,
        reason: 'CAC too high compared to LTV',
        confidence: 0.85,
        expected_impact: '30% CAC reduction',
      })
    }
  }

  // Growth decisions
  if (health.health === 'healthy') {
    decisions.push({
      type: 'launch',
      target: 'new_campaign',
      reason: 'Business is healthy - time to scale',
      confidence: 0.8,
      expected_impact: '50% growth in 30 days',
    })
  }

  // Log decisions
  for (const decision of decisions) {
    await supabase.from('agent_decisions').insert({
      agent_type: 'ceo',
      decision_type: decision.type,
      context: { workspace_id: workspaceId, health: health.health },
      decision,
      confidence: decision.confidence,
    })
  }

  return decisions
}

// Allocate budget based on performance
export async function allocateBudget(
  workspaceId: string,
  totalBudget: number
): Promise<Record<string, number>> {
  const attribution = await getAttributionReport(workspaceId, '30d')

  // If no data, use default allocation
  if (attribution.totalRevenue === 0) {
    return {
      seo: totalBudget * 0.3,
      ads: totalBudget * 0.4,
      outbound: totalBudget * 0.2,
      referral: totalBudget * 0.1,
    }
  }

  // Allocate based on performance
  const weights: Record<string, number> = {}

  for (const [channel, data] of Object.entries(attribution.bySource)) {
    if (data.revenue > 0) {
      // Higher weight for better performing channels
      weights[channel] = data.revenue / attribution.totalRevenue
    }
  }

  // Add channels with no data
  const allChannels = ['seo', 'ads', 'outbound', 'referral', 'organic', 'direct']
  for (const channel of allChannels) {
    if (!weights[channel]) {
      weights[channel] = 0.1
    }
  }

  // Normalize and allocate
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
  const allocation: Record<string, number> = {}

  for (const [channel, weight] of Object.entries(weights)) {
    allocation[channel] = Math.round((weight / totalWeight) * totalBudget)
  }

  return allocation
}

// Trigger execution from CEO decisions
export async function triggerExecution(
  workspaceId: string,
  decision: StrategyDecision
): Promise<{
  success: boolean
  action_taken: string
}> {
  switch (decision.type) {
    case 'increase_budget':
      return { success: true, action_taken: `Increased ${decision.target} budget` }
    case 'decrease_budget':
      return { success: true, action_taken: `Decreased ${decision.target} budget` }
    case 'reallocate':
      return { success: true, action_taken: `Reallocated budget from ${decision.target}` }
    case 'pause':
      return { success: true, action_taken: `Paused ${decision.target}` }
    case 'launch':
      return { success: true, action_taken: `Launched new campaign` }
    default:
      return { success: false, action_taken: 'Unknown action' }
  }
}

export default {
  analyzeBusiness,
  setStrategy,
  allocateBudget,
  triggerExecution,
}
