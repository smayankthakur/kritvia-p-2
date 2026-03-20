/**
 * AI SDR Agent (Sales Development Representative)
 * Autonomous outbound sales agent
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface Lead {
  id: string
  name: string
  email: string
  company?: string
  industry?: string
  status: string
  score?: number
  source?: string
  created_at: string
}

export interface OutreachMessage {
  subject: string
  body: string
  channel: 'email' | 'linkedin' | 'whatsapp'
}

// ICP (Ideal Customer Profile) definitions
const icpCriteria = {
  industries: ['real-estate', 'saas', 'startup', 'marketing', 'sales', 'finance', 'healthcare'],
  companySizes: ['startup', 'small', 'medium', 'enterprise'],
  signals: ['recent_funding', 'hiring', 'expansion', 'new_product'],
}

// Score lead based on ICP fit
export function scoreLeadByICP(lead: Partial<Lead>): number {
  let score = 0

  // Base score from existing lead score
  if (lead.score) score += lead.score * 0.3

  // Industry fit
  if (lead.industry) {
    if (icpCriteria.industries.includes(lead.industry.toLowerCase())) {
      score += 30
    }
  }

  // Company signals (mock - would come from enrichment)
  if (lead.company) {
    score += 20
  }

  // Source quality
  if (lead.source === 'seo' || lead.source === 'referral') {
    score += 20
  }

  return Math.min(100, Math.round(score))
}

// Generate personalized outreach message
export async function generateOutreachMessage(
  lead: Lead,
  template?: string,
  context?: Record<string, string>
): Promise<OutreachMessage> {
  // Personalization variables
  const personalization = {
    '{{name}}': lead.name.split(' ')[0],
    '{{first_name}}': lead.name.split(' ')[0],
    '{{company}}': lead.company || 'your company',
    '{{industry}}': lead.industry || 'your industry',
    ...context,
  }

  // Default templates based on lead score
  let defaultTemplate = template

  if (!defaultTemplate) {
    const leadScore = scoreLeadByICP(lead)

    if (leadScore >= 70) {
      // High-intent lead - direct, value-focused
      defaultTemplate = `Hi {{first_name}},

I noticed {{company}} is doing some impressive work in the {{industry}} space.

We help companies like yours generate 40% more leads and close deals 3x faster with AI automation.

Would you be open to a quick 15-minute call this week? I'd love to share how we're helping similar companies scale.

Best regards`
    } else if (leadScore >= 40) {
      // Medium intent - softer approach
      defaultTemplate = `Hi {{first_name}},

I came across {{company}} and thought there might be an opportunity to help.

We've been seeing great results with {{industry}} companies using AI to automate their sales process - typically seeing 40% improvement in lead conversion.

Would you be open to a brief conversation? No pressure at all.

Cheers`
    } else {
      // Low intent - educational
      defaultTemplate = `Hi {{first_name}},

I wanted to reach out because I think what you're building at {{company}} is exciting.

We work with companies in {{industry}} to help them scale their operations with AI - happy to share some insights that might be useful even if you're not looking now.

No pressure - just thought I'd put this on your radar.

Best`
    }
  }

  // Apply personalization
  let subject = ''
  let body = defaultTemplate

  // Generate subject line
  const subjectLines = [
    `Quick question for ${lead.company || 'you'}`,
    `Thoughts on scaling ${lead.industry || 'your business'}?`,
    `${lead.name.split(' ')[0]}, have a minute?`,
    'Ideas for growing your business',
  ]
  subject = subjectLines[Math.floor(Math.random() * subjectLines.length)]

  // Replace variables
  for (const [key, value] of Object.entries(personalization)) {
    body = body.replace(new RegExp(key, 'g'), value)
    subject = subject.replace(new RegExp(key, 'g'), value)
  }

  return {
    subject,
    body,
    channel: 'email',
  }
}

// Schedule follow-up based on lead behavior
export function calculateFollowUpSchedule(
  leadStatus: string,
  daysSinceLastContact: number,
  responseType?: 'replied' | 'opened' | 'clicked' | 'none'
): Date {
  const now = new Date()
  let delayDays = 2

  switch (responseType) {
    case 'replied':
      delayDays = 0 // Immediate follow-up
      break
    case 'clicked':
      delayDays = 1
      break
    case 'opened':
      delayDays = 2
      break
    case 'none':
      delayDays = Math.min(7, daysSinceLastContact + 2)
      break
    default:
      delayDays = daysSinceLastContact > 0 ? daysSinceLastContact + 1 : 3
  }

  now.setDate(now.getDate() + delayDays)
  return now
}

// Update lead score based on outcome
export async function updateLeadScore(
  leadId: string,
  outcome: 'positive' | 'negative' | 'neutral',
  reason?: string
): Promise<number> {
  const { data: lead } = await supabase
    .from('leads')
    .select('score')
    .eq('id', leadId)
    .single()

  if (!lead) return 0

  let scoreDelta = 0

  switch (outcome) {
    case 'positive':
      scoreDelta = 20 // Meeting booked, positive response
      break
    case 'negative':
      scoreDelta = -10 // Unsubscribed, negative response
      break
    case 'neutral':
      scoreDelta = 0
      break
  }

  const newScore = Math.max(0, Math.min(100, (lead.score || 0) + scoreDelta))

  await supabase
    .from('leads')
    .update({ score: newScore, updated_at: new Date().toISOString() })
    .eq('id', leadId)

  return newScore
}

// Analyze lead intent
export function analyzeLeadIntent(lead: Lead): {
  intent: 'hot' | 'warm' | 'cold'
  recommendation: string
  priority: number
} {
  const score = lead.score || 0

  if (score >= 70) {
    return {
      intent: 'hot',
      recommendation: 'Schedule demo immediately',
      priority: 1,
    }
  }

  if (score >= 40) {
    return {
      intent: 'warm',
      recommendation: 'Send value content, follow up in 2 days',
      priority: 2,
    }
  }

  return {
    intent: 'cold',
    recommendation: 'Add to nurture sequence',
    priority: 3,
  }
}

// Send outreach (integration point for email service)
export async function sendOutreach(
  leadId: string,
  message: OutreachMessage,
  workspaceId: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Get lead email
    const { data: lead } = await supabase
      .from('leads')
      .select('email, name')
      .eq('id', leadId)
      .single()

    if (!lead) {
      return { success: false, error: 'Lead not found' }
    }

    // Get workspace for sender info
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('name, settings')
      .eq('id', workspaceId)
      .single()

    // Send real email using nodemailer
    const nodemailer = await import('nodemailer')
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: `"${workspace?.name || 'Kritvia'}" <${process.env.EMAIL_USER}>`,
      to: lead.email,
      subject: message.subject,
      text: message.body,
      html: `<p>${message.body.replace(/\n/g, '<br>')}</p>`,
    }

    let emailSent = false
    let emailError: Error | null = null

    // Try sending email up to 3 times
    for (let attempt = 0; attempt < 3 && !emailSent; attempt++) {
      try {
        await transporter.sendMail(mailOptions)
        emailSent = true
      } catch (err) {
        emailError = err as Error
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
      }
    }

    if (!emailSent) {
      console.error('Email send failed:', emailError)
      // Still store in DB even if email fails
    }

    // Store outreach in database
    const { data, error } = await supabase
      .from('outreach_sequences')
      .insert({
        lead_id: leadId,
        workspace_id: workspaceId,
        message: `${message.subject}\n\n${message.body}`,
        channel: message.channel,
        status: emailSent ? 'sent' : 'failed',
        score: scoreLeadByICP({ id: leadId }),
        sent_at: emailSent ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) throw error

    // Log agent decision
    await supabase.from('agent_decisions').insert({
      agent_type: 'sdr',
      decision_type: 'send_outreach',
      context: { lead_id: leadId, channel: message.channel, email_sent: emailSent },
      decision: { subject: message.subject, preview: message.body.substring(0, 100) },
      confidence: 0.85,
    })

    return { 
      success: emailSent, 
      messageId: data?.id,
      error: emailSent ? undefined : 'Email failed but stored in queue'
    }
  } catch (error) {
    console.error('Error sending outreach:', error)
    return { success: false, error: String(error) }
  }
}

// Get leads ready for outreach
export async function getLeadsForOutreach(
  workspaceId: string,
  limit: number = 10
): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('workspace_id', workspaceId)
    .in('status', ['new', 'contacted'])
    .order('score', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching leads:', error)
    return []
  }

  return data || []
}

// Process reply from lead
export async function processReply(
  leadId: string,
  replyContent: string,
  sentiment?: 'positive' | 'negative' | 'neutral'
): Promise<{
  response: string
  action: 'book_meeting' | 'continue_nurture' | 'remove_from_sequence'
}> {
  // Simple sentiment analysis (would use AI in production)
  const sentimentScore = sentiment || analyzeSentiment(replyContent)

  let action: 'book_meeting' | 'continue_nurture' | 'remove_from_sequence'
  let response = ''

  if (sentimentScore === 'positive') {
    action = 'book_meeting'
    response = `Thanks for your interest! I'll schedule a call with you shortly.`
    await updateLeadScore(leadId, 'positive', 'Positive reply to outreach')
  } else if (sentimentScore === 'negative') {
    action = 'remove_from_sequence'
    response = `No problem at all. I'll remove you from our outreach.`
    await updateLeadScore(leadId, 'negative', 'Negative reply')
  } else {
    action = 'continue_nurture'
    response = `Thanks for getting back! Let me share some resources that might help.`
  }

  // Update outreach record
  await supabase
    .from('outreach_sequences')
    .update({
      status: 'replied',
      replied_at: new Date().toISOString(),
      sentiment: sentimentScore,
    })
    .eq('lead_id', leadId)

  return { response, action }
}

// Simple sentiment analysis
function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['interested', 'yes', 'sure', 'love', 'great', 'thanks', 'appreciate']
  const negativeWords = ['no', 'not', 'stop', 'remove', 'unsubscribe', 'never']

  const lowerText = text.toLowerCase()

  const positiveCount = positiveWords.filter(w => lowerText.includes(w)).length
  const negativeCount = negativeWords.filter(w => lowerText.includes(w)).length

  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

export default {
  scoreLeadByICP,
  generateOutreachMessage,
  calculateFollowUpSchedule,
  updateLeadScore,
  analyzeLeadIntent,
  sendOutreach,
  getLeadsForOutreach,
  processReply,
}
