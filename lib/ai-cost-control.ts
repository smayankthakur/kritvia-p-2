/**
 * AI Cost Control System
 * Token tracking, cost estimation, and model fallback
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Model pricing (per 1M tokens)
const MODEL_PRICING = {
  'gpt-4o': { input: 5.0, output: 15.0 },
  'gpt-4-turbo': { input: 10.0, output: 30.0 },
  'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
  'gpt-4': { input: 30.0, output: 60.0 },
  'gpt-4-32k': { input: 60.0, output: 120.0 },
} as const

export type ModelName = keyof typeof MODEL_PRICING

export interface AICostMetrics {
  workspaceId: string
  date: string
  model: ModelName
  inputTokens: number
  outputTokens: number
  estimatedCost: number
}

// Fallback model hierarchy (tries cheaper models if limit exceeded)
export const MODEL_FALLBACK: Record<ModelName, ModelName> = {
  'gpt-4o': 'gpt-3.5-turbo',
  'gpt-4-turbo': 'gpt-4o',
  'gpt-3.5-turbo': 'gpt-3.5-turbo', // Last resort
  'gpt-4': 'gpt-4o',
  'gpt-4-32k': 'gpt-4',
}

// Default model
export const DEFAULT_MODEL: ModelName = 'gpt-4o'

/**
 * Calculate cost for a request
 */
export function calculateCost(
  model: ModelName,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = MODEL_PRICING[model]
  if (!pricing) return 0

  const inputCost = (inputTokens / 1_000_000) * pricing.input
  const outputCost = (outputTokens / 1_000_000) * pricing.output

  return inputCost + outputCost
}

/**
 * Get model with fallback
 */
export function getModelWithFallback(
  preferredModel: ModelName,
  remainingBudget?: number
): ModelName {
  let model = preferredModel

  // If we have a budget limit, check if we can use this model
  if (remainingBudget !== undefined && remainingBudget < 0.01) {
    model = MODEL_FALLBACK[preferredModel]
  }

  return model
}

/**
 * Track AI usage and cost
 */
export async function trackAICost(
  workspaceId: string,
  model: ModelName,
  inputTokens: number,
  outputTokens: number
): Promise<{ success: boolean; cost: number }> {
  try {
    const cost = calculateCost(model, inputTokens, outputTokens)
    const today = new Date().toISOString().split('T')[0]

    // Update or insert cost record
    const { data: existing } = await supabase
      .from('ai_cost_metrics')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('date', today)
      .eq('model', model)
      .single()

    if (existing) {
      await supabase
        .from('ai_cost_metrics')
        .update({
          input_tokens: existing.input_tokens + inputTokens,
          output_tokens: existing.output_tokens + outputTokens,
          estimated_cost: existing.estimated_cost + cost,
        })
        .eq('id', existing.id)
    } else {
      await supabase.from('ai_cost_metrics').insert({
        workspace_id: workspaceId,
        date: today,
        model,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        estimated_cost: cost,
      })
    }

    return { success: true, cost }
  } catch (error) {
    console.error('Error tracking AI cost:', error)
    return { success: false, cost: 0 }
  }
}

/**
 * Check if workspace has remaining AI budget
 */
export async function checkAIBudget(
  workspaceId: string,
  requiredBudget: number = 0.01
): Promise<{ allowed: boolean; spent: number; remaining: number }> {
  try {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

    // Get workspace plan and budget
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('plan')
      .eq('id', workspaceId)
      .single()

    // Get AI budget based on plan
    const planBudgets: Record<string, number> = {
      free: 0.50,      // $0.50/month
      starter: 5.00,    // $5/month
      pro: 25.00,      // $25/month
      enterprise: -1,  // unlimited
    }

    const monthlyBudget = planBudgets[workspace?.plan || 'free']

    if (monthlyBudget === -1) {
      return { allowed: true, spent: 0, remaining: Infinity }
    }

    // Get total spent this month
    const { data: costs } = await supabase
      .from('ai_cost_metrics')
      .select('estimated_cost')
      .eq('workspace_id', workspaceId)
      .gte('date', monthStart)
      .lte('date', monthEnd)

    const spent = (costs?.reduce((sum, c) => sum + (c.estimated_cost || 0), 0)) || 0
    const remaining = monthlyBudget - spent

    return {
      allowed: remaining >= requiredBudget,
      spent,
      remaining,
    }
  } catch (error) {
    console.error('Error checking AI budget:', error)
    // Default to allowing on error
    return { allowed: true, spent: 0, remaining: Infinity }
  }
}

/**
 * Get AI usage summary for workspace
 */
export async function getAIUsageSummary(workspaceId: string): Promise<{
  thisMonth: { tokens: number; cost: number }
  lastMonth: { tokens: number; cost: number }
}> {
  const now = new Date()
  
  // This month
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  
  // Last month
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]

  const { data: thisMonthCosts } = await supabase
    .from('ai_cost_metrics')
    .select('input_tokens, output_tokens, estimated_cost')
    .eq('workspace_id', workspaceId)
    .gte('date', thisMonthStart)
    .lte('date', thisMonthEnd)

  const { data: lastMonthCosts } = await supabase
    .from('ai_cost_metrics')
    .select('input_tokens, output_tokens, estimated_cost')
    .eq('workspace_id', workspaceId)
    .gte('date', lastMonthStart)
    .lte('date', lastMonthEnd)

  const thisMonthTokens = (thisMonthCosts?.reduce((sum, c) => 
    sum + (c.input_tokens || 0) + (c.output_tokens || 0), 0)) || 0
  const thisMonthCost = (thisMonthCosts?.reduce((sum, c) => 
    sum + (c.estimated_cost || 0), 0)) || 0

  const lastMonthTokens = (lastMonthCosts?.reduce((sum, c) => 
    sum + (c.input_tokens || 0) + (c.output_tokens || 0), 0)) || 0
  const lastMonthCost = (lastMonthCosts?.reduce((sum, c) => 
    sum + (c.estimated_cost || 0), 0)) || 0

  return {
    thisMonth: { tokens: thisMonthTokens, cost: thisMonthCost },
    lastMonth: { tokens: lastMonthTokens, cost: lastMonthCost },
  }
}

export default {
  MODEL_PRICING,
  MODEL_FALLBACK,
  DEFAULT_MODEL,
  calculateCost,
  getModelWithFallback,
  trackAICost,
  checkAIBudget,
  getAIUsageSummary,
}
