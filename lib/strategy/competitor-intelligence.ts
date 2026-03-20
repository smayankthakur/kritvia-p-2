/**
 * Competitor Intelligence Engine
 * Track and analyze competitors
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface Competitor {
  id: string
  name: string
  website: string
  pricing: {
    starter: number
    pro: number
    enterprise: number
  }
  features: string[]
  strengths: string[]
  weaknesses: string[]
  lastAnalyzed: Date
}

export interface CompetitorAnalysis {
  marketShare: Record<string, number>
  pricingComparison: Record<string, number>
  featureGaps: string[]
  opportunities: string[]
  threats: string[]
}

// Mock competitor data
const mockCompetitors: Competitor[] = [
  {
    id: '1',
    name: 'HubSpot',
    website: 'https://hubspot.com',
    pricing: { starter: 8900, pro: 23100, enterprise: -1 },
    features: ['CRM', 'Marketing', 'Sales', 'Service', 'Analytics'],
    strengths: ['Brand recognition', 'Integrations', 'Content tools'],
    weaknesses: ['Expensive', 'Complex', 'Slow'],
    lastAnalyzed: new Date(),
  },
  {
    id: '2',
    name: 'Salesforce',
    website: 'https://salesforce.com',
    pricing: { starter: 15000, pro: 35000, enterprise: -1 },
    features: ['CRM', 'Einstein AI', 'AppExchange', 'Analytics'],
    strengths: ['Enterprise features', 'AI', 'Ecosystem'],
    weaknesses: ['Very expensive', 'Steep learning curve'],
    lastAnalyzed: new Date(),
  },
  {
    id: '3',
    name: 'Pipedrive',
    website: 'https://pipedrive.com',
    pricing: { starter: 4999, pro: 9999, enterprise: -1 },
    features: ['CRM', 'Automation', 'Revenue', 'Team'],
    strengths: ['Easy to use', 'Good pipeline', 'Mobile app'],
    weaknesses: ['Limited features', 'Basic AI'],
    lastAnalyzed: new Date(),
  },
  {
    id: '4',
    name: 'Zoho CRM',
    website: 'https://zoho.com/crm',
    pricing: { starter: 3000, pro: 6000, enterprise: -1 },
    features: ['CRM', 'Automation', 'Analytics', 'SalesIQ'],
    strengths: ['Affordable', 'Feature-rich', 'Free tier'],
    weaknesses: ['UI dated', 'Integration issues'],
    lastAnalyzed: new Date(),
  },
]

// Get all competitors
export async function getCompetitors(): Promise<Competitor[]> {
  return mockCompetitors
}

// Analyze market position
export async function analyzeMarketPosition(): Promise<CompetitorAnalysis> {
  const competitors = await getCompetitors()

  // Calculate market share (mock)
  const marketShare: Record<string, number> = {}
  competitors.forEach(c => {
    marketShare[c.name] = Math.random() * 30 + 10
  })

  // Pricing comparison
  const pricingComparison: Record<string, number> = {}
  competitors.forEach(c => {
    pricingComparison[c.name] = c.pricing.pro
  })
  pricingComparison['Kritvia'] = 7999

  // Feature gaps
  const allFeatures = new Set<string>()
  competitors.forEach(c => c.features.forEach(f => allFeatures.add(f)))
  
  const ourFeatures = ['CRM', 'AI', 'SDR', 'Automation', 'Analytics', 'Pipeline']
  const featureGaps = Array.from(allFeatures).filter(f => !ourFeatures.includes(f))

  // Opportunities
  const opportunities = [
    'Lower price point',
    'AI-first approach',
    'Simpler UX',
    'Better automation',
    'Faster implementation',
  ]

  // Threats
  const threats = [
    'Established players',
    'New AI-native competitors',
    'Market commoditization',
    'Economic downturn',
  ]

  return { marketShare, pricingComparison, featureGaps, opportunities, threats }
}

// Get competitive advantages
export async function getCompetitiveAdvantages(): Promise<{
  advantages: Array<{ title: string; description: string; impact: string }>
  differentiators: string[]
}> {
  return {
    advantages: [
      {
        title: 'AI-Native',
        description: 'Built from ground up with AI at the core',
        impact: 'High',
      },
      {
        title: 'Affordable Pricing',
        description: '50% cheaper than enterprise solutions',
        impact: 'High',
      },
      {
        title: 'All-in-One Platform',
        description: 'CRM + AI + Automation in one',
        impact: 'Medium',
      },
      {
        title: 'Faster Setup',
        description: 'Get started in minutes, not months',
        impact: 'Medium',
      },
    ],
    differentiators: [
      'AI-powered everything',
      'Simpler than Salesforce',
      'Cheaper than HubSpot',
      'Faster than Pipedrive',
    ],
  }
}

// Track competitor updates
export async function trackCompetitorUpdate(
  competitorId: string,
  update: string
): Promise<void> {
  console.log(`Competitor ${competitorId}: ${update}`)
  // In production, store in database
}

export default {
  getCompetitors,
  analyzeMarketPosition,
  getCompetitiveAdvantages,
  trackCompetitorUpdate,
}
