import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// Schema for public lead capture
const publicLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().optional(),
  useCase: z.string().optional(),
  message: z.string().optional(),
  source: z.string().default("website"),
  leadScore: z.number().default(0),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 leads per minute per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitKey = `public-lead:${ip}`
    const rateLimitResult = rateLimit(rateLimitKey, RATE_LIMITS.CONTACT)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validation = publicLeadSchema.safeParse(body)
    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || "Invalid input"
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    const { name, email, company, useCase, message, source, leadScore } = validation.data

    // Get Supabase client
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Store lead in database
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        name,
        email,
        company: company || null,
        source: source || 'website',
        status: 'new',
        notes: message ? `Use case: ${useCase || 'Not specified'}\nMessage: ${message}` : `Use case: ${useCase || 'Not specified'}`,
        lead_score: leadScore,
      })
      .select()
      .single()

    if (leadError) {
      console.error('Lead insertion error:', leadError)
      // Don't fail the request if DB insert fails - just log it
    }

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })

      const mailOptions = {
        from: `"Kritvia Leads" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New Lead: ${name} - ${company || 'No company'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">New Lead Captured!</h2>
            
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1F2937;">Contact Information</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Company:</strong> ${company || 'Not provided'}</p>
              <p><strong>Use Case:</strong> ${useCase || 'Not specified'}</p>
              <p><strong>Lead Score:</strong> ${leadScore}/100</p>
            </div>
            
            ${message ? `
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1F2937;">Message</h3>
              <p>${message}</p>
            </div>
            ` : ''}
            
            <p style="color: #6B7280; font-size: 12px;">
              Source: ${source} | Captured at: ${new Date().toISOString()}
            </p>
          </div>
        `,
      }

      await transporter.sendMail(mailOptions)
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Thank you! We'll be in touch soon.",
        leadId: lead?.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Public lead API error:', error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}

// Handle preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
