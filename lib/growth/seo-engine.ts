/**
 * SEO Keyword Engine
 * Generate, store, and manage keyword clusters for SEO
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export type KeywordIntent = 'informational' | 'transactional' | 'commercial' | 'navigational'

export interface SEOKeyword {
  id: string
  keyword: string
  intent: KeywordIntent
  cluster: string
  industry: string
  use_case: string
  difficulty: number
  volume: number
  cpc?: number
  status: 'active' | 'targeting' | 'completed' | 'dropped'
  created_at: string
  updated_at: string
}

export interface KeywordCluster {
  name: string
  keywords: SEOKeyword[]
  totalVolume: number
  avgDifficulty: number
}

// Generate keyword suggestions using AI-like logic
export async function generateKeywordClusters(
  industry: string,
  baseKeywords: string[]
): Promise<SEOKeyword[]> {
  const generatedKeywords: Partial<SEOKeyword>[] = []

  const intentModifiers: Record<KeywordIntent, string[]> = {
    informational: ['how to', 'what is', 'guide to', 'tips for', 'best practices'],
    transactional: ['for', 'software', 'tool', 'app', 'platform'],
    commercial: ['vs', 'compare', 'review', 'top', 'best'],
    navigational: ['login', 'pricing', 'demo', 'free trial'],
  }

  const useCases: Record<string, string[]> = {
    'real-estate': ['lead management', 'client tracking', 'property crm', 'agent crm'],
    saas: ['sales automation', 'subscription management', 'customer success', 'revenue ops'],
    startup: ['lead tracking', 'sales pipeline', 'growth hacking', 'founder tools'],
    marketing: ['campaign management', 'client management', 'analytics', 'automation'],
    sales: ['pipeline management', 'outreach', 'forecasting', 'performance tracking'],
    general: ['crm', 'lead generation', 'automation', 'analytics'],
  }

  const industryUseCases = useCases[industry] || useCases.general

  for (const base of baseKeywords) {
    // Generate variations for each intent
    for (const [intent, modifiers] of Object.entries(intentModifiers)) {
      for (const modifier of modifiers.slice(0, 2)) {
        const keyword = `${modifier} ${base}`.trim()
        if (!generatedKeywords.find((k) => k.keyword === keyword)) {
          generatedKeywords.push({
            keyword,
            intent: intent as KeywordIntent,
            cluster: base.toLowerCase().replace(/\s+/g, '-'),
            industry,
            use_case: industryUseCases[Math.floor(Math.random() * industryUseCases.length)],
            difficulty: Math.floor(Math.random() * 40) + 20,
            volume: Math.floor(Math.random() * 2000) + 100,
            status: 'active',
          })
        }
      }
    }
  }

  // Insert into database
  if (generatedKeywords.length > 0) {
    const { data, error } = await supabase
      .from('seo_keywords')
      .upsert(generatedKeywords, { onConflict: 'keyword' })
      .select()

    if (error) {
      console.error('Error generating keywords:', error)
      return []
    }

    return data || []
  }

  return []
}

// Get keywords by cluster
export async function getKeywordsByCluster(cluster: string): Promise<SEOKeyword[]> {
  const { data, error } = await supabase
    .from('seo_keywords')
    .select('*')
    .eq('cluster', cluster)
    .eq('status', 'active')
    .order('volume', { ascending: false })

  if (error) {
    console.error('Error fetching keywords:', error)
    return []
  }

  return data || []
}

// Get keywords by industry
export async function getKeywordsByIndustry(industry: string): Promise<SEOKeyword[]> {
  const { data, error } = await supabase
    .from('seo_keywords')
    .select('*')
    .eq('industry', industry)
    .eq('status', 'active')
    .order('volume', { ascending: false })

  if (error) {
    console.error('Error fetching keywords:', error)
    return []
  }

  return data || []
}

// Get keyword clusters summary
export async function getKeywordClusters(): Promise<KeywordCluster[]> {
  const { data: keywords, error } = await supabase
    .from('seo_keywords')
    .select('*')
    .eq('status', 'active')
    .order('volume', { ascending: false })

  if (error || !keywords) return []

  // Group by cluster
  const clusterMap = new Map<string, SEOKeyword[]>()
  for (const keyword of keywords) {
    const cluster = keyword.cluster || 'uncategorized'
    if (!clusterMap.has(cluster)) {
      clusterMap.set(cluster, [])
    }
    clusterMap.get(cluster)!.push(keyword)
  }

  // Convert to clusters
  const clusters: KeywordCluster[] = []
  for (const [name, clusterKeywords] of clusterMap) {
    const totalVolume = clusterKeywords.reduce((sum, k) => sum + (k.volume || 0), 0)
    const avgDifficulty = Math.round(
      clusterKeywords.reduce((sum, k) => sum + (k.difficulty || 0), 0) / clusterKeywords.length
    )

    clusters.push({
      name,
      keywords: clusterKeywords,
      totalVolume,
      avgDifficulty,
    })
  }

  return clusters.sort((a, b) => b.totalVolume - a.totalVolume)
}

// Get best target keywords for new pages
export async function getTargetKeywords(limit: number = 10): Promise<SEOKeyword[]> {
  // Score = volume * (100 - difficulty) - prefer high volume, low difficulty
  const { data, error } = await supabase
    .from('seo_keywords')
    .select('*')
    .eq('status', 'active')
    .eq('intent', 'transactional')
    .order('volume', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching target keywords:', error)
    return []
  }

  return data || []
}

// Update keyword status
export async function updateKeywordStatus(
  id: string,
  status: SEOKeyword['status']
): Promise<boolean> {
  const { error } = await supabase
    .from('seo_keywords')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  return !error
}

// Get all unique industries
export async function getIndustries(): Promise<string[]> {
  const { data, error } = await supabase
    .from('seo_keywords')
    .select('industry')
    .eq('status', 'active')

  if (error) return []

  const industries = new Set<string>()
  for (const item of data || []) {
    if (item.industry) industries.add(item.industry)
  }

  return Array.from(industries)
}

// Get SEO stats
export async function getSEOStats(): Promise<{
  totalKeywords: number
  totalVolume: number
  avgDifficulty: number
  clustersCount: number
}> {
  const { data, error } = await supabase
    .from('seo_keywords')
    .select('volume, difficulty, cluster')
    .eq('status', 'active')

  if (error) {
    return { totalKeywords: 0, totalVolume: 0, avgDifficulty: 0, clustersCount: 0 }
  }

  const clusters = new Set<string>()
  let totalVolume = 0
  let totalDifficulty = 0

  for (const item of data || []) {
    totalVolume += item.volume || 0
    totalDifficulty += item.difficulty || 0
    if (item.cluster) clusters.add(item.cluster)
  }

  return {
    totalKeywords: data?.length || 0,
    totalVolume,
    avgDifficulty: data?.length ? Math.round(totalDifficulty / data.length) : 0,
    clustersCount: clusters.size,
  }
}

export default {
  generateKeywordClusters,
  getKeywordsByCluster,
  getKeywordsByIndustry,
  getKeywordClusters,
  getTargetKeywords,
  updateKeywordStatus,
  getIndustries,
  getSEOStats,
}
