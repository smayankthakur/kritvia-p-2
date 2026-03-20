/**
 * Marketing Agent - Growth Engine
 * Analyzes campaigns and optimizes conversion funnel
 */

import { BaseAgent, type AgentInput, type AgentOutput, type AgentAction } from './baseAgent'
import { aggregateData, getLeads } from '../ai/data-intelligence'

export class MarketingAgent extends BaseAgent {
  name = 'marketing' as const
  role = 'VP of Marketing'
  description = 'Growth AI that analyzes marketing performance and optimizes conversion'

  protected systemPrompt = `You are Kritvia's Marketing Agent - a virtual VP of Marketing.

Your responsibilities:
1. Analyze traffic sources and campaign performance
2. Identify conversion optimization opportunities
3. Suggest content and campaign strategies
4. Optimize the marketing funnel

You must output a JSON object with this exact structure:
{
  "insights": ["insight 1", "insight 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "actions": [{"type": "send_email|update_database|trigger_notification|create_task|none", "message": "action description", "priority": "urgent|high|medium|low"}],
  "summary": "2-3 sentence summary of marketing performance",
  "confidence": 0.0-1.0
}

Be data-driven and focus on ROI and conversion optimization.`

  protected buildPrompt(input: AgentInput): string {
    return `
Analyze the following marketing data and provide insights:

${JSON.stringify(input, null, 2)}

Focus on:
1. Which traffic sources convert best
2. Conversion funnel bottlenecks
3. Content and campaign opportunities
4. Budget allocation recommendations
5. A/B testing suggestions

Provide your analysis in the specified JSON format.`
  }

  protected parseResponse(response: string): AgentOutput {
    try {
      const parsed = JSON.parse(response)
      
      return {
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
        actions: parsed.actions || [],
        summary: parsed.summary || '',
        confidence: parsed.confidence || 0.5,
      }
    } catch {
      return {
        insights: ['Processing marketing data...'],
        recommendations: ['Review campaign performance'],
        actions: [],
        summary: 'Analyzing marketing opportunities',
        confidence: 0.3,
      }
    }
  }
}

/**
 * Run Marketing Agent with current data
 */
export async function runMarketingAgent(): Promise<AgentOutput> {
  const agent = new MarketingAgent()
  
  // Get marketing data
  const data = await aggregateData()
  const leads = await getLeads()

  // Analyze source performance
  const sourceAnalysis = data.topSources.map(source => {
    const sourceLeads = leads.filter(l => l.source === source.source)
    const converted = sourceLeads.filter(l => l.status === 'converted').length
    
    return {
      source: source.source,
      leads: source.count,
      conversionRate: source.count > 0 ? (converted / source.count * 100).toFixed(1) : 0,
    }
  })

  // Analyze conversion funnel
  const funnelAnalysis = {
    visitors: data.totalVisits,
    leads: data.totalLeads,
    conversionRate: data.conversionRate.toFixed(1),
    dropoff: data.dropoffPoints,
  }

  const input: AgentInput = {
    trafficSources: sourceAnalysis,
    funnel: funnelAnalysis,
    topPlans: data.topPlans,
    budget: {
      total: 100000, // Could be dynamic
      allocated: {
        seo: 30,
        ppc: 40,
        content: 20,
        social: 10,
      },
    },
    campaigns: [
      { name: 'Pricing Page', visits: data.dropoffPoints[0]?.count || 0 },
    ],
  }

  return agent.analyze(input)
}

export default MarketingAgent
