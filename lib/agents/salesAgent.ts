/**
 * Sales Agent - Revenue Engine
 * Identifies high-intent leads and triggers outreach
 */

import { BaseAgent, type AgentInput, type AgentOutput, type AgentAction } from './baseAgent'
import { getLeads, getHighIntentLeads, getUserJourney, calculateBehaviorScore } from '../ai/data-intelligence'
import { executeAction } from '../ai/action'

export class SalesAgent extends BaseAgent {
  name = 'sales' as const
  role = 'VP of Sales'
  description = 'Revenue AI that identifies hot leads and triggers personalized outreach'

  protected systemPrompt = `You are Kritvia's Sales Agent - a virtual VP of Sales.

Your responsibilities:
1. Identify high-intent leads based on behavior and score
2. Prioritize leads for outreach
3. Suggest personalized email templates
4. Recommend follow-up strategies

You must output a JSON object with this exact structure:
{
  "insights": ["insight 1", "insight 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "actions": [{"type": "send_email|update_database|trigger_notification|create_task|none", "target": "lead email or id", "message": "action description", "priority": "urgent|high|medium|low"}],
  "summary": "2-3 sentence summary of sales pipeline",
  "confidence": 0.0-1.0
}

Focus on revenue-impacting decisions. Prioritize leads with score > 80.`

  protected buildPrompt(input: AgentInput): string {
    return `
Analyze the following sales data and provide insights:

${JSON.stringify(input, null, 2)}

For each hot lead (score > 80), determine:
1. Best outreach approach
2. Suggested email subject line
3. Priority level
4. Follow-up timing

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
        insights: ['Processing sales data...'],
        recommendations: ['Review lead pipeline'],
        actions: [],
        summary: 'Analyzing sales opportunities',
        confidence: 0.3,
      }
    }
  }
}

/**
 * Run Sales Agent and execute urgent actions
 */
export async function runSalesAgent(): Promise<AgentOutput> {
  const agent = new SalesAgent()
  
  // Get sales data
  const hotLeads = await getHighIntentLeads()
  const allLeads = await getLeads()

  // Analyze each hot lead's journey
  const leadAnalysis = await Promise.all(
    hotLeads.slice(0, 10).map(async (lead) => {
      const journey = await getUserJourney(lead.email || lead.id)
      const behaviorScore = calculateBehaviorScore(journey)
      
      return {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        company: lead.company,
        score: lead.lead_score,
        behaviorScore,
        status: lead.status,
        journey: journey.slice(-5), // Last 5 events
      }
    })
  )

  const input: AgentInput = {
    hotLeads: leadAnalysis,
    pipelineSummary: {
      total: allLeads.length,
      new: allLeads.filter(l => l.status === 'new').length,
      contacted: allLeads.filter(l => l.status === 'contacted').length,
      converted: allLeads.filter(l => l.status === 'converted').length,
    },
    priorityThreshold: 80,
  }

  const output = await agent.analyze(input)

  // Execute urgent actions
  const urgentActions = output.actions.filter(a => a.priority === 'urgent' || a.priority === 'high')
  
  for (const action of urgentActions) {
    try {
      await executeAction({
        id: `agent-action-${Date.now()}`,
        type: action.type === 'send_email' ? 'SALES_OUTREACH' : 'HIGH_INTENT_MARK',
        trigger: action.message,
        priority: action.priority,
        action: action.message,
        reason: action.message,
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Failed to execute sales action:', error)
    }
  }

  return {
    ...output,
    actions: urgentActions,
  }
}

export default SalesAgent
