/**
 * Agent Runner
 * Orchestrates all AI agents and manages the automation loop
 */

import { createClient } from '@supabase/supabase-js'
import { runCEOAgent } from './ceoAgent'
import { runSalesAgent } from './salesAgent'
import { runMarketingAgent } from './marketingAgent'
import type { AgentOutput, AgentAction } from './baseAgent'

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Agent runner result
export interface RunnerResult {
  success: boolean
  ceo?: AgentOutput
  sales?: AgentOutput
  marketing?: AgentOutput
  errors: string[]
  executedActions: number
  timestamp: string
}

/**
 * Run all agents in sequence
 */
export async function runAllAgents(): Promise<RunnerResult> {
  const result: RunnerResult = {
    success: true,
    errors: [],
    executedActions: 0,
    timestamp: new Date().toISOString(),
  }

  try {
    // Run CEO Agent
    console.log('Running CEO Agent...')
    result.ceo = await runCEOAgent()
    await logAgentRun('ceo', result.ceo)
    
    // Run Sales Agent
    console.log('Running Sales Agent...')
    result.sales = await runSalesAgent()
    await logAgentRun('sales', result.sales)
    result.executedActions += result.sales.actions.length
    
    // Run Marketing Agent
    console.log('Running Marketing Agent...')
    result.marketing = await runMarketingAgent()
    await logAgentRun('marketing', result.marketing)
    result.executedActions += result.marketing.actions.length

  } catch (error) {
    console.error('Agent runner error:', error)
    result.success = false
    result.errors.push(String(error))
  }

  return result
}

/**
 * Run a specific agent
 */
export async function runSpecificAgent(agent: 'ceo' | 'sales' | 'marketing'): Promise<{
  success: boolean
  output?: AgentOutput
  error?: string
}> {
  try {
    let output: AgentOutput | undefined

    switch (agent) {
      case 'ceo':
        output = await runCEOAgent()
        break
      case 'sales':
        output = await runSalesAgent()
        break
      case 'marketing':
        output = await runMarketingAgent()
        break
    }

    if (output) {
      await logAgentRun(agent, output)
    }

    return { success: true, output }
  } catch (error) {
    console.error(`Error running ${agent} agent:`, error)
    return { success: false, error: String(error) }
  }
}

/**
 * Log agent run to database
 */
async function logAgentRun(agentName: string, output: AgentOutput): Promise<void> {
  try {
    await supabase
      .from('ai_agent_logs')
      .insert({
        agent_name: agentName,
        input: {},
        output: {
          insights: output.insights,
          recommendations: output.recommendations,
          summary: output.summary,
          confidence: output.confidence,
        },
        action_taken: output.actions.map(a => ({
          type: a.type,
          message: a.message,
          priority: a.priority,
        })),
        created_at: new Date().toISOString(),
      })
  } catch (error) {
    console.error('Failed to log agent run:', error)
  }
}

/**
 * Get agent logs
 */
export async function getAgentLogs(limit: number = 50): Promise<unknown[]> {
  try {
    const { data, error } = await supabase
      .from('ai_agent_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Failed to fetch agent logs:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching agent logs:', error)
    return []
  }
}

/**
 * Get latest agent summary
 */
export async function getLatestAgentSummary(): Promise<{
  ceo?: AgentOutput
  sales?: AgentOutput
  marketing?: AgentOutput
}> {
  try {
    const { data, error } = await supabase
      .from('ai_agent_logs')
      .select('agent_name, output')
      .order('created_at', { ascending: false })
      .limit(3)

    if (error || !data) {
      return {}
    }

    const summary: { ceo?: AgentOutput; sales?: AgentOutput; marketing?: AgentOutput } = {}
    
    data.forEach((row) => {
      if (row.agent_name === 'ceo') {
        summary.ceo = row.output as AgentOutput
      } else if (row.agent_name === 'sales') {
        summary.sales = row.output as AgentOutput
      } else if (row.agent_name === 'marketing') {
        summary.marketing = row.output as AgentOutput
      }
    })

    return summary
  } catch (error) {
    console.error('Error fetching agent summary:', error)
    return {}
  }
}

export default {
  runAllAgents,
  runSpecificAgent,
  getAgentLogs,
  getLatestAgentSummary,
}
