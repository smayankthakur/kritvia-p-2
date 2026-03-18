import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, context } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are Kritvia, an AI business operating system assistant. You help businesses with CRM management, leads, deals, and growth strategy. 

Your role is to provide actionable insights, answer questions about their business data, and help them make better decisions.

Current user context:
${context || 'No business data available yet. Ask the user to add leads and deals to get personalized insights.'}

Guidelines:
- Be concise and actionable
- Use bullet points when listing insights
- Focus on business value
- If you don't have enough data, ask the user to add more
- Keep responses under 300 words unless detailed analysis is requested
- Always be professional and helpful`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'I could not generate a response.'

    return NextResponse.json({ response })
  } catch (error) {
    console.error('AI API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
