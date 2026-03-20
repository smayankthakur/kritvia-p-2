/**
 * Agent Orchestrator
 * Coordinates all AI agents for autonomous business operations
 */

import { createClient } from '@supabase/supabase-js'
import { analyzeBusiness, setStrategy, allocateBudget, triggerExecution } from './ceo-agent'
import { runOutboundCampaign, getActiveCampaigns } from '@/lib/revenue/outbound-engine'
import { optimizeCampaign, createAdCampaign } from '@/lib/revenue/ads-engine'
import { getLeadsForOutreach, generateOutreachMessage, sendOutreach } from './sdr-agent'
import { getSEOStats } from '@/lib/growth/seo-engine'
import { getBlogStats } from '@/lib/growth/content-engine'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface OrchestrationResult {
  timestamp: Date
  ceo_decisions: any[]
  marketing_actions: any[]
  sdr_actions: any[]
  ops_status: any
  errors: string[]
}

// Run the full orchestration cycle
export async function runOrchestrationCycle(workspaceId: string): Promise<OrchestrationResult> {
  const result: OrchestrationResult = {
    timestamp: new Date(),
    ceo_decisions: [],
    marketing_actions: [],
    sdr_actions: [],
    ops_status: {},
    errors: [],
  }

  try {
    // Step 1: CEO Agent - Analyze and decide
    console.log('🔍 Running CEO analysis...')
    const analysis = await analyzeBusiness(workspaceId)
    const decisions = await setStrategy(workspaceId)
    result.ceo_decisions = decisions

    // Step 2: Execute CEO decisions
    for (const decision of decisions) {
      try {
        await triggerExecution(workspaceId, decision)
      } catch (err) {
        result.errors.push(`CEO execution error: ${String(err)}`)
      }
    }

    // Step 3: Marketing Agent - Growth execution
    console.log('📈 Running Marketing Agent...')
    
    // Check SEO
    const seo = await getSEOStats()
    if (seo.totalKeywords < 50) {
      // Need more keywords
      result.marketing_actions.push({ action: 'generate_keywords', reason: 'Low keyword count' })
    }

    // Check blog
    const blog = await getBlogStats()
    if (blog.totalPosts < 10) {
      result.marketing_actions.push({ action: 'generate_blog_posts', reason: 'Low content volume' })
    }

    // Step 4: SDR Agent - Outbound
    console.log('📧 Running SDR Agent...')
    
    const leads = await getLeadsForOutreach(workspaceId, 5)
    for (const lead of leads) {
      try {
        const message = await generateOutreachMessage(lead)
        await sendOutreach(lead.id, message, workspaceId)
        result.sdr_actions.push({ lead_id: lead.id, action: 'outreach_sent' })
      } catch (err) {
        result.errors.push(`SDR error: ${String(err)}`)
      }
    }

    // Step 5: Check campaigns
    const campaigns = await getActiveCampaigns(workspaceId)
    for (const campaign of campaigns) {
      try {
        if (campaign.status === 'active') {
          await runOutboundCampaign(campaign.id, workspaceId)
        }
      } catch (err) {
        result.errors.push(`Campaign error: ${String(err)}`)
      }
    }

    // Step 6: Operations Agent - System health
    console.log('⚙️ Checking Operations...')
    
    result.ops_status = {
      healthy: analysis.health !== 'critical',
      metrics: analysis.metrics,
    }

    // Log orchestration
    await supabase.from('agent_decisions').insert({
      agent_type: 'orchestrator',
      decision_type: 'cycle_complete',
      context: { workspace_id: workspaceId, decisions_count: decisions.length },
      decision: {
        ceo_decisions: decisions.length,
        marketing_actions: result.marketing_actions.length,
        sdr_actions: result.sdr_actions.length,
      },
      confidence: 0.9,
    })

    return result
  } catch (error) {
    console.error('Orchestration error:', error)
    result.errors.push(String(error))
    return result
  }
}

// Run autonomous loop (for cron job)
export async function runAutonomousLoop(): Promise<void> {
  console.log('🚀 Starting autonomous loop...')

  // Get all active workspaces
  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('id, plan')
    .eq('status', 'active')

  if (!workspaces || workspaces.length === 0) {
    console.log('No active workspaces')
    return
  }

  console.log(`Processing ${workspaces.length} workspaces...`)

  for (const workspace of workspaces) {
    try {
      await runOrchestrationCycle(workspace.id)
    } catch (err) {
      console.error(`Error processing workspace ${workspace.id}:`, err)
    }
  }

  console.log('✅ Autonomous loop complete')
}

// Get orchestration history
export async function getOrchestrationHistory(
  workspaceId: string,
  limit: number = 10
) {
  const { data, error } = await supabase
    .from('agent_decisions')
    .select('*')
    .eq('agent_type', 'orchestrator')
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}

// Get agent decisions by type
export async function getAgentDecisions(
  workspaceId: string,
  agentType?: 'ceo' | 'marketing' | 'sdr' | 'ops' | 'orchestrator'
) {
  let query = supabase
    .from('agent_decisions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (agentType) {
    query = query.eq('agent_type', agentType)
  }

  const { data, error } = await query

  return data || []
}

// Manual trigger for specific agent
export async function triggerAgent(
  agentType: 'ceo' | 'marketing' | 'sdr' | 'ops',
  workspaceId: string,
  action?: string
): Promise<any> {
  switch (agentType) {
    case 'ceo':
      if (action === 'analyze') {
        return await analyzeBusiness(workspaceId)
      }
      return await setStrategy(workspaceId)

    case 'marketing':
      if (action === 'seo') {
        return await getSEOStats()
      }
      if (action === 'blog') {
        return await getBlogStats()
      }
      return { message: 'Marketing agent ready' }

    case 'sdr':
      const leads = await getLeadsForOutreach(workspaceId, 10)
      return { leads_count: leads.length }

    case 'ops':
      return await analyzeBusiness(workspaceId)

    default:
      return { error: 'Unknown agent type' }
  }
}

export default {
  runOrchestrationCycle,
  runAutonomousLoop,
  getOrchestrationHistory,
  getAgentDecisions,
  triggerAgent,
}
