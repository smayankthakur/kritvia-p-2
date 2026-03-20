/**
 * Content Performance Tracking API
 * Track views, engagement, and conversions
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const trackSchema = z.object({
  page_type: z.enum(['landing_page', 'blog', 'home', 'pricing', 'other']),
  page_slug: z.string().min(1),
  page_id: z.string().uuid().optional(),
  event_type: z.enum(['view', 'scroll', 'cta_click', 'form_start', 'form_submit', 'conversion']),
  event_data: z.record(z.string(), z.unknown()).optional(),
  session_id: z.string().optional(),
  referrer: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = trackSchema.parse(body)

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get today's period
    const today = new Date()
    const periodStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().split('T')[0]
    const periodEnd = periodStart

    // Check if record exists
    const { data: existing } = await supabase
      .from('content_performance')
      .select('*')
      .eq('page_slug', validated.page_slug)
      .eq('period_start', periodStart)
      .single()

    // Update or insert based on event type
    const updateFields: Record<string, number> = {}
    
    switch (validated.event_type) {
      case 'view':
        updateFields.views = 1
        break
      case 'cta_click':
        updateFields.cta_clicks = 1
        break
      case 'form_start':
        updateFields.form_starts = 1
        break
      case 'form_submit':
        updateFields.form_submissions = 1
        updateFields.leads_generated = 1
        break
      case 'conversion':
        updateFields.conversions = 1
        break
    }

    if (existing) {
      // Update existing record
      const updates: Record<string, number> = {}
      for (const [key, value] of Object.entries(updateFields)) {
        updates[key] = (existing[key] || 0) + value
      }

      await supabase
        .from('content_performance')
        .update(updates)
        .eq('id', existing.id)
    } else {
      // Create new record
      await supabase
        .from('content_performance')
        .insert({
          page_type: validated.page_type,
          page_slug: validated.page_slug,
          page_id: validated.page_id,
          views: updateFields.views || 0,
          cta_clicks: updateFields.cta_click || 0,
          form_starts: updateFields.form_start || 0,
          form_submissions: updateFields.form_submit || 0,
          leads_generated: updateFields.form_submit || 0,
          conversions: updateFields.conversion || 0,
          period_start: periodStart,
          period_end: periodEnd,
        })
    }

    // Also track in events table for real-time analytics
    await supabase.from('growth_events').insert({
      event_type: `content_${validated.event_type}`,
      user_context: {
        page_slug: validated.page_slug,
        session_id: validated.session_id,
        referrer: validated.referrer,
      },
      event_data: validated.event_data,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Error tracking event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get performance stats
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pageSlug = searchParams.get('page_slug')
  const period = searchParams.get('period') || '30'

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    let query = supabase
      .from('content_performance')
      .select('*')
      .gte('period_start', startDate.toISOString().split('T')[0])

    if (pageSlug) {
      query = query.eq('page_slug', pageSlug)
    }

    const { data, error } = await query.order('period_start', { ascending: false })

    if (error) throw error

    // Aggregate stats
    const stats = {
      totalViews: 0,
      totalCtaClicks: 0,
      totalFormSubmissions: 0,
      totalLeads: 0,
      totalConversions: 0,
      pages: data?.length || 0,
    }

    for (const record of data || []) {
      stats.totalViews += record.views || 0
      stats.totalCtaClicks += record.cta_clicks || 0
      stats.totalFormSubmissions += record.form_submissions || 0
      stats.totalLeads += record.leads_generated || 0
      stats.totalConversions += record.conversions || 0
    }

    return NextResponse.json({
      period: `${period} days`,
      stats,
      records: data,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
