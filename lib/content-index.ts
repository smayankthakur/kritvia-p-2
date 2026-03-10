/**
 * Kritvia Content Index
 * 
 * This registry indexes all content sections:
 * - Blog posts
 * - Guides
 * - Whitepapers
 * - Case studies
 * 
 * Used for search, recommendation, and content management.
 */

export interface ContentItem {
  id: string
  slug: string
  title: string
  description: string
  category: 'blog' | 'guides' | 'whitepapers' | 'case-studies'
  tags: string[]
  publishedAt: string
  author?: string
  readTime?: string
  featured?: boolean
}

// Blog posts
export const blogPosts: ContentItem[] = [
  {
    id: '1',
    slug: 'ai-transformation-guide',
    title: 'AI Transformation Guide for Enterprise',
    description: 'Learn how to implement AI in your organization',
    category: 'blog',
    tags: ['AI', 'Enterprise', 'Digital Transformation'],
    publishedAt: '2024-01-15',
    author: 'Mayank Thakur',
    readTime: '8 min read',
    featured: true,
  },
  {
    id: '2',
    slug: 'cloud-architecture-best-practices',
    title: 'Cloud Architecture Best Practices',
    description: 'Building scalable cloud infrastructure',
    category: 'blog',
    tags: ['Cloud', 'Architecture', 'Scalability'],
    publishedAt: '2024-01-10',
    author: 'Mayank Thakur',
    readTime: '6 min read',
    featured: true,
  },
]

// Guides
export const guides: ContentItem[] = [
  {
    id: 'g1',
    slug: 'getting-started',
    title: 'Getting Started with Kritvia',
    description: 'Complete guide to setting up your account',
    category: 'guides',
    tags: ['Onboarding', 'Setup', 'Tutorial'],
    publishedAt: '2024-01-01',
    readTime: '15 min read',
  },
  {
    id: 'g2',
    slug: 'api-integration',
    title: 'API Integration Guide',
    description: 'Learn how to integrate with Kritvia APIs',
    category: 'guides',
    tags: ['API', 'Integration', 'Developer'],
    publishedAt: '2024-01-05',
    readTime: '20 min read',
  },
]

// Whitepapers
export const whitepapers: ContentItem[] = [
  {
    id: 'w1',
    slug: 'enterprise-ai-report',
    title: 'Enterprise AI Implementation Report 2024',
    description: 'Comprehensive study on AI adoption in enterprises',
    category: 'whitepapers',
    tags: ['AI', 'Enterprise', 'Research'],
    publishedAt: '2023-12-01',
  },
  {
    id: 'w2',
    slug: 'future-of-saas',
    title: 'The Future of SaaS Architecture',
    description: 'Trends and predictions for SaaS development',
    category: 'whitepapers',
    tags: ['SaaS', 'Architecture', 'Trends'],
    publishedAt: '2023-11-15',
  },
]

// Case studies
export const caseStudies: ContentItem[] = [
  {
    id: 'c1',
    slug: 'fintech-transformation',
    title: 'Fintech Company Digital Transformation',
    description: 'How we helped a fintech startup scale',
    category: 'case-studies',
    tags: ['Fintech', 'Scale', 'Success Story'],
    publishedAt: '2024-01-08',
    featured: true,
  },
  {
    id: 'c2',
    slug: 'healthcare-ai-implementation',
    title: 'Healthcare AI Implementation',
    description: 'AI-powered diagnostics for healthcare provider',
    category: 'case-studies',
    tags: ['Healthcare', 'AI', 'Implementation'],
    publishedAt: '2024-01-02',
    featured: true,
  },
]

// Combined all content
export const allContent: ContentItem[] = [
  ...blogPosts,
  ...guides,
  ...whitepapers,
  ...caseStudies,
]

// Helper functions
export function getContentByCategory(category: ContentItem['category']): ContentItem[] {
  return allContent.filter(item => item.category === category)
}

export function getFeaturedContent(): ContentItem[] {
  return allContent.filter(item => item.featured)
}

export function searchContent(query: string): ContentItem[] {
  const lowerQuery = query.toLowerCase()
  return allContent.filter(
    item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export function getContentBySlug(slug: string): ContentItem | undefined {
  return allContent.find(item => item.slug === slug)
}

export function getRelatedContent(slug: string, limit: number = 3): ContentItem[] {
  const current = getContentBySlug(slug)
  if (!current) return []

  return allContent
    .filter(item => item.slug !== slug)
    .filter(item => 
      item.category === current.category ||
      item.tags.some(tag => current.tags.includes(tag))
    )
    .slice(0, limit)
}
