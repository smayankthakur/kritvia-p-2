/**
 * Ads Automation Engine
 * AI-generated ad creatives and campaign optimization
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface AdCreative {
  headlines: string[]
  descriptions: string[]
  ctas: string[]
  adCopy: string
}

export interface TargetingConfig {
  industries: string[]
  companySizes: string[]
  locations: string[]
  interests: string[]
}

export interface CampaignConfig {
  platform: 'google' | 'meta' | 'linkedin' | 'twitter'
  name: string
  objective: 'leads' | 'traffic' | 'conversions' | 'awareness'
  budget: number
  targeting: TargetingConfig
}

// Generate ad creatives using AI templates
export function generateAdCreatives(
  keyword: string,
  industry: string,
  platform: 'google' | 'meta' | 'linkedin' | 'twitter'
): AdCreative {
  const platformConfig = {
    google: {
      headlines: [
        `Automate Your ${industry.charAt(0).toUpperCase() + industry.slice(1)} Sales with AI`,
        `The AI CRM That Delivers Results`,
        `Generate More Leads with Intelligent Automation`,
        `Stop Losing Leads - Start Closing More Deals`,
        `${industry.charAt(0).toUpperCase() + industry.slice(1)}? Get 40% More Leads`,
      ],
      descriptions: [
        `Join 10,000+ ${industry} companies using AI to automate sales. Start free trial.`,
        `AI-powered CRM designed for ${industry} businesses. Book your demo today.`,
        `Automate lead capture, scoring, and follow-up. No credit card required.`,
      ],
      ctas: ['Start Free Trial', 'Book Demo', 'Learn More', 'Get Started'],
    },
    meta: {
      headlines: [
        `AI for ${industry.charAt(0).toUpperCase() + industry.slice(1)} Sales`,
        `The Smart Way to Grow`,
        `Automate. Scale. Convert.`,
      ],
      descriptions: [
        `See why ${industry} leaders choose Kritvia. Free trial.`,
        `Your competitors are using AI. Don't get left behind.`,
      ],
      ctas: ['Try Free', 'Learn More', 'Get Started'],
    },
    linkedin: {
      headlines: [
        `Enterprise AI for ${industry.charAt(0).toUpperCase() + industry.slice(1)}`,
        `The AI Platform Your Team Needs`,
        `Scale Sales with Artificial Intelligence`,
      ],
      descriptions: [
        `Trusted by enterprise teams. See the ROI.`,
        `AI-powered sales automation for modern teams.`,
      ],
      ctas: ['Request Demo', 'See Pricing', 'Contact Sales'],
    },
    twitter: {
      headlines: [
        `AI that actually works 🧠`,
        `Stop manual follow-ups`,
        `Grow faster with AI`,
      ],
      descriptions: [
        `Join thousands growing with @kritvia`,
        `#SalesAutomation #AI`,
      ],
      ctas: ['Try Free', 'Learn More'],
    },
  }

  const config = platformConfig[platform]
  const headlines = config.headlines.map(h => h.replace('{industry}', industry))
  const descriptions = config.descriptions.map(d => d.replace('{industry}', industry))

  // Generate ad copy
  const adCopy = `${headlines[0]}\n\n${descriptions[0]}\n\n${config.ctas[0]} now!`

  return {
    headlines,
    descriptions,
    ctas: config.ctas,
    adCopy,
  }
}

// Generate campaign structure
export function generateCampaignStructure(
  industry: string,
  objective: 'leads' | 'traffic' | 'conversions' | 'awareness'
): {
  campaign: string
  adGroups: Array<{ name: string; keywords: string[] }>
} {
  const keywords: Record<string, string[]> = {
    'real-estate': ['real estate crm', 'lead management software', 'real estate automation', 'agent crm'],
    saas: ['saas crm', 'sales automation software', 'b2b crm', 'startup crm'],
    startup: ['startup crm', 'free crm', 'small business crm', 'growth tools'],
    marketing: ['marketing crm', 'agency crm', 'client management', 'marketing automation'],
    sales: ['sales crm', 'sales pipeline', 'crm for sales teams', 'sales automation'],
  }

  const industryKeywords = keywords[industry] || keywords.saas

  return {
    campaign: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Lead Generation - ${objective}`,
    adGroups: industryKeywords.map(kw => ({
      name: kw,
      keywords: [kw, `${kw} software`, `best ${kw}`],
    })),
  }
}

// Optimize campaign based on performance
export async function optimizeCampaign(
  campaignId: string
): Promise<{
  recommendations: string[]
  actions: string[]
}> {
  const recommendations: string[] = []
  const actions: string[] = []

  // Get campaign data
  const { data: campaign } = await supabase
    .from('ad_campaigns')
    .select('*')
    .eq('id', campaignId)
    .single()

  if (!campaign) {
    return { recommendations: ['Campaign not found'], actions: [] }
  }

  // Analyze CTR
  const ctr = campaign.ctr || 0
  if (ctr < 1) {
    recommendations.push('CTR is below 1% - consider new ad copy')
    actions.push('Generate new ad creatives')
  } else if (ctr < 2) {
    recommendations.push('CTR could be improved')
    actions.push('A/B test headlines')
  }

  // Analyze CPC
  const cpc = campaign.cpc || 0
  if (cpc > 10) {
    recommendations.push('CPC is high - optimize targeting')
    actions.push('Refine audience targeting')
  }

  // Analyze conversions
  const conversions = campaign.conversions || 0
  const clicks = campaign.clicks || 1
  const conversionRate = (conversions / clicks) * 100

  if (conversionRate < 2) {
    recommendations.push('Low conversion rate - improve landing page')
    actions.push('Review landing page experience')
  }

  // Budget optimization
  const dailyBudget = campaign.budget_daily || 0
  if (dailyBudget < 50) {
    recommendations.push('Consider increasing budget for more reach')
    actions.push('Increase daily budget to $50+')
  }

  // Log decision
  await supabase.from('agent_decisions').insert({
    agent_type: 'ads',
    decision_type: 'optimize_campaign',
    context: { campaign_id: campaignId, metrics: { ctr, cpc, conversions } },
    decision: { recommendations, actions },
    confidence: 0.8,
  })

  return { recommendations, actions }
}

// Create new campaign
export async function createAdCampaign(
  config: CampaignConfig,
  workspaceId: string
): Promise<string | null> {
  const creatives = generateAdCreatives(
    config.name,
    config.targeting.industries[0] || 'general',
    config.platform
  )

  const { data, error } = await supabase
    .from('ad_campaigns')
    .insert({
      platform: config.platform,
      name: config.name,
      workspace_id: workspaceId,
      status: 'draft',
      budget_daily: config.budget,
      ad_creative: creatives,
      targeting: config.targeting,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating campaign:', error)
    return null
  }

  return data?.id || null
}

// Pause underperforming campaign
export async function pauseCampaign(campaignId: string): Promise<boolean> {
  const { error } = await supabase
    .from('ad_campaigns')
    .update({ status: 'paused' })
    .eq('id', campaignId)

  return !error
}

// Resume campaign
export async function resumeCampaign(campaignId: string): Promise<boolean> {
  const { error } = await supabase
    .from('ad_campaigns')
    .update({ status: 'active' })
    .eq('id', campaignId)

  return !error
}

// Get campaign performance
export async function getAdPerformance(workspaceId: string) {
  const { data, error } = await supabase
    .from('ad_campaigns')
    .select('*')
    .eq('workspace_id', workspaceId)
    .in('status', ['active', 'paused'])

  if (error) return []

  const totalSpend = data?.reduce((sum, c) => sum + (c.budget_daily || 0) * 30, 0) || 0
  const totalClicks = data?.reduce((sum, c) => sum + (c.clicks || 0), 0) || 0
  const totalConversions = data?.reduce((sum, c) => sum + (c.conversions || 0), 0) || 0

  return {
    campaigns: data || [],
    summary: {
      totalSpend,
      totalClicks,
      totalConversions,
      avgCtr: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
    },
  }
}

export default {
  generateAdCreatives,
  generateCampaignStructure,
  optimizeCampaign,
  createAdCampaign,
  pauseCampaign,
  resumeCampaign,
  getAdPerformance,
}
