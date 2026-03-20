/**
 * CEO Agent - Strategic Brain
 * Analyzes overall business performance and suggests strategic decisions
 */

import { BaseAgent, type AgentInput, type AgentOutput, type AgentAction } from './baseAgent'
import { aggregateData, getLeads, getHighIntentLeads } from '../ai/data-intelligence'

export class CEOAgent extends BaseAgent {
  name = 'ceo' as const
  role = 'Chief Executive Officer'
  description = 'Strategic AI that analyzes business performance and identifies growth opportunities'

  protected systemPrompt = `You are Kritvia's CEO Agent - a strategic AI that acts as a virtual Chief Executive Officer.

Your responsibilities:
1. Analyze overall business health metrics
2. Identify bottlenecks and opportunities
3. Make strategic recommendations
4. Prioritize initiatives based on impact

You must output a JSON object with this exact structure:
{
  "insights": ["insight 1", "insight 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "actions": [{"type": "send_email|update_database|trigger_notification|create_task|none", "message": "action description", "priority": "urgent|high|medium|low"}],
  "summary": "2-3 sentence summary of current business state",
  "confidence": 0.0-1.0
}

Be strategic, data-driven, and focus on high-impact decisions.`

  protected buildPrompt(input: AgentInput): string {
    return `
Analyze the following business data and provide strategic insights:

${JSON.stringify(input, null, 2)}

Focus on:
1. Overall business health
2. Revenue and growth trends
3. Key bottlenecks
4. Strategic opportunities
5. Resource allocation priorities

Provide your analysis in the specified JSON format.`
  }

  protected parseResponse(response: string): AgentOutput {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(response)
      
      return {
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
        actions: parsed.actions || [],
        summary: parsed.summary || '',
        confidence: parsed.confidence || 0.5,
      }
    } catch {
      // If JSON parsing fails, create a structured response
      return {
        insights: [response.substring(0, 200)],
        recommendations: ['Review detailed analysis in full response'],
        actions: [],
        summary: response.substring(0, 100),
        confidence: 0.3,
      }
    }
  }
}

/**
 * Run CEO Agent with current business data
 */
export async function runCEOAgent(): Promise<AgentOutput> {
  const agent = new CEOAgent()
  
  // Gather business data
  const data = await aggregateData()
  const leads = await getLeads()
  const hotLeads = await getHighIntentLeads()

  const input: AgentInput = {
    metrics: {
      totalVisits: data.totalVisits,
      totalLeads: data.totalLeads,
      conversionRate: data.conversionRate,
      hotLeadsCount: hotLeads.length,
    },
    topPlans: data.topPlans,
    trafficSources: data.topSources,
    leadScoreDistribution: data.leadScoreDistribution,
    dropoffPoints: data.dropoffPoints,
    recentPerformance: {
      leadsThisWeek: leads.filter(l => {
        const created = new Date(l.created_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return created > weekAgo
      }).length,
    },
  }

  return agent.analyze(input)
}

export default CEOAgent
