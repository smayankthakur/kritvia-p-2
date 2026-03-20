/**
 * Blog Content Generation API
 * Auto-generate SEO-optimized blog posts
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateBlogPost, saveBlogPost, publishBlogPost, getBlogPost, getBlogPosts } from '@/lib/growth/content-engine'
import { getKeywordsByCluster } from '@/lib/growth/seo-engine'

const generateSchema = z.object({
  keyword: z.string().min(1),
  industry: z.string().optional(),
  intent: z.string().optional(),
})

const publishSchema = z.object({
  id: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = generateSchema.parse(body)

    // Generate blog post
    const post = await generateBlogPost({
      keyword: validated.keyword,
      industry: validated.industry,
      intent: validated.intent,
    })

    // Save to database
    const postId = await saveBlogPost(post)

    if (!postId) {
      return NextResponse.json(
        { error: 'Failed to save post' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      post: { ...post, id: postId },
      previewUrl: `/blog/${post.slug}`,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Error generating blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Publish a draft post
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = publishSchema.parse(body)

    const success = await publishBlogPost(validated.id)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to publish post' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Post published successfully',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Error publishing blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get posts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const limit = parseInt(searchParams.get('limit') || '10')

  try {
    if (slug) {
      const post = await getBlogPost(slug)
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
      return NextResponse.json({ post })
    }

    const posts = await getBlogPosts(limit)
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
