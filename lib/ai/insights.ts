/**
 * AI Insight Engine
 * Uses OpenAI to generate actionable insights from data
 */

import OpenAI from 'openai'
import { aggregateData, getLeads, getHighIntentLeads, type AggregatedData, type Lead } from './data-intelligence'
import { safeEnv } from '@/lib/env'

// Lazy initialization
let openai: OpenAI | null = null

const getOpenAI = (): OpenAI => {
  if (!openai) {
    const env = safeEnv()
    if (!env.OPENAI_API_KEY) {
      throw new Error('Missing OPENAI_API_KEY')
    }
    openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })
  }
  return openai
}

// Insight types
export interface Insight {
  id: string
  type: 'sales' | 'marketing' | 'operations' | 'general'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  actionable: boolean
  recommendation?: string
  created_at: string
}

// System prompt for AI
const INSIGHT_SYSTEM_PROMPT = `You are Kritvia's AI Business Analyst. Your role is to analyze business data and generate actionable insights.

You analyze:
1. User behavior analytics (page visits, clicks, conversions)
2. Lead data (scores, sources, conversion likelihood)
3. Marketing funnel performance
4. Sales pipeline health

For each insight, you must provide:
- Clear title
- Detailed description
- Priority level (high/medium/low)
- Whether it's actionable
- Specific recommendation if actionable

Format your response as JSON array with this structure:
[{
  "type": "sales|marketing|operations|general",
  "title": "string",
  "description": "string", 
  "priority": "high|medium|low",
  "actionable": true|false,
  "recommendation": "string or null"
}]`

/**
 * Generate AI insights from aggregated data
 */
export async function generateInsights(): Promise<Insight[]> {
  try {
    const data = await aggregateData()
    const leads = await getLeads()
    const highIntentLeads = await getHighIntentLeads()

    // Prepare context for AI
    const context = `
Business Analytics Summary:
- Total Visits: ${data.totalVisits}
- Total Leads: ${data.totalLeads}
- Conversion Rate: ${data.conversionRate.toFixed(2)}%
- High Intent Users: ${data.highIntentUsers.length}

Top Plans Selected:
${data.topPlans.map((p) => `- ${p.plan}: ${p.count}`).join('\n')}

Traffic Sources:
${data.topSources.map((s) => `- ${s.source}: ${s.count}`).join('\n')}

Lead Score Distribution:
${data.leadScoreDistribution.map((d) => `- ${d.range}: ${d.count}`).join('\n')}

High Intent Leads (score > 70):
${highIntentLeads.slice(0, 5).map((l) => `- ${l.name} (${l.email}) - Score: ${l.lead_score}`).join('\n')}

Dropoff Points:
${data.dropoffPoints.map((d) => `- ${d.page}: ${d.count}`).join('\n')}
`

    // Call OpenAI
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: INSIGHT_SYSTEM_PROMPT },
        { role: 'user', content: `Analyze this business data and generate insights:\n\n${context}` },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    // Parse response
    const content = completion.choices[0]?.message?.content
    if (!content) {
      return getDefaultInsights(data)
    }

    // Try to parse JSON
    try {
      const insights = JSON.parse(content)
      return insights.map((insight: Partial<Insight>, index: number) => ({
        id: `insight-${Date.now()}-${index}`,
        ...insight,
        created_at: new Date().toISOString(),
      }))
    } catch {
      // If JSON parsing fails, create default insights
      return getDefaultInsights(data)
    }
  } catch (error) {
    console.error('Error generating AI insights:', error)
    // Return default insights on error
    const data = await aggregateData()
    return getDefaultInsights(data)
  }
}

/**
 * Generate insights for a specific lead
 */
export async function generateLeadInsights(lead: Lead): Promise<Insight[]> {
  try {
    const context = `
Lead Profile:
- Name: ${lead.name}
- Email: ${lead.email}
- Company: ${lead.company || 'Not specified'}
- Source: ${lead.source || 'Direct'}
- Status: ${lead.status}
- Lead Score: ${lead.lead_score || 0}
- Notes: ${lead.notes || 'None'}
`

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: INSIGHT_SYSTEM_PROMPT },
        { role: 'user', content: `Analyze this specific lead and provide personalized insights:\n\n${context}` },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return getDefaultLeadInsights(lead)
    }

    try {
      const insights = JSON.parse(content)
      return insights.map((insight: Partial<Insight>, index: number) => ({
        id: `lead-insight-${lead.id}-${index}`,
        ...insight,
        created_at: new Date().toISOString(),
      }))
    } catch {
      return getDefaultLeadInsights(lead)
    }
  } catch (error) {
    console.error('Error generating lead insights:', error)
    return getDefaultLeadInsights(lead)
  }
}

