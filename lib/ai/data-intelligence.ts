/**
 * Data Intelligence Layer
 * Aggregates and analyzes data from various sources
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Types
export interface AnalyticsEvent {
  id: string
  event_type: string
  user_id: string | null
  email: string | null
  source: string | null
  plan: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  company: string | null
  source: string | null
  status: string
  lead_score: number | null
  notes: string | null
  created_at: string
}

export interface AggregatedData {
  totalVisits: number
  totalLeads: number
  conversionRate: number
  topPlans: { plan: string; count: number }[]
  topSources: { source: string; count: number }[]
  leadScoreDistribution: { range: string; count: number }[]
  dropoffPoints: { page: string; count: number }[]
  highIntentUsers: string[]
}

/**
 * Get all analytics events for a time period
 */
export async function getAnalyticsEvents(
  days: number = 30
): Promise<AnalyticsEvent[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('analytics_events')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching analytics events:', error)
    return []
  }

  return data || []
}

/**
 * Get all leads
 */
export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching leads:', error)
    return []
  }

  return data || []
}

/**
 * Get high-intent leads (score > 70)
 */
export async function getHighIntentLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .gte('lead_score', 70)
    .order('lead_score', { ascending: false })

  if (error) {
    console.error('Error fetching high-intent leads:', error)
    return []
  }

  return data || []
}

/**
 * Get leads by score range
 */
export async function getLeadsByScoreRange(): Promise<{ range: string; count: number }[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('lead_score')

  if (error) {
    console.error('Error fetching leads:', error)
    return []
  }

  const distribution = [
    { range: '0-20', count: 0 },
    { range: '21-40', count: 0 },
    { range: '41-60', count: 0 },
    { range: '61-80', count: 0 },
    { range: '81-100', count: 0 },
  ]

  data?.forEach((lead) => {
    const score = lead.lead_score || 0
    if (score <= 20) distribution[0].count++
    else if (score <= 40) distribution[1].count++
    else if (score <= 60) distribution[2].count++
    else if (score <= 80) distribution[3].count++
    else distribution[4].count++
  })

  return distribution
}

/**
 * Aggregate analytics data
 */
export async function aggregateData(): Promise<AggregatedData> {
  const events = await getAnalyticsEvents()
  const leads = await getLeads()
  const leadScoreDist = await getLeadsByScoreRange()

  // Count events by type
  const eventCounts: Record<string, number> = {}
  events.forEach((event) => {
    eventCounts[event.event_type] = (eventCounts[event.event_type] || 0) + 1
  })

  // Count plan selections
  const planCounts: Record<string, number> = {}
  events
    .filter((e) => e.event_type === 'SELECTED_PLAN')
    .forEach((event) => {
      const plan = event.plan || 'unknown'
      planCounts[plan] = (planCounts[plan] || 0) + 1
    })

  // Count sources
  const sourceCounts: Record<string, number> = {}
  events.forEach((event) => {
    const source = event.source || 'direct'
    sourceCounts[source] = (sourceCounts[source] || 0) + 1
  })

  // Find dropoff points (users who visited pricing but didn't convert)
  const pricingVisitors = events.filter(
    (e) => e.event_type === 'USER_VISITED_PRICING'
  ).length
  const conversions = events.filter(
    (e) => e.event_type === 'SELECTED_PLAN' || e.event_type === 'SUBMITTED_LEAD_FORM'
  ).length
  const dropoffCount = Math.max(0, pricingVisitors - conversions)

  // Find high-intent users (visited pricing 3+ times)
  const userVisitCounts: Record<string, number> = {}
  events
    .filter((e) => e.event_type === 'USER_VISITED_PRICING')
    .forEach((event) => {
      if (event.user_id) {
        userVisitCounts[event.user_id] = (userVisitCounts[event.user_id] || 0) + 1
      }
    })

  const highIntentUsers = Object.entries(userVisitCounts)
    .filter(([_, count]) => count >= 3)
    .map(([userId]) => userId)

  return {
    totalVisits: events.length,
    totalLeads: leads.length,
    conversionRate: events.length > 0 ? (conversions / events.length) * 100 : 0,
    topPlans: Object.entries(planCounts)
      .map(([plan, count]) => ({ plan, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    topSources: Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    leadScoreDistribution: leadScoreDist,
    dropoffPoints: [
      { page: 'pricing', count: dropoffCount },
    ],
    highIntentUsers,
  }
}

/**
 * Get user journey (all events for a specific user/email)
 */
export async function getUserJourney(identifier: string): Promise<AnalyticsEvent[]> {
  const { data, error } = await supabase
    .from('analytics_events')
    .select('*')
    .or(`user_id.eq.${identifier},email.eq.${identifier}`)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching user journey:', error)
    return []
  }

  return data || []
}

/**
 * Calculate lead score based on behavior
 */
export function calculateBehaviorScore(events: AnalyticsEvent[]): number {
  let score = 0

  // Visit pricing page: +10
  score += events.filter((e) => e.event_type === 'USER_VISITED_PRICING').length * 10

  // Clicked CTA: +20
  score += events.filter((e) => e.event_type?.startsWith('CLICKED_')).length * 20

  // Selected plan: +30
  score += events.filter((e) => e.event_type === 'SELECTED_PLAN').length * 30

  // Submitted form: +25
  score += events.filter((e) => e.event_type === 'SUBMITTED_LEAD_FORM').length * 25

  // Completed onboarding: +15
  score += events.filter((e) => e.event_type === 'COMPLETED_ONBOARDING').length * 15

  return Math.min(score, 100) // Cap at 100
}

export default {
  getAnalyticsEvents,
  getLeads,
  getHighIntentLeads,
  getLeadsByScoreRange,
  aggregateData,
  getUserJourney,
  calculateBehaviorScore,
}
