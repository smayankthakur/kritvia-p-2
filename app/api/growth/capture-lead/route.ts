/**
 * Lead Capture API
 * Capture and process leads from growth campaigns
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

// Force runtime execution
export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const leadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  business_type: z.string().optional(),
  goal: z.string().optional(),
  industry: z.string().optional(),
  source_page: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = leadSchema.parse(body)

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get IP and user agent
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] 
      || request.headers.get('x-real-ip') 
      || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Calculate lead score
    let leadScore = 0
    if (validated.email.includes('company.com') || validated.email.includes('business.com')) {
      leadScore += 10 // Business email
    }
    if (validated.company) leadScore += 20
    if (validated.business_type) leadScore += 30
    if (validated.goal) leadScore += 20

    // Insert lead
    const { data, error } = await supabase
      .from('growth_leads')
      .insert({
        name: validated.name,
        email: validated.email,
        company: validated.company,
        business_type: validated.business_type,
        industry: validated.industry,
        goal: validated.goal,
        source_page: validated.source_page,
        utm_source: validated.utm_source,
        utm_medium: validated.utm_medium,
        utm_campaign: validated.utm_campaign,
        ip_address: ip,
        user_agent: userAgent,
        lead_score: leadScore,
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving lead:', error)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    // Also create a lead in the CRM
    await supabase.from('leads').insert({
      name: validated.name,
      email: validated.email,
      company: validated.company,
      source: validated.source_page || 'growth_capture',
      status: 'new',
      score: leadScore,
    })

    return NextResponse.json({ 
      success: true, 
      lead: data,
      message: 'Lead captured successfully' 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 })
    }
    console.error('Error in capture-lead:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Lead capture endpoint',
    methods: ['POST']
  })
}