/**
 * Get default insights when AI fails
 */
function getDefaultInsights(data: AggregatedData): Insight[] {
  const insights: Insight[] = []

  // High conversion rate insight
  if (data.conversionRate > 5) {
    insights.push({
      id: 'default-1',
      type: 'general',
      title: 'Strong Conversion Performance',
      description: `Your conversion rate of ${data.conversionRate.toFixed(2)}% is above average.`,
      priority: 'medium',
      actionable: false,
      created_at: new Date().toISOString(),
    })
  }

  // Top plan insight
  if (data.topPlans.length > 0) {
    const topPlan = data.topPlans[0]
    insights.push({
      id: 'default-2',
      type: 'sales',
      title: `${topPlan.plan} Plan Most Popular`,
      description: `${topPlan.count} users have selected the ${topPlan.plan} plan.`,
      priority: 'medium',
      actionable: true,
      recommendation: `Consider promoting the ${topPlan.plan} plan more prominently.`,
      created_at: new Date().toISOString(),
    })
  }

  // Lead score distribution insight
  const highScoreLeads = data.leadScoreDistribution.find((d) => d.range === '81-100')?.count || 0
  if (highScoreLeads > 0) {
    insights.push({
      id: 'default-3',
      type: 'sales',
      title: 'High-Value Leads Available',
      description: `${highScoreLeads} leads have scores above 80, indicating high conversion potential.`,
      priority: 'high',
      actionable: true,
      recommendation: 'Prioritize outreach to these high-score leads immediately.',
      created_at: new Date().toISOString(),
    })
  }

  // Dropoff insight
  if (data.dropoffPoints[0]?.count > 10) {
    insights.push({
      id: 'default-4',
      type: 'marketing',
      title: 'Pricing Page Dropoff',
      description: `${data.dropoffPoints[0].count} users visited pricing but didn't convert.`,
      priority: 'high',
      actionable: true,
      recommendation: 'Consider adding more social proof or a money-back guarantee.',
      created_at: new Date().toISOString(),
    })
  }

  return insights
}

function getDefaultLeadInsights(lead: Lead): Insight[] {
  const insights: Insight[] = []

  // Score-based insight
  const score = lead.lead_score || 0
  if (score >= 80) {
    insights.push({
      id: `lead-default-1-${lead.id}`,
      type: 'sales',
      title: 'Hot Lead - Immediate Action Needed',
      description: `This lead has a score of ${score}, indicating very high conversion probability.`,
      priority: 'high',
      actionable: true,
      recommendation: 'Contact within 24 hours with personalized offer.',
      created_at: new Date().toISOString(),
    })
  } else if (score >= 60) {
    insights.push({
      id: `lead-default-2-${lead.id}`,
      type: 'sales',
      title: 'Warm Lead - Nurture Required',
      description: `This lead has a score of ${score}, showing interest but not ready to buy.`,
      priority: 'medium',
      actionable: true,
      recommendation: 'Add to nurture campaign and follow up in 3-5 days.',
      created_at: new Date().toISOString(),
    })
  }

  // Source-based insight
  if (lead.source === 'ad') {
    insights.push({
      id: `lead-default-3-${lead.id}`,
      type: 'marketing',
      title: 'Ad Campaign Lead',
      description: 'This lead came from a paid advertisement.',
      priority: 'medium',
      actionable: true,
      recommendation: 'Check which ad copy converted this lead for optimization.',
      created_at: new Date().toISOString(),
    })
  }

  return insights
}

/**
 * Generate growth strategy
 */
export async function generateGrowthStrategy(): Promise<string> {
  try {
    const data = await aggregateData()

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a business growth strategist. Provide actionable growth strategies based on the data provided.',
        },
        {
          role: 'user',
          content: `Generate a growth strategy based on:
- Total visits: ${data.totalVisits}
- Total leads: ${data.totalLeads}
- Conversion rate: ${data.conversionRate.toFixed(2)}%
- Top sources: ${data.topSources.map((s) => s.source).join(', ')}
- Top plans: ${data.topPlans.map((p) => p.plan).join(', ')}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    return completion.choices[0]?.message?.content || 'Unable to generate strategy at this time.'
  } catch (error) {
    console.error('Error generating growth strategy:', error)
    return 'Growth strategy generation is temporarily unavailable.'
  }
}

export default {
  generateInsights,
  generateLeadInsights,
  generateGrowthStrategy,
}
