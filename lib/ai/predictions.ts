/**
 * Predictive Business Engine
 * Forecasting and predictions for business growth
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface Prediction {
  id: string
  type: 'revenue' | 'churn' | 'growth' | 'capacity'
  prediction: number
  confidence: number
  timeframe: string
  factors: string[]
  createdAt: Date
}

export interface BusinessForecast {
  revenue: Array<{ month: string; predicted: number; confidence: number }>
  users: Array<{ month: string; predicted: number; confidence: number }>
  churn: number
  growth: number
}

// Predict revenue
export async function predictRevenue(
  workspaceId: string,
  months: number = 6
): Promise<Array<{ month: string; predicted: number; confidence: number }>> {
  // Get historical data
  const { data: deals } = await supabase
    .from('deals')
    .select('value, stage, created_at')
    .eq('workspace_id', workspaceId)

  // Simple linear regression (in production, use proper ML)
  const closed = deals?.filter(d => d.stage === 'closed') || []
  const totalRevenue = closed.reduce((sum, d) => sum + (d.value || 0), 0)
  const avgMonthly = totalRevenue / 6 || 10000

  const predictions: Array<{ month: string; predicted: number; confidence: number }> = []
  
  for (let i = 1; i <= months; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() + i)
    
    // Simple growth assumption
    const growth = 1 + (i * 0.05)
    predictions.push({
      month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
      predicted: Math.round(avgMonthly * growth),
      confidence: Math.max(0.5, 0.9 - i * 0.05),
    })
  }

  return predictions
}

// Predict churn risk
export async function predictChurnRisk(
  workspaceId: string
): Promise<{
  risk: 'low' | 'medium' | 'high'
  score: number
  factors: string[]
  recommendations: string[]
}> {
  // Get usage data
  const { data: usage } = await supabase
    .from('workspace_usage')
    .select('*')
    .eq('workspace_id', workspaceId)
    .single()

  // Simple scoring (in production, use ML)
  let score = 0

  if (usage) {
    if (usage.api_calls < 100) score += 30
    if (usage.last_active_days > 30) score += 40
    if (!usage.subscription_tier || usage.subscription_tier === 'free') score += 20
  }

  const risk = score > 60 ? 'high' : score > 30 ? 'medium' : 'low'

  const factors = [
    usage?.api_calls < 100 ? 'Low usage' : 'Normal usage',
    usage?.last_active_days > 30 ? 'Inactive recently' : 'Active recently',
    usage?.subscription_tier === 'free' ? 'Free tier' : 'Paid tier',
  ]

  const recommendations = risk === 'high'
    ? ['Reach out to customer', 'Offer onboarding', 'Send re-engagement email']
    : risk === 'medium'
    ? ['Monitor closely', 'Send tips and tricks']
    : ['Continue engagement', 'Ask for feedback']

  return { risk, score, factors, recommendations }
}

// Predict growth
export async function predictGrowth(
  workspaceId: string
): Promise<{
  userGrowth: number
  revenueGrowth: number
  timeline: string
  confidence: number
}> {
  // Get historical data
  const { data: leads } = await supabase
    .from('leads')
    .select('created_at')
    .eq('workspace_id', workspaceId)

  const { data: deals } = await supabase
    .from('deals')
    .select('value, stage, created_at')
    .eq('workspace_id', workspaceId)

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const recentLeads = leads?.filter(l => new Date(l.created_at) > thirtyDaysAgo).length || 0
  const recentDeals = deals?.filter(d => new Date(d.created_at) > thirtyDaysAgo).length || 0
  const closedRevenue = deals?.filter(d => d.stage === 'closed').reduce((s, d) => s + (d.value || 0), 0) || 0

  const userGrowth = recentLeads > 10 ? 25 : recentLeads > 5 ? 15 : 5
  const revenueGrowth = closedRevenue > 50000 ? 30 : closedRevenue > 20000 ? 20 : 10

  return {
    userGrowth,
    revenueGrowth,
    timeline: 'Next 6 months',
    confidence: 0.75,
  }
}

// Predict capacity needs
export async function predictCapacity(): Promise<{
  current: number
  predicted: number
  timeline: string
  recommendations: string[]
}> {
  // Get current usage
  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('id, created_at')

  const { data: usage } = await supabase
    .from('workspace_usage')
    .select('api_calls, storage_mb')

  const totalApiCalls = usage?.reduce((s, u) => s + (u.api_calls || 0), 0) || 0
  const totalStorage = usage?.reduce((s, u) => s + (u.storage_mb || 0), 0) || 0

  const workspaceCount = workspaces?.length || 100
  const predictedGrowth = workspaceCount * 1.3 // 30% growth

  return {
    current: workspaceCount,
    predicted: Math.round(predictedGrowth),
    timeline: '3 months',
    recommendations: [
      'Scale database connections',
      'Add CDN capacity',
      'Increase API rate limits',
    ],
  }
}

// Generate full business forecast
export async function generateForecast(
  workspaceId: string
): Promise<BusinessForecast> {
  const [revenue, growth] = await Promise.all([
    predictRevenue(workspaceId),
    predictGrowth(workspaceId),
  ])

  // Generate user predictions
  const users: Array<{ month: string; predicted: number; confidence: number }> = []
  for (let i = 1; i <= 6; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() + i)
    users.push({
      month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
      predicted: Math.round(100 * (1 + growth.userGrowth / 100) ** i),
      confidence: Math.max(0.5, 0.85 - i * 0.05),
    })
  }

  return {
    revenue,
    users,
    churn: growth.revenueGrowth > 20 ? 2 : 5,
    growth: growth.revenueGrowth,
  }
}

export default {
  predictRevenue,
  predictChurnRisk,
  predictGrowth,
  predictCapacity,
  generateForecast,
}
