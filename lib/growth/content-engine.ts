/**
 * AI Content Engine
 * Auto-generate SEO-optimized blog posts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  keyword_id?: string
  keyword?: string
  meta_description: string
  featured_image?: string
  author: string
  status: 'draft' | 'published' | 'archived'
  views: number
  leads_generated: number
  conversions: number
  avg_read_time: number
  tags: string[]
  created_at: string
  updated_at: string
  published_at?: string
}

export interface GeneratedBlogPost {
  title: string
  slug: string
  excerpt: string
  content: string
  meta_description: string
  featured_image?: string
  tags: string[]
  avg_read_time: number
}

// Generate blog post content using templates
export async function generateBlogPost(params: {
  keyword: string
  industry?: string
  intent?: string
}): Promise<GeneratedBlogPost> {
  const { keyword, industry = 'general' } = params
  
  // Title templates
  const titleTemplates = [
    `The Ultimate Guide to ${keyword} in 2024`,
    `How to Master ${keyword}: A Complete Guide`,
    `${keyword}: Everything You Need to Know`,
    `10 Proven Strategies for ${keyword}`,
    `Why ${keyword} is Critical for Your Business`,
  ]
  
  const title = titleTemplates[Math.floor(Math.random() * titleTemplates.length)]
  
  // Generate slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60)
  
  // Meta description
  const meta_description = `Learn everything about ${keyword} in this comprehensive guide. Discover proven strategies, best practices, and expert tips to succeed.`
  
  // Excerpt
  const excerpt = `${keyword} is transforming how businesses operate. In this guide, we'll explore everything you need to know to get started and succeed.`
  
  // Generate content sections
  const content = generateContentSections(keyword, industry)
  
  // Calculate read time (avg 200 words per minute)
  const wordCount = content.split(/\s+/).length
  const avg_read_time = Math.max(1, Math.ceil(wordCount / 200))
  
  // Tags
  const tags = [
    keyword.toLowerCase(),
    industry,
    'guide',
    'tips',
    'best-practices',
  ]
  
  return {
    title,
    slug,
    excerpt,
    content,
    meta_description,
    featured_image: `/images/blog/${slug}.jpg`,
    tags,
    avg_read_time,
  }
}

function generateContentSections(keyword: string, industry: string): string {
  return `
## Introduction

${keyword} has become one of the most important topics for businesses looking to grow in today's competitive landscape. Whether you're a startup founder, sales leader, or marketing professional, understanding ${keyword} can give you a significant edge over your competition.

In this comprehensive guide, we'll cover everything you need to know about ${keyword}, from the basics to advanced strategies that can help you achieve your business goals.

## What is ${keyword}?

${keyword} refers to the use of technology and processes to streamline and automate business operations. It encompasses a wide range of activities, from customer relationship management to sales automation, marketing campaigns, and data analysis.

The key benefits of ${keyword} include:
- Increased efficiency and productivity
- Better data-driven decision making
- Improved customer experience
- Cost savings through automation
- Scalable growth capabilities

## Why ${keyword} Matters for Your Business

In today's fast-paced business environment, companies that embrace ${keyword} see significant improvements in their operations. Here are some key reasons why it matters:

### 1. Stay Competitive

Your competitors are already using ${keyword} to gain an edge. Without it, you risk falling behind in customer acquisition and retention.

### 2. Improve Customer Experience

Modern customers expect personalized, timely interactions. ${keyword} enables you to deliver exactly that through automated workflows and AI-powered insights.

### 3. Make Data-Driven Decisions

With the right ${keyword} tools, you can collect and analyze data to make informed business decisions that drive growth.

### 4. Scale Your Operations

As your business grows, manual processes become bottlenecks. ${keyword} helps you scale without adding proportional headcount.

## Best Practices for ${keyword}

To get the most out of ${keyword}, follow these proven best practices:

### Start with Clear Goals

Before implementing any ${keyword} strategy, define what you want to achieve. Whether it's increasing leads, improving conversion rates, or enhancing customer satisfaction, having clear goals will guide your implementation.

### Choose the Right Tools

Not all ${keyword} tools are created equal. Look for solutions that:
- Integrate with your existing tech stack
- Offer AI and automation capabilities
- Provide actionable insights
- Scale with your business

### Focus on User Adoption

The best ${keyword} tools are only effective if your team uses them. Invest in training and change management to ensure successful adoption.

### Measure and Optimize

Track key metrics to understand what's working and what's not. Regularly review and optimize your processes for better results.

## Common Challenges and How to Overcome Them

Implementing ${keyword} comes with its challenges. Here are some common issues and solutions:

| Challenge | Solution |
|-----------|----------|
| Data silos | Choose integrated platforms that share data |
| User resistance | Involve users early and provide training |
| Integration complexity | Start with proven integrations first |
| Measuring ROI | Define metrics upfront and track consistently |

## The Future of ${keyword}

As AI and machine learning continue to evolve, ${keyword} will become even more powerful. Here are some trends to watch:

1. **Hyper-personalization**: AI will enable unprecedented levels of personalization in customer interactions
2. **Predictive analytics**: Advanced ML models will predict customer behavior with greater accuracy
3. **Autonomous workflows**: More processes will become fully automated
4. **Voice and conversational interfaces**: Natural language will become the primary interface

## Conclusion

${keyword} is no longer optional—it's essential for business success. By following the strategies and best practices in this guide, you can position your business for growth and stay ahead of the competition.

Ready to get started with ${keyword}? Sign up for a free trial of Kritvia today and see how our AI-powered platform can transform your business.

---

**About Kritvia**: Kritvia is an AI-powered business operating system that helps teams automate lead generation, manage customer relationships, and scale their operations. Start your free trial today at [kritvia.app](https://kritvia.app).
`
}

// Save blog post to database
export async function saveBlogPost(post: GeneratedBlogPost & { keyword_id?: string }): Promise<string | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .upsert({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      meta_description: post.meta_description,
      featured_image: post.featured_image,
      keyword_id: post.keyword_id,
      tags: post.tags,
      avg_read_time: post.avg_read_time,
      status: 'draft',
    }, { onConflict: 'slug' })
    .select('id')
    .single()

  if (error) {
    console.error('Error saving blog post:', error)
    return null
  }

  return data?.id || null
}

// Publish blog post
export async function publishBlogPost(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('blog_posts')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', id)

  return !error
}

// Get blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, seo_keywords(keyword)')
    .eq('slug', slug)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    keyword_id: data.keyword_id,
    keyword: data.seo_keywords?.keyword,
    meta_description: data.meta_description,
    featured_image: data.featured_image,
    author: data.author,
    status: data.status,
    views: data.views,
    leads_generated: data.leads_generated,
    conversions: data.conversions,
    avg_read_time: data.avg_read_time,
    tags: data.tags || [],
    created_at: data.created_at,
    updated_at: data.updated_at,
    published_at: data.published_at,
  }
}

// Get published blog posts
export async function getBlogPosts(limit: number = 10): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, seo_keywords(keyword)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return []

  return (data || []).map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    keyword_id: post.keyword_id,
    keyword: post.seo_keywords?.keyword,
    meta_description: post.meta_description,
    featured_image: post.featured_image,
    author: post.author,
    status: post.status,
    views: post.views,
    leads_generated: post.leads_generated,
    conversions: post.conversions,
    avg_read_time: post.avg_read_time,
    tags: post.tags || [],
    created_at: post.created_at,
    updated_at: post.updated_at,
    published_at: post.published_at,
  }))
}

// Increment view count
export async function incrementViews(slug: string): Promise<void> {
  await supabase.rpc('increment_blog_views', { blog_slug: slug })
}

// Get blog stats
export async function getBlogStats(): Promise<{
  totalPosts: number
  totalViews: number
  totalLeads: number
  avgReadTime: number
}> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('views, leads_generated, avg_read_time')
    .eq('status', 'published')

  if (error) {
    return { totalPosts: 0, totalViews: 0, totalLeads: 0, avgReadTime: 0 }
  }

  const totalPosts = data?.length || 0
  const totalViews = data?.reduce((sum, p) => sum + (p.views || 0), 0) || 0
  const totalLeads = data?.reduce((sum, p) => sum + (p.leads_generated || 0), 0) || 0
  const avgReadTime = totalPosts > 0 
    ? Math.round(data?.reduce((sum, p) => sum + (p.avg_read_time || 0), 0) / totalPosts) 
    : 0

  return { totalPosts, totalViews, totalLeads, avgReadTime }
}

export default {
  generateBlogPost,
  saveBlogPost,
  publishBlogPost,
  getBlogPost,
  getBlogPosts,
  incrementViews,
  getBlogStats,
}
