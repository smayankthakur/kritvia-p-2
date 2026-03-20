/**
 * Internal Linking Engine
 * Automatically link content to improve SEO authority
 */

import { createClient } from '@supabase/supabase-js'
import { getLandingPages, LandingPageData } from './page-generator'
import { getBlogPosts, BlogPost } from './content-engine'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Anchor text variations
const anchorVariations = [
  'Learn more',
  'Discover more',
  'Read more',
  'Get started',
  'Try it free',
  'Start your free trial',
  'Explore now',
  'See how it works',
]

interface LinkMatch {
  keyword: string
  url: string
  anchor: string
  position: number
}

// Auto-link keywords in content
export function autoLinkContent(
  content: string,
  keywords: LinkMatch[]
): string {
  let linkedContent = content

  // Sort by keyword length (longer first) to avoid partial matches
  const sortedKeywords = [...keywords].sort((a, b) => b.keyword.length - a.keyword.length)

  for (const match of sortedKeywords) {
    // Skip if keyword is already linked
    const linkPattern = new RegExp(`<a[^>]*>.*?${escapeRegex(match.keyword)}.*?</a>`, 'gi')
    if (linkPattern.test(linkedContent)) continue

    // Create the link
    const anchor = match.anchor || anchorVariations[Math.floor(Math.random() * anchorVariations.length)]
    const link = `<a href="${match.url}" class="text-indigo-600 hover:text-indigo-800 underline">${match.keyword}</a>`

    // Replace first occurrence only
    const keywordPattern = new RegExp(`\\b${escapeRegex(match.keyword)}\\b(?![^<]*>)`, 'gi')
    linkedContent = linkedContent.replace(keywordPattern, match.keyword)
  }

  return linkedContent
}

// Add contextual links between paragraphs
export function injectContextualLinks(
  content: string,
  links: Array<{ text: string; url: string; context: string }>
): string {
  const paragraphs = content.split('\n\n')
  const linkedParagraphs: string[] = []

  for (let i = 0; i < paragraphs.length; i++) {
    linkedParagraphs.push(paragraphs[i])

    // Inject a link after some paragraphs
    if (i > 0 && i < paragraphs.length - 1 && links.length > 0) {
      const linkIndex = i % links.length
      const link = links[linkIndex]

      if (link.context && paragraphs[i].includes(link.context)) {
        const linkHtml = `\n\n> ${link.text}: <a href="${link.url}" class="text-indigo-600 hover:text-indigo-800">Learn more</a>\n`
        linkedParagraphs.push(linkHtml)
      }
    }
  }

  return linkedParagraphs.join('\n\n')
}

// Get keywords to link from database
export async function getInternalLinkTargets(): Promise<LinkMatch[]> {
  const links: LinkMatch[] = []

  // Get landing pages
  const pages = await getLandingPages()
  for (const page of pages.slice(0, 10)) {
    links.push({
      keyword: page.title.replace(/ \|.*$/, ''),
      url: `/${page.slug}`,
      anchor: '',
      position: 0,
    })
  }

  // Get blog posts
  const posts = await getBlogPosts(10)
  for (const post of posts) {
    links.push({
      keyword: post.title,
      url: `/blog/${post.slug}`,
      anchor: '',
      position: 0,
    })

    // Also add excerpt keywords
    if (post.excerpt) {
      const words = post.excerpt.split(' ').slice(0, 5).join(' ')
      if (words) {
        links.push({
          keyword: words,
          url: `/blog/${post.slug}`,
          anchor: '',
          position: 0,
        })
      }
    }
  }

  return links
}

// Generate keyword list for content
export async function generateKeywordsForContent(content: string): Promise<LinkMatch[]> {
  const targets = await getInternalLinkTargets()
  
  // Score each target based on occurrence in content
  const scored = targets.map(target => ({
    ...target,
    score: countOccurrences(content, target.keyword),
  }))

  // Filter to those with matches and sort by score
  return scored.filter(t => t.score > 0).sort((a, b) => b.score - a.score)
}

// Helper: count keyword occurrences
function countOccurrences(text: string, keyword: string): number {
  const pattern = new RegExp(escapeRegex(keyword), 'gi')
  const matches = text.match(pattern)
  return matches ? matches.length : 0
}

// Helper: escape regex special characters
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Build navigation links
export function buildNavigationLinks(currentPath: string): Array<{ text: string; url: string; active: boolean }> {
  const navLinks = [
    { text: 'Home', url: '/', active: false },
    { text: 'Features', url: '/#features', active: false },
    { text: 'Pricing', url: '/pricing', active: false },
    { text: 'Blog', url: '/blog', active: false },
    { text: 'Contact', url: '/contact', active: false },
  ]

  return navLinks.map(link => ({
    ...link,
    active: currentPath === link.url,
  }))
}

// Build breadcrumbs
export function buildBreadcrumbs(pathname: string): Array<{ text: string; url: string }> {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: Array<{ text: string; url: string }> = [
    { text: 'Home', url: '/' },
  ]

  let currentUrl = ''
  for (const segment of segments) {
    currentUrl += `/${segment}`
    breadcrumbs.push({
      text: formatSegment(segment),
      url: currentUrl,
    })
  }

  return breadcrumbs
}

function formatSegment(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Generate related content suggestions
export async function getRelatedContent(
  slug: string,
  type: 'landing' | 'blog'
): Promise<Array<{ title: string; url: string; type: string }>> {
  const related: Array<{ title: string; url: string; type: string }> = []

  if (type === 'landing') {
    // Get other landing pages in same industry
    const pages = await getLandingPages()
    const currentPage = pages.find(p => p.slug === slug)

    if (currentPage) {
      const sameIndustry = pages
        .filter(p => p.industry === currentPage.industry && p.slug !== slug)
        .slice(0, 3)

      for (const page of sameIndustry) {
        related.push({
          title: page.title,
          url: `/${page.slug}`,
          type: 'landing',
        })
      }
    }

    // Add blog posts
    const posts = await getBlogPosts(3)
    for (const post of posts) {
      related.push({
        title: post.title,
        url: `/blog/${post.slug}`,
        type: 'blog',
      })
    }
  } else {
    // Get landing pages
    const pages = await getLandingPages()
    for (const page of pages.slice(0, 3)) {
      related.push({
        title: page.title,
        url: `/${page.slug}`,
        type: 'landing',
      })
    }

    // Get other blog posts
    const posts = await getBlogPosts(4)
    for (const post of posts.filter(p => p.slug !== slug).slice(0, 3)) {
      related.push({
        title: post.title,
        url: `/blog/${post.slug}`,
        type: 'blog',
      })
    }
  }

  return related
}

export default {
  autoLinkContent,
  injectContextualLinks,
  getInternalLinkTargets,
  generateKeywordsForContent,
  buildNavigationLinks,
  buildBreadcrumbs,
  getRelatedContent,
}
