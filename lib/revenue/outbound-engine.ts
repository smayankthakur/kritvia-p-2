/**
 * Outbound Automation Engine
 * Automated outreach campaigns with ICP filtering
 */

import { createClient } from '@supabase/supabase-js'
import { generateOutreachMessage, sendOutreach, getLeadsForOutreach, scoreLeadByICP } from '@/lib/agents/sdr-agent'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface CampaignFilter {
  industries?: string[]
  companySizes?: string[]
  minScore?: number
  maxScore?: number
  statuses?: string[]
  sources?: string[]
}

export interface CampaignResult {
  campaignId: string
  leadsProcessed: number
  messagesSent: number
  errors: string[]
}

// Filter leads by ICP criteria
export function filterByICP(leads: any[], filter: CampaignFilter): any[] {
  return leads.filter(lead => {
    // Industry filter
    if (filter.industries?.length && lead.industry) {
      if (!filter.industries.includes(lead.industry.toLowerCase())) {
        return false
      }
    }

    // Company size filter
    if (filter.companySizes?.length && lead.company_size) {
      if (!filter.companySizes.includes(lead.company_size.toLowerCase())) {
        return false
      }
    }

    // Score filter
    const score = lead.score || 0
    if (filter.minScore !== undefined && score < filter.minScore) {
      return false
    }
    if (filter.maxScore !== undefined && score > filter.maxScore) {
      return false
    }

    // Status filter
    if (filter.statuses?.length && lead.status) {
      if (!filter.statuses.includes(lead.status)) {
        return false
      }
    }

    // Source filter
    if (filter.sources?.length && lead.source) {
      if (!filter.sources.includes(lead.source)) {
        return false
      }
    }

    return true
  })
}

// Run outbound campaign
export async function runOutboundCampaign(
  campaignId: string,
  workspaceId: string,
  filter?: CampaignFilter
): Promise<CampaignResult> {
  const result: CampaignResult = {
    campaignId,
    leadsProcessed: 0,
    messagesSent: 0,
    errors: [],
  }

  try {
    // Get campaign details
    const { data: campaign } = await supabase
      .from('outreach_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()

    if (!campaign) {
      throw new Error('Campaign not found')
    }

    // Get leads for outreach
    const allLeads = await getLeadsForOutreach(workspaceId, 50)

    // Apply ICP filter
    const filterConfig: CampaignFilter = {
      industries: campaign.target_industry,
      companySizes: campaign.target_company_size,
      minScore: 30, // Minimum score for outbound
      statuses: ['new', 'contacted'],
      ...filter,
    }

    const filteredLeads = filterByICP(allLeads, filterConfig)
    result.leadsProcessed = filteredLeads.length

    // Update campaign lead count
    await supabase
      .from('outreach_campaigns')
      .update({ leads_count: filteredLeads.length, started_at: new Date().toISOString() })
      .eq('id', campaignId)

    // Send outreach to each lead
    for (const lead of filteredLeads) {
      try {
        // Generate personalized message
        const message = await generateOutreachMessage(lead, campaign.message_template)

        // Send the message
        const sendResult = await sendOutreach(lead.id, message, workspaceId)

        if (sendResult.success) {
          result.messagesSent++
        } else {
          result.errors.push(`Failed to send to ${lead.email}: ${sendResult.error}`)
        }
      } catch (err) {
        result.errors.push(`Error processing lead ${lead.id}: ${String(err)}`)
      }
    }

    // Update campaign stats
    const replyRate = result.messagesSent > 0 
      ? (result.messagesSent * 0.1 / result.messagesSent) * 100 // Mock 10% reply rate
      : 0

    await supabase
      .from('outreach_campaigns')
      .update({
        sent_count: result.messagesSent,
        reply_rate: replyRate,
        status: 'active',
      })
      .eq('id', campaignId)

    // Log agent decision
    await supabase.from('agent_decisions').insert({
      agent_type: 'outbound',
      decision_type: 'run_campaign',
      context: { campaign_id: campaignId, leads_count: result.leadsProcessed },
      decision: { messages_sent: result.messagesSent },
      confidence: 0.9,
    })

    return result
  } catch (error) {
    console.error('Error running campaign:', error)
    result.errors.push(String(error))
    return result
  }
}

// Get optimal send time based on historical data
export function getOptimalSendTime(): { hour: number; day: number } {
  // Mock - would use learning memory in production
  // Best times: Tuesday-Thursday, 9-11am or 2-4pm
  const bestHours = [9, 10, 14, 15]
  const bestDays = [2, 3, 4] // Tuesday, Wednesday, Thursday

  return {
    hour: bestHours[Math.floor(Math.random() * bestHours.length)],
    day: bestDays[Math.floor(Math.random() * bestDays.length)],
  }
}

// Schedule campaign
export async function scheduleCampaign(
  campaignId: string,
  scheduledAt: Date
): Promise<boolean> {
  const { error } = await supabase
    .from('outreach_campaigns')
    .update({ status: 'paused' }) // Will be activated by scheduler
    .eq('id', campaignId)

  // In production, would set up a cron job or queue
  return !error
}

// Get campaign performance
export async function getCampaignPerformance(campaignId: string): Promise<{
  sent: number
  delivered: number
  replied: number
  converted: number
  replyRate: number
  conversionRate: number
}> {
  const { data: outreach } = await supabase
    .from('outreach_sequences')
    .select('status')
    .eq('lead_id', campaignId)

  const sent = outreach?.filter(o => o.status === 'sent').length || 0
  const delivered = outreach?.filter(o => ['sent', 'delivered', 'replied'].includes(o.status)).length || 0
  const replied = outreach?.filter(o => o.status === 'replied').length || 0

  return {
    sent,
    delivered,
    replied,
    converted: 0, // Would track from revenue_events
    replyRate: sent > 0 ? (replied / sent) * 100 : 0,
    conversionRate: sent > 0 ? 0 : 0,
  }
}

// Pause campaign
export async function pauseCampaign(campaignId: string): Promise<boolean> {
  const { error } = await supabase
    .from('outreach_campaigns')
    .update({ status: 'paused' })
    .eq('id', campaignId)

  return !error
}

// Resume campaign
export async function resumeCampaign(campaignId: string): Promise<boolean> {
  const { error } = await supabase
    .from('outreach_campaigns')
    .update({ status: 'active' })
    .eq('id', campaignId)

  return !error
}

// Get active campaigns
export async function getActiveCampaigns(workspaceId: string) {
  const { data, error } = await supabase
    .from('outreach_campaigns')
    .select('*')
    .eq('workspace_id', workspaceId)
    .in('status', ['active', 'draft'])
    .order('created_at', { ascending: false })

  return data || []
}

export default {
  filterByICP,
  runOutboundCampaign,
  getOptimalSendTime,
  scheduleCampaign,
  getCampaignPerformance,
  pauseCampaign,
  resumeCampaign,
  getActiveCampaigns,
}
