/**
 * AI Personalization Layer
 * Customize content based on user context and behavior
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface UserContext {
  industry?: string
  companySize?: string
  role?: string
  source?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  visitedPages?: string[]
  referralUrl?: string
  country?: string
}

export interface PersonalizationConfig {
  headline?: string
  subheadline?: string
  cta_text?: string
  cta_type?: string
  recommended_plan?: string
  custom_message?: string
  show_social_proof?: boolean
  social_proof_text?: string
}

// Segment definitions
const segmentRules: Record<string, (ctx: UserContext) => boolean> = {
  // By industry
  real_estate: (ctx) => ctx.industry === 'real-estate',
  saas: (ctx) => ctx.industry === 'saas' || ctx.companySize === 'startup',
  startup: (ctx) => ctx.companySize === 'startup' || ctx.industry === 'startup',
  enterprise: (ctx) => ctx.companySize === 'enterprise' || ctx.companySize === 'large',
  
  // By source
  organic: (ctx) => ctx.utm_source === 'google' || ctx.utm_source === 'bing',
  social: (ctx) => ctx.utm_source === 'facebook' || ctx.utm_source === 'linkedin' || ctx.utm_source === 'twitter',
  paid: (ctx) => ctx.utm_medium === 'cpc' || ctx.utm_medium === 'ppc',
  referral: (ctx) => ctx.referralUrl !== undefined,
  
  // By behavior
  returning: (ctx) => (ctx.visitedPages?.length || 0) > 3,
  high_intent: (ctx) => (ctx.visitedPages?.includes('/pricing') ?? false) || (ctx.visitedPages?.includes('/demo') ?? false),
}

// Personalization content by segment
const segmentContent: Record<string, PersonalizationConfig> = {
  // Industry segments
  real_estate: {
    headline: 'The AI CRM Real Estate Agents Love',
    subheadline: 'Automate follow-ups, track leads, and close more deals with AI that understands real estate.',
    cta_text: 'Start Free Trial',
    recommended_plan: 'pro',
  },
  saas: {
    headline: 'Scale Your SaaS with AI-Powered Growth',
    subheadline: 'The only CRM built for SaaS companies. Predict churn, boost LTV, and automate customer success.',
    cta_text: 'Start Free Demo',
    recommended_plan: 'pro',
  },
  startup: {
    headline: 'Get Your First 100 Customers Faster',
    subheadline: 'The startup CRM that helps you close deals without a sales team. Built for founders who hate CRM complexity.',
    cta_text: 'Start Free Forever',
    recommended_plan: 'starter',
  },
  enterprise: {
    headline: 'Enterprise-Grade AI for Your Sales Team',
    subheadline: 'Complete control, advanced analytics, and dedicated support. Built for large teams.',
    cta_text: 'Book Enterprise Demo',
    recommended_plan: 'enterprise',
  },
  
  // Source segments
  organic: {
    headline: 'Discover the AI CRM That Delivers Results',
    subheadline: 'Join 10,000+ companies using Kritvia to grow faster.',
    cta_text: 'Start Free Trial',
    show_social_proof: true,
    social_proof_text: 'Rated 4.8/5 by 2,000+ reviews',
  },
  social: {
    headline: 'See Why Teams Love Kritvia',
    subheadline: 'Join thousands of businesses automating their growth with AI.',
    cta_text: 'Try It Free',
    show_social_proof: true,
  },
  paid: {
    headline: 'Get 40% More Conversions with Kritvia',
    subheadline: 'Stop wasting ad spend. Our AI optimizes your entire funnel.',
    cta_text: 'Start Your Free Trial',
    custom_message: 'Special offer: First 3 months at 50% off',
  },
  
  // Behavior segments
  returning: {
    headline: 'Welcome Back! Ready to Get Started?',
    subheadline: 'Pick up where you left off. Your workspace is waiting.',
    cta_text: 'Continue Setup',
    custom_message: 'Complete your setup in under 10 minutes',
  },
  high_intent: {
    headline: 'Ready to Transform Your Sales?',
    subheadline: 'Let us show you how Kritvia can double your conversion rate.',
    cta_text: 'Book a Demo',
    custom_message: 'Free personalized demo with our growth experts',
  },
}

// Default content fallback
const defaultContent: PersonalizationConfig = {
  headline: 'The AI Operating System for Your Business',
  subheadline: 'Automate leads, deals, and growth with AI that learns your business.',
  cta_text: 'Start Free Trial',
  recommended_plan: 'starter',
  show_social_proof: true,
  social_proof_text: 'Join 10,000+ businesses growing with Kritvia',
}

// Get personalized content based on user context
export async function getPersonalizedContent(
  context: UserContext
): Promise<PersonalizationConfig> {
  // Find matching segments
  const matchingSegments: Array<{ segment: string; priority: number }> = []
  
  for (const [segment, matcher] of Object.entries(segmentRules)) {
    if (matcher(context)) {
      // Priority based on segment type
      const priority = segmentRules[segment] ? 1 : 0
      matchingSegments.push({ segment, priority })
    }
  }

  // Check database for custom rules
  const { data: dbRules } = await supabase
    .from('personalization_rules')
    .select('*')
    .eq('status', 'active')
    .order('priority', { ascending: false })

  // Merge with database rules
  if (dbRules && dbRules.length > 0) {
    for (const rule of dbRules) {
      if (matchesConditions(rule.conditions, context)) {
        matchingSegments.push({
          segment: rule.segment_name,
          priority: rule.priority,
        })
      }
    }
  }

  // Get content from highest priority segment
  if (matchingSegments.length > 0) {
    matchingSegments.sort((a, b) => b.priority - a.priority)
    const topSegment = matchingSegments[0].segment
    
    if (segmentContent[topSegment]) {
      return {
        ...defaultContent,
        ...segmentContent[topSegment],
      }
    }
  }

  return defaultContent
}

// Check if conditions match
function matchesConditions(conditions: Record<string, unknown>, context: UserContext): boolean {
  for (const [key, value] of Object.entries(conditions)) {
    if (context[key as keyof UserContext] !== value) {
      return false
    }
  }
  return true
}

// Get CTA based on context
export function getPersonalizedCTA(context: UserContext): {
  text: string
  type: 'primary' | 'secondary' | 'popup'
  trigger?: 'exit_intent' | 'scroll' | 'time'
} {
  const base = {
    text: 'Start Free Trial',
    type: 'primary' as const,
  }

  if (context.visitedPages?.includes('/pricing')) {
    return { text: 'Book a Demo', type: 'primary' }
  }

  if (context.utm_campaign?.includes('webinar')) {
    return { text: 'Watch Now', type: 'primary' }
  }

  if (context.utm_campaign?.includes('ebook')) {
    return { text: 'Download Free Guide', type: 'primary' }
  }

  // Returning visitor - show exit intent
  if ((context.visitedPages?.length || 0) > 3) {
    return {
      text: 'Last chance! 20% off ends soon',
      type: 'popup',
      trigger: 'exit_intent',
    }
  }

  return base
}

// Get recommended plan
export function getRecommendedPlan(context: UserContext): string {
  if (context.companySize === 'enterprise' || context.companySize === 'large') {
    return 'enterprise'
  }

  if (context.industry === 'saas' || context.companySize === 'startup') {
    return 'pro'
  }

  if (context.visitedPages?.includes('/pricing')) {
    return 'pro'
  }

  return 'starter'
}

// Track personalization events
export async function trackPersonalizationEvent(
  event: string,
  context: UserContext,
  data?: Record<string, unknown>
): Promise<void> {
  await supabase.from('growth_events').insert({
    event_type: `personalization_${event}`,
    user_context: context,
    event_data: data,
    created_at: new Date().toISOString(),
  })
}

// A/B testing support
export async function getABTestVariant(testId: string): Promise<string> {
  // Simple random assignment
  const variants = ['a', 'b', 'c']
  const variant = variants[Math.floor(Math.random() * variants.length)]
  
  // Store assignment
  await supabase.from('ab_test_assignments').upsert({
    test_id: testId,
    variant,
    assigned_at: new Date().toISOString(),
  }, { onConflict: 'test_id' })

  return variant
}

export default {
  getPersonalizedContent,
  getPersonalizedCTA,
  getRecommendedPlan,
  trackPersonalizationEvent,
  getABTestVariant,
}
