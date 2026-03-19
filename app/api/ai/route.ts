import { NextRequest } from 'next/server'
import { getUser } from '@/lib/supabase-server'
import { AIService } from '@/lib/ai.service'
import { getAIContext, canPerformAction, logAIRequest } from '@/lib/crm.service'
import { validateInput, aiChatSchema } from '@/lib/validators'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse, 
  rateLimitResponse,
  serverErrorResponse 
} from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getUser()

    if (!user) {
      return unauthorizedResponse()
    }

    // Rate limit check
    const rateLimitKey = `ai:${user.id}`
    const rateLimitResult = rateLimit(rateLimitKey, RATE_LIMITS.AI)
    
    if (!rateLimitResult.success) {
      return rateLimitResponse()
    }

    // Check plan limits
    const canProceed = await canPerformAction(user.id, 'aiRequest')
    if (!canProceed.allowed) {
      return errorResponse(canProceed.reason || 'Limit reached', 'LIMIT_REACHED', 403)
    }

    const body = await request.json()
    
    // Validate input with Zod
    const validation = validateInput(aiChatSchema, body)
    if (!validation.success) {
      return errorResponse(validation.error)
    }

    const { prompt, context } = validation.data

    // Get user data for context
    const userContext = await getAIContext(user.id)

    // Generate context string from user data
    const contextString = context || `
Current Business Data:
- Total Leads: ${userContext.metrics.totalLeads}
- Total Deals: ${userContext.metrics.totalDeals}
- Total Revenue: ₹${userContext.metrics.totalRevenue.toLocaleString()}
- Conversion Rate: ${userContext.metrics.conversionRate}%

Recent Leads: ${JSON.stringify(userContext.leads.slice(0, 5).map(l => ({ name: l.name, email: l.email, status: l.status })))}
Recent Deals: ${JSON.stringify(userContext.deals.slice(0, 5).map(d => ({ title: d.title, value: d.value, stage: d.stage })))}
`

    // Call AI service
    const aiService = new AIService()
    const response = await aiService.chat(prompt, contextString)

    // Log the request
    await logAIRequest(user.id, prompt, response)

    // Return structured response
    return successResponse({
      response,
      insights: extractInsights(response),
      usage: {
        remaining: rateLimitResult.remaining,
      }
    })
  } catch (error) {
    console.error('AI API Error:', error)
    return serverErrorResponse()
  }
}

// Extract structured insights from AI response
function extractInsights(response: string): { type: string; content: string }[] {
  const insights: { type: string; content: string }[] = []
  
  // Simple keyword-based extraction
  if (response.toLowerCase().includes('lead')) {
    insights.push({ type: 'lead', content: 'Related to leads management' })
  }
  if (response.toLowerCase().includes('deal')) {
    insights.push({ type: 'deal', content: 'Related to deal pipeline' })
  }
  if (response.toLowerCase().includes('growth') || response.toLowerCase().includes('increase')) {
    insights.push({ type: 'growth', content: 'Growth opportunity identified' })
  }
  
  return insights
}
