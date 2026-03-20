/**
 * Programmatic Landing Page Generator
 * Generate SEO-optimized landing pages automatically
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface LandingPageData {
  slug: string
  industry: string
  use_case: string
  keyword_id?: string
  title: string
  h1: string
  meta_description: string
  hero_headline: string
  hero_subheadline: string
  pain_points: string[]
  solution_content: string
  features: string[]
  roi_content: string
  cta_text: string
  cta_type: 'primary' | 'secondary' | 'popup'
  faq: Array<{ question: string; answer: string }>
  internal_links: Array<{ text: string; url: string }>
}

// Industry-specific content templates
const industryContent: Record<string, {
  painPoints: string[]
  features: string[]
  roi: string
  cta: string
}> = {
  'real-estate': {
    painPoints: [
      'Losing leads due to slow follow-ups',
      'Disorganized client data across spreadsheets',
      'Missing out on referral opportunities',
      'No visibility into agent performance',
      'Time-consuming manual administrative tasks',
    ],
    features: [
      'AI-powered lead scoring and qualification',
      'Automated follow-up sequences',
      'Property listing integration',
      'Client communication tracking',
      'Team performance dashboards',
      'Automated referral management',
    ],
    roi: 'Real estate agencies using Kritvia see 40% more closed deals and save 15+ hours per week on administrative work.',
    cta: 'Start Free Trial',
  },
  saas: {
    painPoints: [
      'High customer churn rates',
      'No visibility into customer health',
      'Manual onboarding processes',
      'Scattered customer data across tools',
      'Difficult to scale customer success',
    ],
    features: [
      'Customer health scoring',
      'Automated onboarding workflows',
      'Usage analytics integration',
      'Churn prediction alerts',
      'Self-service customer portal',
      'Revenue expansion tracking',
    ],
    roi: 'SaaS companies reduce churn by 25% and increase LTV by 35% with Kritvia.',
    cta: 'Start Free Demo',
  },
  startup: {
    painPoints: [
      'Limited resources for sales and marketing',
      'No systematic lead capture process',
      'Difficulty tracking conversion metrics',
      'Founder burnout from manual tasks',
      'Inability to scale outreach efforts',
    ],
    features: [
      'AI-powered lead generation',
      'Automated outbound sequences',
      'One-click CRM setup',
      'Growth analytics dashboard',
      'Founder-friendly pricing',
      'Fast onboarding (under 10 minutes)',
    ],
    roi: 'Startups using Kritvia close 3x more deals with half the effort.',
    cta: 'Start Free Forever',
  },
  marketing: {
    painPoints: [
      'Managing multiple client accounts',
      'No centralized campaign data',
      'Client reporting takes hours',
      'Difficult to prove ROI to clients',
      'Resource allocation challenges',
    ],
    features: [
      'Multi-client management',
      'Campaign performance tracking',
      'Automated client reports',
      'Client portal access',
      'Team collaboration tools',
      'Budget optimization insights',
    ],
    roi: 'Marketing agencies save 20 hours per week per client and increase billable utilization by 30%.',
    cta: 'Start Agency Trial',
  },
  sales: {
    painPoints: [
      'Sales pipeline visibility issues',
      'Manual data entry consuming selling time',
      'No accurate revenue forecasting',
      'Inefficient cold outreach',
      'Lost deals due to poor follow-up',
    ],
    features: [
      'Visual pipeline management',
      'AI-powered deal scoring',
      'Automated data enrichment',
      'Revenue forecasting',
      'Smart call scheduling',
      'Conversation intelligence',
    ],
    roi: 'Sales teams using Kritvia close 35% more deals and reduce administrative time by 50%.',
    cta: 'Start Sales Trial',
  },
}

const defaultContent = {
  painPoints: [
    'Lost leads due to slow follow-ups',
    'Disorganized customer data',
    'No visibility into sales performance',
    'Time-consuming manual processes',
    'Difficulty scaling operations',
  ],
  features: [
    'AI-powered lead scoring',
    'Automated workflows',
    'Real-time analytics',
    'Team collaboration',
    'Custom integrations',
    '24/7 AI assistant',
  ],
  roi: 'Companies using Kritvia see 40% improved conversion rates and save 10+ hours per week.',
  cta: 'Start Free Trial',
}

// Generate landing page content
export async function generateLandingPage(params: {
  keyword: string
  industry: string
  use_case: string
}): Promise<LandingPageData> {
  const { keyword, industry, use_case } = params
  
  const content = industryContent[industry] || defaultContent
  
  // Generate slug
  const slug = `${industry}/${use_case}`.toLowerCase().replace(/\s+/g, '-')
  
  // Build title and h1
  const title = `${keyword} | Kritvia AI CRM`
  const h1 = keyword.charAt(0).toUpperCase() + keyword.slice(1)
  
  // Generate meta description
  const meta_description = `Automate your ${keyword} with Kritvia's AI-powered CRM. Generate more leads, close more deals, and scale your business. Start free today.`
  
  // Hero section
  const hero_headline = `Stop Losing ${industry.charAt(0).toUpperCase() + industry.slice(1)} Leads. Start Winning.`
  const hero_subheadline = `The AI-powered CRM that ${keyword}. Built for modern ${industry} teams.`
  
  // Solution content
  const solution_content = `Kritvia combines the power of artificial intelligence with proven CRM best practices to help you ${keyword}. Our platform learns from your data, automates your workflows, and predicts your best next actions.`
  
  // FAQ generation
  const faq = [
    {
      question: `What makes Kritvia different for ${industry}?`,
      answer: `Kritvia is specifically built for ${industry} teams with AI that understands your unique challenges and workflows.`,
    },
    {
      question: 'How long does setup take?',
      answer: 'Most teams are up and running in under 15 minutes. No credit card required to start.',
    },
    {
      question: 'Can I import existing data?',
      answer: 'Yes! Kritvia imports from Excel, CSV, and 100+ popular tools with one click.',
    },
    {
      question: 'Is my data secure?',
      answer: 'We use enterprise-grade security with SOC 2 compliance, encryption at rest, and GDPR compliance.',
    },
  ]
  
  // Internal links
  const internal_links = [
    { text: 'Pricing', url: '/pricing' },
    { text: 'Features', url: '/#features' },
    { text: 'AI Assistant', url: '/ai' },
    { text: 'Blog', url: '/blog' },
  ]
  
  return {
    slug,
    industry,
    use_case,
    title,
    h1,
    meta_description,
    hero_headline,
    hero_subheadline,
    pain_points: content.painPoints,
    solution_content,
    features: content.features,
    roi_content: content.roi,
    cta_text: content.cta,
    cta_type: 'primary',
    faq,
    internal_links,
  }
}

// Save landing page to database
export async function saveLandingPage(data: LandingPageData): Promise<string | null> {
  const { data: page, error } = await supabase
    .from('landing_pages')
    .upsert({
      slug: data.slug,
      industry: data.industry,
      use_case: data.use_case,
      title: data.title,
      h1: data.h1,
      meta_description: data.meta_description,
      hero_headline: data.hero_headline,
      hero_subheadline: data.hero_subheadline,
      pain_points: data.pain_points,
      solution_content: data.solution_content,
      features: data.features,
      roi_content: data.roi_content,
      cta_text: data.cta_text,
      cta_type: data.cta_type,
      faq: data.faq,
      internal_links: data.internal_links,
      status: 'published',
    }, { onConflict: 'slug' })
    .select('id')
    .single()

  if (error) {
    console.error('Error saving landing page:', error)
    return null
  }

  return page?.id || null
}

// Get landing page by slug
export async function getLandingPage(slug: string): Promise<LandingPageData | null> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) return null

  return {
    slug: data.slug,
    industry: data.industry,
    use_case: data.use_case,
    title: data.title,
    h1: data.h1,
    meta_description: data.meta_description,
    hero_headline: data.hero_headline,
    hero_subheadline: data.hero_subheadline,
    pain_points: data.pain_points || [],
    solution_content: data.solution_content,
    features: data.features || [],
    roi_content: data.roi_content,
    cta_text: data.cta_text,
    cta_type: data.cta_type,
    faq: data.faq || [],
    internal_links: data.internal_links || [],
  }
}

// Get all published landing pages
export async function getLandingPages(): Promise<LandingPageData[]> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('status', 'published')
    .order('views', { ascending: false })

  if (error) return []

  return (data || []).map(page => ({
    slug: page.slug,
    industry: page.industry,
    use_case: page.use_case,
    title: page.title,
    h1: page.h1,
    meta_description: page.meta_description,
    hero_headline: page.hero_headline,
    hero_subheadline: page.hero_subheadline,
    pain_points: page.pain_points || [],
    solution_content: page.solution_content,
    features: page.features || [],
    roi_content: page.roi_content,
    cta_text: page.cta_text,
    cta_type: page.cta_type,
    faq: page.faq || [],
    internal_links: page.internal_links || [],
  }))
}

// Get landing pages by industry
export async function getLandingPagesByIndustry(industry: string): Promise<LandingPageData[]> {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('industry', industry)
    .eq('status', 'published')

  if (error) return []

  return (data || []).map(page => ({
    slug: page.slug,
    industry: page.industry,
    use_case: page.use_case,
    title: page.title,
    h1: page.h1,
    meta_description: page.meta_description,
    hero_headline: page.hero_headline,
    hero_subheadline: page.hero_subheadline,
    pain_points: page.pain_points || [],
    solution_content: page.solution_content,
    features: page.features || [],
    roi_content: page.roi_content,
    cta_text: page.cta_text,
    cta_type: page.cta_type,
    faq: page.faq || [],
    internal_links: page.internal_links || [],
  }))
}

export default {
  generateLandingPage,
  saveLandingPage,
  getLandingPage,
  getLandingPages,
  getLandingPagesByIndustry,
}
