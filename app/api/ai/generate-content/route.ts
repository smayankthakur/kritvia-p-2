import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    // Parse JSON body
    const body = await request.json()
    const { type, prompt, context } = body

    if (!type || !prompt) {
      return NextResponse.json(
        { error: 'Type and prompt are required' },
        { status: 400 }
      )
    }

    // Define system prompts for different content types
    const systemPrompts: Record<string, string> = {
      'blog-post': `You are an expert content writer specializing in creating engaging, informative blog posts. Write in a professional yet accessible tone. Structure your response with clear headings, subheadings, and paragraphs. Include an engaging introduction, well-organized body content, and a compelling conclusion.`,
      'product-description': `You are an expert copywriter specializing in product descriptions. Create compelling, benefit-driven descriptions that highlight key features and value propositions. Focus on how the product solves customer problems and improves their lives.`,
      'case-study': `You are an expert case study writer. Create structured case studies with clear sections: Challenge, Solution, Results. Use specific metrics and measurable outcomes when possible. Write in a professional, authoritative tone.`,
      'landing-page': `You are an expert landing page copywriter. Create persuasive copy with a clear value proposition, compelling headline, subheadings, benefit-focused sections, and strong calls-to-action. Focus on conversion optimization.`,
      'seo-meta': `You are an SEO expert. Create optimized meta titles and descriptions that are compelling, include target keywords naturally, and stay within character limits (title: ~60 chars, description: ~160 chars).`,
      'summary': `You are an expert at creating concise, informative summaries. Extract the key points and main ideas from the provided content, maintaining accuracy while reducing length significantly.`
    }

    const systemPrompt = systemPrompts[type] || systemPrompts['blog-post']

    // Prepare messages for OpenAI
    const messages: Array<{role: 'system' | 'user'; content: string}> = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: context 
          ? `Context: ${context}\n\nTask: ${prompt}` 
          : prompt
      }
    ]

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
    })

    const generatedContent = completion.choices[0].message.content

    return NextResponse.json({
      success: true,
      content: generatedContent,
      type,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('AI Content Generation Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}