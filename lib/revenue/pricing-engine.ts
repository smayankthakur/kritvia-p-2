/**
 * Self-Evolving Pricing Engine
 * Dynamic pricing based on market and usage
 */

import { createClient } from '@supabase/supabase-js'
import { analyzeCosts } from '../system/cost-optimizer'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface PricingTier {
  name: string
  priceMonthly: number
  priceYearly: number
  features: string[]
  limits: {
    users: number
    leads: number
    deals: number
    aiMessages: number
    workspaces: number
  }
  popular?: boolean
}

// Get current pricing from config
export function getPricingTiers(): PricingTier[] {
  return [
    {
      name: 'Free',
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        '1 User',
        '50 Leads',
        '10 Deals',
        '50 AI Messages/month',
        'Basic Analytics',
        'Email Support',
      ],
      limits: { users: 1, leads: 50, deals: 10, aiMessages: 50, workspaces: 1 },
    },
    {
      name: 'Starter',
      priceMonthly: 2999,
      priceYearly: 29990,
      features: [
        '3 Users',
        '500 Leads',
        '100 Deals',
        '500 AI Messages/month',
        'Advanced Analytics',
        'Priority Support',
        'Custom Fields',
        'API Access',
      ],
      limits: { users: 3, leads: 500, deals: 100, aiMessages: 500, workspaces: 3 },
    },
    {
      name: 'Pro',
      priceMonthly: 7999,
      priceYearly: 79990,
      features: [
        '10 Users',
        'Unlimited Leads',
        'Unlimited Deals',
        'Unlimited AI Messages',
        'AI Assistant',
        'AI SDR Agent',
        'Custom Reports',
        'Webhooks',
        'Team Permissions',
        'Dedicated Support',
      ],
      limits: { users: 10, leads: -1, deals: -1, aiMessages: -1, workspaces: 10 },
      popular: true,
    },
    {
      name: 'Enterprise',
      priceMonthly: -1,
      priceYearly: -1,
      features: [
        'Unlimited Users',
        'Unlimited Everything',
        'AI CEO Agent',
        'White-label',
        'Custom Integrations',
        'On-premise Option',
        'SLA Guarantee',
        'Dedicated Account Manager',
      ],
      limits: { users: -1, leads: -1, deals: -1, aiMessages: -1, workspaces: -1 },
    },
  ]
}

// Analyze market for pricing optimization
export async function analyzeMarketPricing(): Promise<{
  competitorAvg: number
  suggestedRange: { min: number; max: number }
  optimalPrice: number
  confidence: number
}> {
  // In production, scrape competitor pricing
  // Mock data
  const competitors = {
    hubspot: 8900,
    salesforce: 15000,
    pipedrive: 4999,
    zoho: 3000,
  }

  const avg = Object.values(competitors).reduce((a, b) => a + b, 0) / Object.keys(competitors).length
  const min = Math.min(...Object.values(competitors))
  const max = Math.max(...Object.values(competitors))

  return {
    competitorAvg: avg,
    suggestedRange: { min, max },
    optimalPrice: avg * 0.85, // 15% below market
    confidence: 0.75,
  }
}

// Dynamic pricing based on usage and value
export async function calculateDynamicPricing(
  workspaceId: string
): Promise<{
  currentPlan: string
  recommendedPlan: string
  savings: number
  reason: string
}> {
  const { data: usage } = await supabase
    .from('workspace_usage')
    .select('*')
    .eq('workspace_id', workspaceId)
    .single()

  if (!usage) {
    return {
      currentPlan: 'Free',
      recommendedPlan: 'Starter',
      savings: 0,
      reason: 'Upgrade to unlock more features',
    }
  }

  // Simple algorithm for plan recommendation
  const score =
    (usage.api_calls / 100) * 2 +
    (usage.storage_mb / 100) * 1 +
    (usage.team_members * 5) +
    (usage.ai_messages / 10)

  if (score < 10) {
    return { currentPlan: 'Free', recommendedPlan: 'Starter', savings: 0, reason: 'Based on your usage' }
  } else if (score < 50) {
    return { currentPlan: 'Starter', recommendedPlan: 'Pro', savings: 0, reason: 'High usage detected' }
  } else if (score < 200) {
    return { currentPlan: 'Pro', recommendedPlan: 'Enterprise', savings: 0, reason: 'Enterprise features recommended' }
  }

  return { currentPlan: 'Enterprise', recommendedPlan: 'Enterprise', savings: 0, reason: 'Current plan optimal' }
}

// Calculate plan limits
export function calculatePlanLimits(plan: string): {
  users: number
  leads: number
  deals: number
  aiMessages: number
} {
  const tiers = getPricingTiers()
  const tier = tiers.find(t => t.name.toLowerCase() === plan.toLowerCase())
  return tier?.limits || { users: 1, leads: 50, deals: 10, aiMessages: 50 }
}

export default {
  getPricingTiers,
  analyzeMarketPricing,
  calculateDynamicPricing,
  calculatePlanLimits,
}
