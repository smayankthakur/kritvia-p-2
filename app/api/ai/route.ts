import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/ai.service'
import { getUser } from '@/lib/supabase-server'
import { validateInput, aiChatSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input with Zod
    const validation = validateInput(aiChatSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { prompt, context } = validation.data

    // Use the AI service
    const response = await aiService.chat(prompt, context)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('AI API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
