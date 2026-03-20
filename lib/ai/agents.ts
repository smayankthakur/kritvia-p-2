/**
 * AI Agents
 * Role-based AI agents for different business functions
 */

import { getHighIntentLeads, getLeads, aggregateData, type Lead } from './data-intelligence'
import { evaluateDecisions, batchProcessDecisions, type Decision } from './decision'
import { executeAction } from './action'
import { generateInsights, type Insight } from './insights'

// Agent types
export type AgentType = 'sales' | 'marketing' | 'operations'

export interface AgentReport {
  agent: AgentType
  insights: Insight[]
  decisions: Decision[]
  actions: string[]
  summary: string
  recommendations: string[]
  generated_at: string
}

/**
 * Sales Agent
 * Identifies hot leads and suggests outreach strategies
 */
export async function runSalesAgent(): Promise<AgentReport> {
  const insights: Insight[] = []
  const decisions: Decision[] = []
  const actions: string[] = []
  const recommendations: string[] = []

  try {
    // Get high-intent leads
    const hotLeads = await getHighIntentLeads()
    
    // Evaluate decisions for each hot lead
    for (const lead of hotLeads) {
      const leadDecisions = await evaluateDecisions(lead)
      decisions.push(...leadDecisions)
      
      // Execute urgent actions
      const urgentDecisions = leadDecisions.filter(d => d.priority === 'urgent')
      for (const decision of urgentDecisions) {
        const result = await executeAction(decision)
        if (result.success) {
          actions.push(result.message)
        }
      }
    }

    // Generate sales-specific insights
    const allInsights = await generateInsights()
    insights.push(...allInsights.filter(i => i.type === 'sales'))

    // Sales-specific recommendations
    if (hotLeads.length > 0) {
      recommendations.push(`Contact ${hotLeads.length} high-intent leads immediately`)
      recommendations.push('Prioritize leads with score > 80')
      recommendations.push('Schedule follow-ups within 24 hours')
    } else {
      recommendations.push('Nurture existing leads with content')
      recommendations.push('Increase marketing spend on high-converting channels')
    }

    const summary = `Sales Agent found ${hotLeads.length} hot leads and generated ${decisions.length} decisions.`

    return {
      agent: 'sales',
      insights,
      decisions,
      actions,
      summary,
      recommendations,
      generated_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Sales agent error:', error)
    return {
      agent: 'sales',
      insights,
      decisions,
      actions,
      summary: `Error running sales agent: ${error}`,
      recommendations: ['Check system logs for errors'],
      generated_at: new Date().toISOString(),
    }
  }
}

/**
 * Marketing Agent
 * Analyzes campaigns and suggests optimizations
 */
export async function runMarketingAgent(): Promise<AgentReport> {
  const insights: Insight[] = []
  const decisions: Decision[] = []
  const actions: string[] = []
  const recommendations: string[] = []

  try {
    // Get aggregated data
    const data = await aggregateData()
    const leads = await getLeads()

    // Analyze sources
    const topSource = data.topSources[0]
    if (topSource) {
      insights.push({
        id: `marketing-insight-${Date.now()}`,
        type: 'marketing',
        title: `Top Performing Source: ${topSource.source}`,
        description: `${topSource.count} conversions from ${topSource.source}`,
        priority: 'high',
        actionable: true,
        recommendation: `Increase budget for ${topSource.source} channel`,
        created_at: new Date().toISOString(),
      })
    }

    // Analyze conversion funnel
    if (data.dropoffPoints[0]?.count > 10) {
      insights.push({
        id: `marketing-insight-2-${Date.now()}`,
        type: 'marketing',
        title: 'High Pricing Page Dropoff',
        description: `${data.dropoffPoints[0].count} users didn't convert after visiting pricing`,
        priority: 'high',
        actionable: true,
        recommendation: 'Add more social proof and trust signals to pricing page',
        created_at: new Date().toISOString(),
      })
    }

    // Marketing-specific recommendations
    recommendations.push(`Optimize ${topSource?.source || 'top'} channel for better ROI`)
    recommendations.push('A/B test pricing page CTA')
    recommendations.push('Implement retargeting for pricing visitors')
    
    if (data.conversionRate < 3) {
      recommendations.push('Conversion rate is below average - review funnel')
    }

    const summary = `Marketing Agent analyzed ${data.totalVisits} visits and ${leads.length} leads.`

    return {
      agent: 'marketing',
      insights,
      decisions,
      actions,
      summary,
      recommendations,
      generated_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Marketing agent error:', error)
    return {
      agent: 'marketing',
      insights,
      decisions,
      actions,
      summary: `Error running marketing agent: ${error}`,
      recommendations: ['Check system logs for errors'],
      generated_at: new Date().toISOString(),
    }
  }
}

/**
 * Operations Agent
 * Identifies bottlenecks and suggests improvements
 */
export async function runOperationsAgent(): Promise<AgentReport> {
  const insights: Insight[] = []
  const decisions: Decision[] = []
  const actions: string[] = []
  const recommendations: string[] = []

  try {
    // Get aggregated data
    const data = await aggregateData()
    const leads = await getLeads()

    // Analyze lead processing
    const newLeads = leads.filter(l => l.status === 'new').length
    const processedLeads = leads.length - newLeads
    
    if (newLeads > processedLeads) {
      insights.push({
        id: `ops-insight-${Date.now()}`,
        type: 'operations',
        title: 'Lead Processing Bottleneck',
        description: `${newLeads} leads awaiting processing`,
        priority: 'high',
        actionable: true,
        recommendation: 'Implement automated lead scoring and routing',
        created_at: new Date().toISOString(),
      })
    }

    // Analyze lead score distribution
    const lowScoreLeads = data.leadScoreDistribution.find(d => d.range === '0-20')?.count || 0
    if (lowScoreLeads > 10) {
      insights.push({
        id: `ops-insight-2-${Date.now()}`,
        type: 'operations',
        title: 'Many Low-Quality Leads',
        description: `${lowScoreLeads} leads with low scores`,
        priority: 'medium',
        actionable: true,
        recommendation: 'Review lead capture forms for better qualification',
        created_at: new Date().toISOString(),
      })
    }

    // Operations-specific recommendations
    recommendations.push('Implement automated lead routing')
    recommendations.push('Set up lead scoring thresholds')
    recommendations.push('Create SLA for lead response time')

    const summary = `Operations Agent analyzed ${leads.length} leads and found ${newLeads} unprocessed.`

    return {
      agent: 'operations',
      insights,
      decisions,
      actions,
      summary,
      recommendations,
      generated_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Operations agent error:', error)
    return {
      agent: 'operations',
      insights,
      decisions,
      actions,
      summary: `Error running operations agent: ${error}`,
      recommendations: ['Check system logs for errors'],
      generated_at: new Date().toISOString(),
    }
  }
}

/**
 * Run all agents
 */
export async function runAllAgents(): Promise<{
  sales: AgentReport
  marketing: AgentReport
  operations: AgentReport
}> {
  const [sales, marketing, operations] = await Promise.all([
    runSalesAgent(),
    runMarketingAgent(),
    runOperationsAgent(),
  ])

  return { sales, marketing, operations }
}

/**
 * Run specific agent by type
 */
export async function runAgent(type: AgentType): Promise<AgentReport> {
  switch (type) {
    case 'sales':
      return runSalesAgent()
    case 'marketing':
      return runMarketingAgent()
    case 'operations':
      return runOperationsAgent()
    default:
      throw new Error(`Unknown agent type: ${type}`)
  }
}

export default {
  runSalesAgent,
  runMarketingAgent,
  runOperationsAgent,
  runAllAgents,
  runAgent,
}
