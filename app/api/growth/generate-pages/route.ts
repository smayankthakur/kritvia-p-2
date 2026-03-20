/**
 * Page Generation API
 * Programmatically generate landing pages from keywords
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateLandingPage, saveLandingPage } from '@/lib/growth/page-generator'
import { getTargetKeywords } from '@/lib/growth/seo-engine'

const generateSchema = z.object({
  keyword: z.string().min(1),
  industry: z.string().min(1),
  use_case: z.string().min(1),
})

const batchGenerateSchema = z.object({
  count: z.number().min(1).max(20).optional().default(5),
  industry: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = generateSchema.parse(body)

    // Generate page content
    const pageData = await generateLandingPage({
      keyword: validated.keyword,
      industry: validated.industry,
      use_case: validated.use_case,
    })

    // Save to database
    const pageId = await saveLandingPage(pageData)

    if (!pageId) {
      return NextResponse.json(
        { error: 'Failed to save page' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      page: pageData,
      url: `/${pageData.slug}`,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Error generating page:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Batch generate pages
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = batchGenerateSchema.parse(body)

    // Get target keywords
    const keywords = await getTargetKeywords(validated.count)

    const generated: Array<{ keyword: string; status: string; url?: string }> = []

    for (const keyword of keywords) {
      // Skip if not matching industry filter
      if (validated.industry && keyword.industry !== validated.industry) {
        continue
      }

      try {
        const pageData = await generateLandingPage({
          keyword: keyword.keyword,
          industry: keyword.industry,
          use_case: keyword.use_case,
        })

        const pageId = await saveLandingPage(pageData)

        generated.push({
          keyword: keyword.keyword,
          status: pageId ? 'success' : 'failed',
          url: pageId ? `/${pageData.slug}` : undefined,
        })
      } catch (err) {
        generated.push({
          keyword: keyword.keyword,
          status: 'error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      generated,
      summary: {
        total: generated.length,
        successful: generated.filter((g) => g.status === 'success').length,
        failed: generated.filter((g) => g.status === 'failed').length,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Error in batch generation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Page generation endpoint',
    methods: {
      POST: 'Generate single page',
      PUT: 'Batch generate pages',
    },
  })
}
